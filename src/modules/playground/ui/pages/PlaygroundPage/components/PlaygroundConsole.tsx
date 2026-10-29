import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import type { RunResult } from 'modules/playground/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface Props {
  input: string;
  busy: boolean;
  result: RunResult | null;
  stale: boolean;
  onInput: (value: string) => void;
}

export const PlaygroundConsole = ({ input, busy, result, stale, onInput }: Props) => {
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState<'copied' | 'copyFailed' | null>(null);
  const timer = useRef<number>(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const verdict = result?.verdict;
  const status = busy
    ? (result?.status ?? 'queued')
    : result?.status === 'finished'
      ? verdict === 1
        ? 'success'
        : verdict === 8
          ? 'compileError'
          : verdict === 3 || verdict === 10
            ? 'timeLimit'
            : verdict === 6
              ? 'memoryLimit'
              : 'runtimeError'
      : result?.status === 'expired'
        ? 'expired'
        : result?.status === 'failed'
          ? 'failed'
          : 'ready';
  const output =
    result?.output || result?.error || (status === 'success' ? t('playground.noOutput') : '');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result?.output ?? '');
      setCopyState('copied');
    } catch {
      setCopyState('copyFailed');
    }
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopyState(null), 1800);
  };
  return (
    <Box className="playground-console">
      <Box className="playground-input-panel">
        <Box className="playground-stream-heading">
          <span>
            <span aria-hidden="true">↳</span> {t('playground.input')}
          </span>
          <small>stdin</small>
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          value={input}
          disabled={busy}
          placeholder={t('playground.inputPlaceholder')}
          onChange={(event) => onInput(event.target.value)}
          slotProps={{
            htmlInput: { maxLength: 65536, spellCheck: false, 'aria-label': t('playground.input') },
          }}
        />
      </Box>
      <Box className="playground-output-panel" data-busy={busy}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Box className="playground-stream-heading">
            <span>
              <span aria-hidden="true">↗</span> {t('playground.output')}
            </span>
            <small>stdout</small>
          </Box>
          <Chip
            size="small"
            label={t(`playground.status.${status}`)}
            color={!busy && verdict === 1 ? 'success' : !busy && verdict ? 'error' : 'default'}
          />
        </Stack>
        {stale && (
          <Typography className="playground-stale" role="status">
            {t('playground.stale')}
          </Typography>
        )}
        {output && !busy ? (
          <Box
            key={result?.id}
            component="pre"
            className="playground-result"
            aria-live="polite"
            sx={{ color: result?.error ? 'error.main' : 'text.primary' }}
          >
            {output}
          </Box>
        ) : (
          <Box className="playground-terminal-empty">
            <Box className="playground-terminal-symbol" aria-hidden="true">
              <span>&gt;_</span>
              {busy && (
                <span className="playground-execution-signal">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </Box>
            <Box>
              <Typography component="strong">
                {t(busy ? 'playground.waitingTitle' : 'playground.emptyTitle')}
              </Typography>
              <Typography>{t(busy ? 'playground.waiting' : 'playground.empty')}</Typography>
            </Box>
          </Box>
        )}
        {result?.output && result.error && (
          <Box component="pre" className="playground-diagnostic">
            {result.error}
          </Box>
        )}
        <Box className="playground-result-footer">
          <Typography variant="caption" color="text.secondary">
            {result?.status === 'finished'
              ? `${result.time} ms · ${result.memory} MB`
              : 'KEPLang · UTF-8'}
          </Typography>
          <Button
            size="small"
            onClick={() => void copy()}
            disabled={!result?.output || busy}
            startIcon={<IconifyIcon icon="mdi:content-copy" />}
          >
            {t(`playground.${copyState ?? 'copyOutput'}`)}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
