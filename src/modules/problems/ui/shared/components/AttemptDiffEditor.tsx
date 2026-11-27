import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Monaco, type MonacoDiffEditor, loader } from '@monaco-editor/react';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';

interface AttemptDiffEditorProps {
  original: string;
  modified: string;
  language: string;
  sideBySide: boolean;
}

const AttemptDiffEditor = ({ original, modified, language, sideBySide }: AttemptDiffEditorProps) => {
  const { t } = useTranslation();
  const { theme, beforeMount } = useMonacoTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<{ monaco: Monaco; editor: MonacoDiffEditor } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const initialize = useEffectEvent((monaco: Monaco, container: HTMLDivElement) => {
    beforeMount(monaco);
    monaco.editor.setTheme(theme);
    const editor = monaco.editor.createDiffEditor(container, {
      readOnly: true,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      automaticLayout: true,
      renderSideBySide: sideBySide,
    });
    const originalModel = monaco.editor.createModel(original, language);
    const modifiedModel = monaco.editor.createModel(modified, language);
    editor.setModel({ original: originalModel, modified: modifiedModel });
    editorRef.current = { monaco, editor };
    setStatus('ready');

    return () => {
      editorRef.current = null;
      // Detach both models before disposal so the diff widget can release its subscriptions.
      editor.setModel(null);
      editor.dispose();
      originalModel.dispose();
      modifiedModel.dispose();
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loading = loader.init();
    let closed = false;
    let disposeEditor: (() => void) | undefined;
    void loading
      .then((monaco) => {
        if (!closed) disposeEditor = initialize(monaco, container);
      })
      .catch(() => {
        if (!closed) setStatus('error');
      });

    return () => {
      closed = true;
      loading.cancel();
      disposeEditor?.();
    };
  }, []);

  useEffect(() => {
    const active = editorRef.current;
    const models = active?.editor.getModel();
    if (!active || !models) return;

    if (models.original.getValue() !== original) models.original.setValue(original);
    if (models.modified.getValue() !== modified) models.modified.setValue(modified);
    active.monaco.editor.setModelLanguage(models.original, language);
    active.monaco.editor.setModelLanguage(models.modified, language);
    active.monaco.editor.setTheme(theme);
    active.editor.updateOptions({ renderSideBySide: sideBySide });
  }, [language, modified, original, sideBySide, theme]);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box ref={containerRef} sx={{ height: '100%' }} />
      {status !== 'ready' ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'absolute', inset: 0, p: 2 }}
        >
          {status === 'error' ? (
            <Alert severity="error">{t('common.loadFailed')}</Alert>
          ) : (
            <Typography role="status" color="text.secondary">
              {t('common.loading')}
            </Typography>
          )}
        </Stack>
      ) : null}
    </Box>
  );
};

export default AttemptDiffEditor;
