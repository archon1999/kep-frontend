import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type OnMount } from '@monaco-editor/react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import type { RunnerLanguage } from 'modules/playground/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { CodeEditor } from 'shared/components/code-workspace/CodeEditor';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { CodePlayback, useCodePlayback } from './CodePlayback';

interface Props {
  language: RunnerLanguage;
  fileName: string;
  code: string;
  busy: boolean;
  draftStored: boolean;
  byteLength: number;
  valid: boolean;
  sample: boolean;
  playbackVersion: number;
  onChange: (value: string) => void;
  onRun: () => void;
}

export const PlaygroundEditor = ({
  language,
  fileName,
  code,
  busy,
  draftStored,
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
  const initialSample = useRef(sample);
  const initialCode = useRef(code);
  const disposeCursor = useRef<(() => void) | null>(null);
  const playRef = useRef(playback.play);
  playRef.current = playback.play;
  const canReplay = useRef(false);
  canReplay.current = sample && language.id === 'kep';
  useEffect(() => {
    if (playbackVersion > 0 && canReplay.current) playRef.current();
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

  const mount: OnMount = (editor) => {
    disposeCursor.current?.();
    const subscription = editor.onDidChangeCursorPosition((event) => {
      setCursor({ line: event.position.lineNumber, column: event.position.column });
    });
    const focus = editor.onDidFocusEditorText(playback.stop);
    disposeCursor.current = () => {
      subscription.dispose();
      focus.dispose();
    };
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
          <span>{fileName}</span>
          <small>{language.label}</small>
        </Box>
        {language.id === 'kep' && (
          <Button
            size="small"
            className="playground-replay"
            disabled={busy || reduced || !sample}
            onClick={playback.playing ? playback.stop : playback.play}
            startIcon={<IconifyIcon icon={playback.playing ? 'mdi:stop' : 'mdi:play-outline'} />}
          >
            {t(playback.playing ? 'playground.stopPreview' : 'playground.preview')}
          </Button>
        )}
      </Box>
      <Box
        className="playground-editor-surface"
        data-playing={playback.playing}
        onPointerDownCapture={playback.stop}
        onKeyDownCapture={(event) => {
          if (event.key !== 'Tab') playback.stop();
        }}
      >
        <CodeEditor
          language={language.editorLanguage}
          onRun={onRun}
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
            ariaLabel: t('playground.editor'),
            readOnly: busy,
            renderLineHighlightOnlyWhenFocus: true,
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
                : draftStored
                  ? 'playground.saved'
                  : 'playground.storageUnavailable',
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
