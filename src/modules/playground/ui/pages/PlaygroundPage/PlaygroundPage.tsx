import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, LinearProgress, Typography, useMediaQuery } from '@mui/material';
import { examples, usePlayground } from 'modules/playground/application';
import { WorkspaceSplit } from 'shared/components/code-workspace/WorkspaceSplit';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';
import { PlaygroundConsole } from './components/PlaygroundConsole';
import { PlaygroundEditor } from './components/PlaygroundEditor';
import { PlaygroundHeader, PlaygroundRunButton } from './components/PlaygroundHeader';
import { PlaygroundToolbar } from './components/PlaygroundToolbar';
import './playground.css';

const PlaygroundPage = () => {
  const { t } = useTranslation();
  const model = usePlayground();
  const compact = useMediaQuery('(max-width: 899px)');
  const [sideBySide, setSideBySide] = useState(false);
  const [playbackVersion, setPlaybackVersion] = useState(0);
  const run = useRef(model.run);
  run.current = model.run;
  useEffect(() => {
    const hotkey = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey &&
        (event.key === 'Enter' || event.code === 'Quote')
      ) {
        event.preventDefault();
        void run.current();
      }
    };
    window.addEventListener('keydown', hotkey);
    return () => window.removeEventListener('keydown', hotkey);
  }, []);
  const sample =
    model.selectedLang === 'kep' &&
    examples.some((item) => item.code === model.draft.code && item.input === model.draft.input);
  return (
    <WorkspaceRoot className="runner-page" data-busy={model.busy}>
      <PlaygroundHeader
        busy={model.busy}
        valid={model.valid && model.languageReady}
        onRun={() => void model.run()}
      />
      <PlaygroundToolbar
        model={model}
        sideBySide={sideBySide}
        onLayout={() => setSideBySide((value) => !value)}
        onExample={(id) => {
          model.selectExample(id);
          setPlaybackVersion((value) => value + 1);
        }}
      />
      {(model.busy || model.languagesLoading) && (
        <LinearProgress aria-label={t(model.busy ? 'playground.running' : 'common.loading')} />
      )}
      {model.catalogueError && (
        <Alert
          severity="warning"
          action={<Button onClick={model.retryLanguages}>{t('common.retry')}</Button>}
        >
          {t('playground.languagesFailed')}
        </Alert>
      )}
      {model.error && <Alert severity="warning">{t(`playground.errors.${model.error}`)}</Alert>}
      {!model.valid && <Alert severity="warning">{t('playground.validation')}</Alert>}
      <Box component="main" id="main-content" className="runner-main">
        <WorkspaceSplit
          direction={!compact && sideBySide ? 'horizontal' : 'vertical'}
          autoSaveId={
            compact ? undefined : sideBySide ? 'playground-columns-v1' : 'playground-rows-v1'
          }
          editor={
            <PlaygroundEditor
              key={model.selectedLang}
              language={model.language}
              fileName={model.fileName}
              code={model.draft.code}
              busy={model.busy}
              draftStored={model.draftStored}
              byteLength={model.byteLength}
              valid={model.valid}
              sample={sample}
              playbackVersion={playbackVersion}
              onChange={model.setCode}
              onRun={() => void model.run()}
            />
          }
          console={
            <PlaygroundConsole
              input={model.draft.input}
              busy={model.busy}
              result={model.result}
              stale={model.resultIsStale}
              onInput={model.setInput}
            />
          }
        />
      </Box>
      <Box component="footer" className="runner-footer">
        <Typography variant="caption" color="text.secondary" title={t('playground.limits')}>
          {model.language.label}
          <span className="runner-footer-limits">
            {' '}
            · {model.language.timeLimit} ms · {model.language.memoryLimit} MB
          </span>
        </Typography>
        <Typography variant="caption" color="text.secondary" className="runner-desktop-hint">
          {t('playground.subtitle')} · Ctrl + Enter
        </Typography>
        <Box className="runner-mobile-action">
          <PlaygroundRunButton
            busy={model.busy}
            disabled={!model.valid || !model.languageReady}
            onRun={() => void model.run()}
          />
        </Box>
      </Box>
    </WorkspaceRoot>
  );
};
export default PlaygroundPage;
