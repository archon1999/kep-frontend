import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { getResourceById, resources } from 'app/routes/resources';
import { Duel, DuelDetailPageNavigationProblem } from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo.tsx';
import MixedText from 'shared/components/common/MixedText';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';

export type DuelDetailPageHeaderProps = {
  duel: Duel;
  timerText: string;
  problems: DuelDetailPageNavigationProblem[];
  currentProblem: DuelDetailPageNavigationProblem | null;
  prevProblem: DuelDetailPageNavigationProblem | null;
  nextProblem: DuelDetailPageNavigationProblem | null;
  hasCurrentUser: boolean;
  hasCode: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  isWorkspaceLocked: boolean;
  isSubmitLocked: boolean;
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

  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
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
  const currentProblem =
    currentIndex >= 0 ? navigationProblems[currentIndex] : (navigationProblems[0] ?? null);
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
    const targetTime = new Date(target).getTime();
    if (Number.isNaN(targetTime)) {
      setTimerText('');
      return;
    }

    const render = () => {
      const prefix = duel.status === -1 ? t('duels.startsIn') : t('duels.timeLeft');
      setTimerText(`${prefix}: ${countdown(target)}`);

      if (targetTime > Date.now()) return;

      const refreshMarker = `${duel.id}:${duel.status}:${target}`;
      const refreshStorageKey = 'duel:auto-refresh-at-zero';
      if (window.sessionStorage.getItem(refreshStorageKey) === refreshMarker) return;

      window.sessionStorage.setItem(refreshStorageKey, refreshMarker);
      window.location.reload();
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
    problems: navigationProblems,
    currentProblem,
    prevProblem,
    nextProblem,
    onSelectProblem: (symbol: string) => setField('problem', symbol),
  };
};

const DuelDetailPageHeader = ({
  duel,
  timerText,
  currentProblem,
  prevProblem,
  nextProblem,
  problems,
  hasCode,
  isRunning,
  isSubmitting,
  isWorkspaceLocked,
  isSubmitLocked,
  onRun,
  onSubmit,
  onSelectProblem,
}: DuelDetailPageHeaderProps) => {
  const { t } = useTranslation();
  const originalHref = currentProblem?.problemId
    ? getResourceById(resources.Problem, currentProblem.problemId)
    : null;
  const timerValue = duel.status === 1 ? timerText : timerText.slice(timerText.indexOf(': ') + 2);
  return (
    <Box
      component="header"
      className="kep-duel-workspace-header"
      sx={{ flexShrink: 0, minWidth: 0, bgcolor: 'background.default' }}
    >
      <Stack
        direction="row"
        gap={{ xs: 1.25, md: 2.5 }}
        alignItems="center"
        sx={{ px: { xs: 1.5, md: 3 }, minHeight: 52, borderBottom: '1px solid var(--kep-line)' }}
      >
        <Logo showName={false} />
        <Tooltip title={t('common.backTo', { destination: t('duels.title') })}>
          <IconButton
            component={RouterLink}
            to={resources.Duels}
            size="small"
            aria-label={t('common.backTo', { destination: t('duels.title') })}
          >
            <IconifyIcon icon="mdi:arrow-left" />
          </IconButton>
        </Tooltip>
        <Typography
          sx={{
            fontFamily: 'var(--kep-display-font)',
            fontSize: { xs: 16, md: 19 },
            fontWeight: 500,
            flex: 1,
            minWidth: 0,
          }}
          noWrap
        >
          <MixedText>{t('duels.duelNumber', { id: duel.id })}</MixedText>
        </Typography>
        {timerText && (
          <Tooltip title={timerText}>
            <Stack
              direction="row"
              gap={0.75}
              alignItems="center"
              sx={{ flexShrink: 0, color: duel.status === 1 ? 'text.secondary' : 'primary.main' }}
            >
              <IconifyIcon
                icon={duel.status === 1 ? 'mdi:check-circle-outline' : 'mdi:timer-outline'}
                sx={{ fontSize: 18 }}
              />
              <Typography
                variant={duel.status === 1 ? 'caption' : 'metric'}
                sx={{ fontSize: duel.status === 1 ? 13 : { xs: 18, md: 22 }, whiteSpace: 'nowrap' }}
              >
                {timerValue}
              </Typography>
            </Stack>
          </Tooltip>
        )}
        <Stack direction="row" gap={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Tooltip title={t('problems.detail.runHotkey')}>
            <span>
              <Button
                variant="outlined"
                onClick={onRun}
                disabled={isRunning || !hasCode || isWorkspaceLocked}
                loading={isRunning}
                startIcon={<IconifyIcon icon="mdi:play-outline" />}
              >
                {t('problems.detail.run')}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.submitHotkey')}>
            <span>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={isSubmitting || !hasCode || isSubmitLocked}
                loading={isSubmitting}
                endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
              >
                <ScrambleText>{t('problems.detail.submit')}</ScrambleText>
              </Button>
            </span>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            pl: 2,
            borderInlineStart: '1px solid var(--kep-line)',
          }}
        >
          <AppbarActionItems type="slim" />
        </Box>
      </Stack>
      <WorkspaceToolbar
        component="nav"
        aria-label={t('duels.workspaceNavigation')}
        sx={{ minHeight: 40, py: 0, gap: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minWidth: 0,
            overflowX: 'auto',
            flex: 1,
            py: 0.5,
          }}
        >
          {problems.map((problem) => (
            <Button
              key={problem.symbol}
              size="small"
              aria-pressed={problem.symbol === currentProblem?.symbol}
              disabled={Boolean(problem.isLocked && !problem.unlockAt)}
              onClick={() => onSelectProblem(problem.symbol)}
              startIcon={
                problem.isLocked ? (
                  <IconifyIcon icon="mdi:lock-outline" sx={{ fontSize: 13 }} />
                ) : undefined
              }
              sx={{
                minWidth: 36,
                borderRadius: 0,
                fontFamily: 'var(--kep-display-font)',
                fontSize: 14,
                color:
                  problem.symbol === currentProblem?.symbol ? 'primary.main' : 'text.secondary',
                bgcolor:
                  problem.symbol === currentProblem?.symbol ? 'action.selected' : 'transparent',
              }}
            >
              {problem.symbol}
            </Button>
          ))}
        </Box>
        <Stack direction="row" gap={0.25} alignItems="center">
          {[
            { problem: prevProblem, icon: 'mdi:chevron-left', label: t('contests.problem.prev') },
            { problem: nextProblem, icon: 'mdi:chevron-right', label: t('contests.problem.next') },
          ].map((item) => (
            <Tooltip key={item.icon} title={item.label}>
              <span>
                <IconButton
                  size="small"
                  aria-label={item.label}
                  disabled={
                    !item.problem || Boolean(item.problem.isLocked && !item.problem.unlockAt)
                  }
                  onClick={() => item.problem && onSelectProblem(item.problem.symbol)}
                >
                  <IconifyIcon icon={item.icon} />
                </IconButton>
              </span>
            </Tooltip>
          ))}
          {duel.status === 1 && originalHref && (
            <Tooltip title={t('contests.problem.openOriginal')}>
              <IconButton
                component={RouterLink}
                to={originalHref}
                size="small"
                aria-label={t('contests.problem.openOriginal')}
              >
                <IconifyIcon icon="mdi:open-in-new" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </WorkspaceToolbar>
    </Box>
  );
};
export default DuelDetailPageHeader;
