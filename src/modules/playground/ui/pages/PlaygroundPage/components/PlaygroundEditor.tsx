import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { CodePlayback, useCodePlayback } from './CodePlayback';

interface Props {
  code: string;
  busy: boolean;
  byteLength: number;
  valid: boolean;
  sample: boolean;
  playbackVersion: number;
  onChange: (value: string) => void;
  onRun: () => void;
}

export const PlaygroundEditor = ({
  code,
  busy,
  byteLength,
  valid,
  sample,
  playbackVersion,
  onChange,
  onRun,
}: Props) => {
  const { t } = useTranslation();
  const editorTheme = useMonacoTheme();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const playback = useCodePlayback(code, reduced);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [typing, setTyping] = useState(false);
  const timer = useRef<number>(0);
  const runRef = useRef(onRun);
  runRef.current = onRun;
  const initialSample = useRef(sample);
  const initialCode = useRef(code);
  const disposeCursor = useRef<(() => void) | null>(null);
  const playRef = useRef(playback.play);
  playRef.current = playback.play;
  useEffect(() => {
    if (playbackVersion > 0) playRef.current();
  }, [playbackVersion]);
  useEffect(() => {
    if (busy) playback.stop();
  }, [busy, playback.stop]);
  useEffect(() => {
    if (!sample) playback.stop();
  }, [sample, playback.stop]);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      disposeCursor.current?.();
    },
    [],
  );

  const mount: OnMount = (editor, monaco) => {
    disposeCursor.current?.();
    const subscription = editor.onDidChangeCursorPosition((event) => {
      setCursor({ line: event.position.lineNumber, column: event.position.column });
    });
    disposeCursor.current = () => subscription.dispose();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
    void document.fonts.ready.then(() => monaco.editor.remeasureFonts());
    if (initialSample.current && code === initialCode.current && !document.hidden)
      playRef.current();
  };

  return (
    <Box
      className="playground-editor-pane"
      data-dark={editorTheme.theme.includes('dark')}
      data-typing={typing}
      data-playing={playback.playing}
    >
      <Box className="playground-filebar">
        <Box className="playground-file-label">
          <span className="playground-file-dot" aria-hidden="true" />
          <span>main.kep</span>
          <small>KEPLang</small>
        </Box>
        <Button
          size="small"
          className="playground-replay"
          disabled={busy || reduced || !sample}
          onClick={playback.playing ? playback.stop : playback.play}
          startIcon={<IconifyIcon icon={playback.playing ? 'mdi:stop' : 'mdi:play-outline'} />}
        >
          {t(playback.playing ? 'playground.stopPreview' : 'playground.preview')}
        </Button>
      </Box>
      <Box
        className="playground-editor-surface"
        data-playing={playback.playing}
        onPointerDownCapture={playback.stop}
        onKeyDownCapture={(event) => {
          if (event.key !== 'Tab') playback.stop();
        }}
      >
        <Editor
          height="460px"
          language="keplang"
          theme={editorTheme.theme}
          beforeMount={editorTheme.beforeMount}
          onMount={mount}
          value={code}
          onChange={(value) => {
            playback.stop();
            setTyping(true);
            clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setTyping(false), 500);
            onChange(value ?? '');
          }}
          options={{
            minimap: { enabled: false },
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            lineHeight: 27,
            fontLigatures: false,
            padding: { top: 22, bottom: 22 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            ariaLabel: t('playground.editor'),
            readOnly: busy,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            renderLineHighlightOnlyWhenFocus: true,
            cursorSmoothCaretAnimation: reduced ? 'off' : 'on',
            cursorBlinking: reduced ? 'solid' : 'smooth',
            smoothScrolling: !reduced,
            bracketPairColorization: { enabled: true },
            guides: { indentation: true, bracketPairs: true },
            overviewRulerLanes: 0,
            scrollbar: { verticalScrollbarSize: 7, horizontalScrollbarSize: 7 },
          }}
        />
        {playback.playing && <CodePlayback prefix={playback.prefix} />}
      </Box>
      <Box className="playground-editor-footer">
        <span>
          <i className="playground-saved-dot" aria-hidden="true" />
          {t(
            playback.playing
              ? 'playground.previewing'
              : typing
                ? 'playground.editing'
                : 'playground.saved',
          )}
        </span>
        <span className="playground-editor-metrics">
          <span>{t('playground.cursor', cursor)}</span>
          <Typography component="span" color={valid ? 'text.secondary' : 'error'}>
            {byteLength} / 30000 B
          </Typography>
        </span>
      </Box>
    </Box>
  );
};
