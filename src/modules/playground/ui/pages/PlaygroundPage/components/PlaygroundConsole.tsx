import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import type { RunResult } from 'modules/playground/domain';
import { ConsoleTextArea } from 'shared/components/code-workspace/ConsoleTextArea';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';

type View = 'input' | 'output' | 'diagnostics';
export const PlaygroundConsole = ({
  input,
  busy,
  result,
  stale,
  onInput,
}: {
  input: string;
  busy: boolean;
  result: RunResult | null;
  stale: boolean;
  onInput: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const id = useId();
  const [view, setView] = useState<View>('input');
  useEffect(() => {
    if (!result) setView('input');
    else if (result.status === 'finished')
      setView(result.error && !result.output ? 'diagnostics' : 'output');
  }, [result?.id, result?.status, result?.error, result?.output]);
  const verdict = result?.verdict;
  const status = busy
    ? (result?.status ?? 'queued')
    : result?.status === 'finished'
      ? verdict === 1
        ? 'success'
        : verdict === 8 || verdict === 11
          ? 'compileError'
          : verdict === 3 || verdict === 10
            ? 'timeLimit'
            : verdict === 6
              ? 'memoryLimit'
              : verdict === 9 || verdict === 0
                ? 'failed'
                : 'runtimeError'
      : result?.status === 'expired'
        ? 'expired'
        : result?.status === 'failed'
          ? 'failed'
          : 'ready';
  const values = { input, output: result?.output ?? '', diagnostics: result?.error ?? '' };
  const labels = {
    input: t('playground.input'),
    output: t('playground.output'),
    diagnostics: t('playground.diagnostics'),
  };
  return (
    <WorkspacePane
      className="runner-console"
      component="section"
      aria-label={t('problems.detail.console')}
    >
      <WorkspaceToolbar sx={{ p: 0, minHeight: 48 }}>
        <Tabs
          value={view}
          onChange={(_, next: View) => setView(next)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label={t('problems.workspace.consoleNavigation')}
          sx={{ flex: 1, minWidth: 0 }}
        >
          {(Object.keys(labels) as View[]).map((key) => (
            <Tab
              key={key}
              value={key}
              label={labels[key]}
              id={`${id}-${key}`}
              aria-controls={`${id}-panel`}
              sx={{ minWidth: 0, minHeight: 48, px: 1.5, fontSize: 12 }}
            />
          ))}
        </Tabs>
        <Chip
          size="small"
          label={t(`playground.status.${status}`)}
          color={!busy && verdict === 1 ? 'success' : !busy && verdict ? 'error' : 'default'}
          sx={{ mr: 1.5 }}
        />
      </WorkspaceToolbar>
      {stale && (
        <Alert className="runner-stale" severity="info" sx={{ py: 0.25, borderRadius: 0 }}>
          {t('playground.stale')}
        </Alert>
      )}
      <Box
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${view}`}
        sx={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative' }}
      >
        <ConsoleTextArea
          label={labels[view]}
          value={values[view]}
          onChange={onInput}
          readOnly={view !== 'input'}
          disabled={busy && view === 'input'}
          maxLength={view === 'input' ? 65536 : undefined}
          placeholder={t(
            view === 'input'
              ? 'playground.inputPlaceholder'
              : busy
                ? 'playground.waiting'
                : view === 'diagnostics'
                  ? 'playground.noDiagnostics'
                  : result?.status === 'finished'
                    ? 'playground.noOutput'
                    : 'playground.empty',
          )}
        />
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <ClipboardButton text={values[view]} iconOnly />
        </Box>
      </Box>
      <Stack
        className="runner-result-footer"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="caption" color="text.secondary">
          {result?.status === 'finished'
            ? `${result.time} ms · ${result.memory} MB`
            : t('playground.privateRun')}
        </Typography>
        <Box component="span" aria-live="polite" className="runner-stream-label">
          {busy && <i className="runner-busy-dot" aria-hidden="true" />}
          {view === 'input' ? 'stdin' : view === 'output' ? 'stdout' : 'stderr'}
        </Box>
      </Stack>
    </WorkspacePane>
  );
};
