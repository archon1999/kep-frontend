import { useRef } from 'react';
import Editor, { type EditorProps } from '@monaco-editor/react';
import { useMediaQuery } from '@mui/material';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { configureRuntimeTypes } from './runtime-types';

export const getEditorLanguage = (lang: string) =>
  ({
    py: 'python',
    kt: 'kotlin',
    cs: 'csharp',
    js: 'javascript',
    ts: 'typescript',
    rs: 'rust',
    kep: 'keplang',
    hs: 'haskell',
  })[lang] || lang;

type Props = Omit<EditorProps, 'language' | 'theme' | 'beforeMount'> & {
  language: string;
  fallbackTheme?: string;
  onRun?: () => void;
};

/** One Monaco configuration for public, problem and contest workspaces. */
export const CodeEditor = ({
  language,
  fallbackTheme,
  onRun,
  onMount,
  options,
  ...props
}: Props) => {
  const theme = useMonacoTheme(fallbackTheme);
  const compact = useMediaQuery('(max-width: 599px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const run = useRef(onRun);
  run.current = onRun;
  return (
    <Editor
      {...props}
      language={getEditorLanguage(language)}
      height="100%"
      theme={theme.theme}
      beforeMount={(monaco) => {
        theme.beforeMount(monaco);
        configureRuntimeTypes(monaco);
      }}
      onMount={(editor, monaco) => {
        if (onRun)
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            if (!editor.getOption(monaco.editor.EditorOption.readOnly)) run.current?.();
          });
        void document.fonts.ready.then(() => monaco.editor.remeasureFonts());
        onMount?.(editor, monaco);
      }}
      options={{
        minimap: { enabled: false },
        fontFamily: '"JetBrains Mono", Consolas, monospace',
        fontSize: compact ? 13 : 14,
        lineHeight: 24,
        fontLigatures: false,
        padding: { top: 18, bottom: 18 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        lineNumbersMinChars: compact ? 3 : 4,
        wordWrap: compact ? 'on' : 'off',
        renderLineHighlight: 'all',
        cursorSmoothCaretAnimation: reduced ? 'off' : 'on',
        cursorBlinking: reduced ? 'solid' : 'smooth',
        smoothScrolling: !reduced,
        bracketPairColorization: { enabled: true },
        guides: { indentation: true, highlightActiveIndentation: true, bracketPairs: true },
        overviewRulerLanes: 0,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        ...options,
      }}
    />
  );
};
