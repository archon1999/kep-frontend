import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Divider, Stack, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { resources } from 'app/routes/resources';
import {
  Duel,
  DuelDetailPageNavigationProblem,
} from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';

export type DuelDetailPageHeaderProps = {
  duel: Duel;
  timerText: string;
  prevProblem: DuelDetailPageNavigationProblem | null;
  nextProblem: DuelDetailPageNavigationProblem | null;
  hasCurrentUser: boolean;
  hasCode: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  isWorkspaceLocked: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onSelectProblem: (symbol: string) => void;
};

type UseDuelDetailPageHeaderStateParams = {
  duel?: Duel | null;
  navigationProblems: DuelDetailPageNavigationProblem[];
};

const countdown = (value?: string | null) => {
  if (!value) return '';
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return '';

  const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${rest}`;
};

export const useDuelDetailPageHeaderState = ({
  duel,
  navigationProblems,
}: UseDuelDetailPageHeaderStateParams) => {
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState<{ problem: string }>({
    defaults: {
      problem: '',
    },
    schema: {
      problem: {
        ...stringParam(),
        param: 'problem',
      },
    },
    historyByKey: {
      problem: 'push',
    },
  });
  const [timerText, setTimerText] = useState('');

  const currentIndex = useMemo(
    () => navigationProblems.findIndex((problem) => problem.symbol === state.problem),
    [navigationProblems, state.problem],
  );
  const prevProblem = currentIndex > 0 ? navigationProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < navigationProblems.length - 1
      ? navigationProblems[currentIndex + 1]
      : null;

  useEffect(() => {
    if (!duel) {
      setTimerText('');
      return;
    }

    if (duel.status === 1) {
      setTimerText(t('duels.status.finished'));
      return;
    }

    const target = duel.status === -1 ? duel.startTime : duel.finishTime;
    if (!target) {
      setTimerText('');
      return;
    }

    const render = () => {
      const prefix = duel.status === -1 ? t('duels.startsIn') : t('duels.timeLeft');
      setTimerText(`${prefix}: ${countdown(target)}`);
    };

    render();
    const interval = window.setInterval(render, 1000);
    return () => window.clearInterval(interval);
  }, [duel, t]);

  if (!duel) {
    return null;
  }

  return {
    duel,
    timerText,
    prevProblem,
    nextProblem,
    onSelectProblem: (symbol: string) => setField('problem', symbol),
  };
};

const DuelDetailPageHeader = ({
  timerText,
  prevProblem,
  nextProblem,
  hasCode,
  isRunning,
  isSubmitting,
  isWorkspaceLocked,
  onRun,
  onSubmit,
  onSelectProblem,
}: DuelDetailPageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
        <Logo showName={false} />

        <Divider orientation="vertical" flexItem />

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 0 }}>
          {timerText ? (
            <Chip
              icon={<IconifyIcon icon="mdi:timer-outline" width={18} height={18} />}
              label={timerText}
              color="primary"
              variant="soft"
              size="medium"
              sx={{
                '& .MuiChip-label': {
                  fontFamily:
                    'Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            />
          ) : null}

          <Button
            component={RouterLink}
            to={resources.Duels}
            startIcon={<IconifyIcon icon="mdi:sword-cross" width={18} height={18} />}
            variant="text"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            {t('duels.title')}
          </Button>

          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.18)' }} />

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={t('contests.problem.prev')}>
              <span style={{ display: 'inline-flex' }}>
                <Button
                  onClick={() => prevProblem && onSelectProblem(prevProblem.symbol)}
                  variant="text"
                  color="primary"
                  disabled={!prevProblem}
                  startIcon={<IconifyIcon icon="mdi:chevron-left" width={18} height={18} />}
                />
              </span>
            </Tooltip>
            <Tooltip title={t('contests.problem.next')}>
              <span style={{ display: 'inline-flex' }}>
                <Button
                  onClick={() => nextProblem && onSelectProblem(nextProblem.symbol)}
                  variant="text"
                  color="primary"
                  disabled={!nextProblem}
                  endIcon={<IconifyIcon icon="mdi:chevron-right" width={18} height={18} />}
                />
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Tooltip title={t('problems.detail.runHotkey')}>
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onRun}
              disabled={isRunning || !hasCode || isWorkspaceLocked}
              startIcon={<IconifyIcon icon="mdi:play-circle-outline" width={20} height={20} />}
            >
              {t('problems.detail.run')}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={t('problems.detail.submitHotkey')}>
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={isSubmitting || !hasCode || isWorkspaceLocked}
              startIcon={<IconifyIcon icon="mdi:send-outline" width={18} height={18} />}
            >
              {t('problems.detail.submit')}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <AppbarActionItems type="slim" />
      </Box>
    </Box>
  );
};

export default DuelDetailPageHeader;
