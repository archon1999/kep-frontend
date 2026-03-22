import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { problemsQueries } from 'modules/problems/application/queries.ts';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import ProblemsAttemptsTable from 'modules/problems/ui/components/ProblemsAttemptsTable.tsx';
import { PanelHandle } from 'modules/problems/ui/components/problem-detail/PanelHandles';
import { ProblemBody } from 'modules/problems/ui/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/components/problem-detail/ProblemEditorSkeleton';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo.tsx';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import useSWR from 'swr';
import { duelsQueries, useDuelDetail } from '../../application/queries.ts';
import { Duel, DuelPlayer } from '../../domain/index.ts';

type WorkspaceView = 'problems' | 'standings';
type WorkspaceTab = 'description' | 'attempts';

interface DuelNavigationProblem {
  symbol: string;
  ball?: number;
  playerFirstBall?: number;
  playerSecondBall?: number;
}

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const countdown = (value?: string | null) => {
  if (!value) return '';
  const seconds = dayjs(value).diff(dayjs(), 'second');
  if (seconds <= 0) return '00:00:00';
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${rest}`;
};

const useProblemPermissions = (permissionsRaw: any) =>
  useMemo(() => {
    if (!permissionsRaw) return { canUseCheckSamples: false };
    if (typeof permissionsRaw === 'string') {
      try {
        permissionsRaw = JSON.parse(permissionsRaw);
      } catch {
        return { canUseCheckSamples: false };
      }
    }

    return {
      canUseCheckSamples: Boolean(
        permissionsRaw.canUseCheckSamples ?? permissionsRaw.can_use_check_samples,
      ),
    };
  }, [permissionsRaw]);

const getPlayerRows = (duel: Duel) =>
  [
    {
      key: 'player_first',
      order: 0,
      accent: 'primary' as const,
      player: duel.playerFirst,
      scoreAccessor: (problem: DuelNavigationProblem) => problem.playerFirstBall ?? 0,
    },
    duel.playerSecond
      ? {
          key: 'player_second',
          order: 1,
          accent: 'secondary' as const,
          player: duel.playerSecond,
          scoreAccessor: (problem: DuelNavigationProblem) => problem.playerSecondBall ?? 0,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    order: number;
    accent: 'primary' | 'secondary';
    player: DuelPlayer;
    scoreAccessor: (problem: DuelNavigationProblem) => number;
  }>;

const getPlayerDisplayName = (player?: DuelPlayer | null) =>
  player?.displayName || player?.username || '--';

const DuelResultsFooter = ({
  duel,
  problems,
  activeSymbol,
  view,
  onSelectProblem,
  onChangeView,
}: {
  duel: Duel;
  problems: DuelNavigationProblem[];
  activeSymbol?: string | null;
  view: WorkspaceView;
  onSelectProblem: (symbol: string) => void;
  onChangeView: (view: WorkspaceView) => void;
}) => {
  const { t } = useTranslation();
  const rows = getPlayerRows(duel);

  if (!rows.length || !problems.length) {
    return null;
  }

  return (
    <Card
      sx={{
        px: 2.5,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        bgcolor: (theme) =>
          alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.22 : 0.72),
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', lg: 'center' }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={(theme) => ({
              width: 'fit-content',
              p: 0.5,
              borderRadius: 999,
              border: '1px solid',
              borderColor: theme.palette.divider,
              bgcolor: alpha(
                theme.palette.background.paper,
                theme.palette.mode === 'dark' ? 0.55 : 0.9,
              ),
            })}
          >
            <Button
              size="small"
              variant={view === 'problems' ? 'contained' : 'text'}
              color="primary"
              onClick={() => onChangeView('problems')}
              startIcon={<IconifyIcon icon="mdi:format-list-bulleted" width={16} height={16} />}
              sx={{ textTransform: 'none', borderRadius: 999 }}
            >
              {t('contests.tabs.problems')}
            </Button>
            <Button
              size="small"
              variant={view === 'standings' ? 'contained' : 'text'}
              color="primary"
              onClick={() => onChangeView('standings')}
              startIcon={<IconifyIcon icon="mdi:podium" width={16} height={16} />}
              sx={{ textTransform: 'none', borderRadius: 999 }}
            >
              {t('duels.standings')}
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {rows.map((row) => (
                  <Chip
                    key={`${row.key}-total`}
                    label={`${getPlayerDisplayName(row.player)}: ${row.player.balls ?? 0}`}
                    color={row.accent}
                    variant="outlined"
                    size="small"
              />
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.25 }}>
          {problems.map((problem) => {
            const isActive = activeSymbol === problem.symbol;

            return (
              <Button
                key={problem.symbol}
                onClick={() => onSelectProblem(problem.symbol)}
                variant={isActive ? 'contained' : 'outlined'}
                color={isActive ? 'primary' : 'inherit'}
                sx={{
                  minWidth: 150,
                  flexShrink: 0,
                  px: 1.5,
                  py: 1.15,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  alignItems: 'stretch',
                }}
              >
                <Stack spacing={0.4} alignItems="flex-start" sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="subtitle2" fontWeight={800}>
                      {problem.symbol}
                    </Typography>
                    <Typography variant="caption" color={isActive ? 'inherit' : 'text.secondary'}>
                      {problem.ball ?? 0} pts
                    </Typography>
                  </Stack>

                    {rows.map((row) => (
                      <Typography
                        key={`${row.key}-${problem.symbol}`}
                        variant="caption"
                        color={isActive ? 'inherit' : 'text.secondary'}
                      >
                      {getPlayerDisplayName(row.player)}: {row.scoreAccessor(problem)}
                      </Typography>
                    ))}
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const themeMode = useThemeMode();
  const permissions = useProblemPermissions(currentUser?.permissions);
  const { id } = useParams<{ id: string }>();
  const duelId = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [timerText, setTimerText] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSamples, setIsCheckingSamples] = useState(false);
  const [checkSamplesResult, setCheckSamplesResult] = useState<
    Array<{
      verdict?: VerdictKey;
      verdictTitle?: string;
      input?: string;
      output?: string;
      answer?: string;
    }>
  >([]);
  const [editorTab, setEditorTab] = useState<'console' | 'samples'>('console');
  const [editorTheme, setEditorTheme] = useState<'vs' | 'vs-dark'>(
    themeMode.mode === 'dark' ? 'vs-dark' : 'vs',
  );
  const actionStatesRef = useRef({
    currentUser,
    hasCode: false,
    isRunning,
    isSubmitting,
    isCheckingSamples,
    canUseCheckSamples: false,
    isWorkspaceLocked: true,
  });
  const actionHandlersRef = useRef({
    onRun: () => {},
    onSubmit: () => {},
    onCheckSamples: () => {},
  });
  const {
    paginationModel: attemptsPagination,
    onPaginationModelChange: onAttemptsPaginationChange,
    pageParams: attemptsPageParams,
  } = useGridPagination({ initialPageSize: 10 });

  const {
    data: duel,
    isLoading,
    isValidating,
    mutate: mutateDuel,
  } = useDuelDetail(Number.isNaN(duelId) ? undefined : duelId);

  useDocumentTitle(
    duel?.playerFirst?.username ? 'pageTitles.duel' : undefined,
    duel
      ? {
          playerFirstUsername: duel.playerFirst.username,
          playerSecondUsername: duel.playerSecond?.username ?? '',
        }
      : undefined,
  );

  const problems = duel?.problems ?? [];
  const view: WorkspaceView = searchParams.get('view') === 'standings' ? 'standings' : 'problems';
  const activeTab: WorkspaceTab =
    searchParams.get('tab') === 'attempts' ? 'attempts' : 'description';
  const navigationProblems = useMemo<DuelNavigationProblem[]>(() => {
    if (problems.length) {
      return problems.map((problem) => ({
        symbol: problem.symbol,
        ball: problem.ball,
        playerFirstBall: problem.playerFirstBall,
        playerSecondBall: problem.playerSecondBall,
      }));
    }

    return (duel?.preset?.problems ?? [])
      .filter((problem) => Boolean(problem.symbol))
      .map((problem) => ({
        symbol: problem.symbol!,
        ball: problem.ball,
      }));
  }, [duel?.preset?.problems, problems]);
  const currentSymbol = searchParams.get('problem');
  const activeNavigationProblem =
    navigationProblems.find((problem) => problem.symbol === currentSymbol) ??
    navigationProblems[0] ??
    null;
  const activeProblem =
    problems.find((problem) => problem.symbol === activeNavigationProblem?.symbol) ?? null;
  const currentIndex = navigationProblems.findIndex(
    (problem) => problem.symbol === activeNavigationProblem?.symbol,
  );
  const prevProblem = currentIndex > 0 ? navigationProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < navigationProblems.length - 1
      ? navigationProblems[currentIndex + 1]
      : null;
  const isWorkspaceLocked = duel?.status === -1 || !activeProblem?.problem;
  const showDuelAttempts = Boolean(duel?.viewerRole && duel.viewerRole !== 'spectator');
  const canUseCheckSamples = Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser);
  const standingsRows = useMemo(() => {
    if (!duel) return [];

    return getPlayerRows(duel)
      .map((row) => ({ ...row, total: row.player.balls ?? 0 }))
      .sort((left, right) => right.total - left.total || left.order - right.order)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [duel]);
  const maxScore = standingsRows.reduce((best, row) => Math.max(best, row.total), 0);

  useEffect(() => {
    setEditorTheme(themeMode.mode === 'dark' ? 'vs-dark' : 'vs');
  }, [themeMode.mode]);

  useEffect(() => {
    if (!navigationProblems.length) return;
    if (currentSymbol && navigationProblems.some((problem) => problem.symbol === currentSymbol)) {
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.set('problem', navigationProblems[0].symbol);
    next.set('tab', activeTab);
    next.set('view', view);
    setSearchParams(next, { replace: true });
  }, [activeTab, currentSymbol, navigationProblems, searchParams, setSearchParams, view]);

  useEffect(() => {
    if (!duel) return;
    if (duel.status === 1) {
      setTimerText(t('duels.status.finished'));
      return;
    }

    const target = duel.status === -1 ? duel.startTime : duel.finishTime;
    if (!target) return;

    const render = () => {
      const prefix = duel.status === -1 ? t('duels.startsIn') : t('duels.timeLeft');
      setTimerText(`${prefix}: ${countdown(target)}`);
    };

    render();
    const interval = window.setInterval(render, 1000);
    return () => window.clearInterval(interval);
  }, [duel, t]);

  useEffect(() => {
    setSelectedSampleIndex(0);
    setInput('');
    setOutput('');
    setAnswer('');
    setCheckSamplesResult([]);
    setEditorTab('console');
  }, [activeProblem?.problem?.id]);

  useEffect(() => {
    const sampleTest = activeProblem?.problem?.sampleTests?.[selectedSampleIndex];
    setInput(sampleTest?.input ?? '');
    setAnswer(sampleTest?.output ?? '');
    setOutput('');
  }, [activeProblem?.problem?.id, activeProblem?.problem?.sampleTests, selectedSampleIndex]);

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    unsubscribers.push(
      wsService.on('custom-test-result', (result: any) => {
        const text = `${result.output ?? ''}${result.error ?? ''}`;
        const meta = [
          result.time ? `Time: ${result.time}ms` : null,
          result.memory ? `Memory: ${result.memory}KB` : null,
        ]
          .filter(Boolean)
          .join(' | ');
        setOutput([text.trim(), meta].filter(Boolean).join('\n'));
        setIsRunning(false);
      }),
    );

    unsubscribers.push(
      wsService.on('check-sample-tests-result', (result: any) => {
        setCheckSamplesResult(result ?? []);
        setIsCheckingSamples(false);
        setEditorTab('samples');
      }),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const attemptsParams = useMemo<AttemptsListParams | null>(() => {
    if (!activeProblem?.problem?.id || !currentUser?.username || !duel) return null;
    const base = {
      username: currentUser.username,
      page: attemptsPageParams.page,
      pageSize: attemptsPageParams.pageSize,
      ordering: '-id',
    };
    if (showDuelAttempts) {
      return {
        ...base,
        duelId: duel.id,
        duelProblem: activeProblem.symbol,
      };
    }
    return {
      ...base,
      problemId: activeProblem.problem.id,
    };
  }, [
    activeProblem?.problem?.id,
    activeProblem?.symbol,
    attemptsPageParams.page,
    attemptsPageParams.pageSize,
    currentUser?.username,
    duel,
    showDuelAttempts,
  ]);

  const {
    data: attemptsPage,
    mutate: mutateAttempts,
    isLoading: isAttemptsLoading,
  } = useSWR(
    attemptsParams ? ['duel-workspace-attempts', attemptsParams] : null,
    () => problemsQueries.problemsRepository.listAttempts(attemptsParams!),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const { selectedLang, setSelectedLang, selectedLanguage } = useProblemLanguage({
    availableLanguages: activeProblem?.problem?.availableLanguages,
    defaultLang: activeProblem?.problem?.availableLanguages?.[0]?.lang,
  });

  const storageKey =
    duel?.id && activeProblem?.problem?.id
      ? `duel-${duel.id}-problem-${activeProblem.problem.id}-code`
      : null;

  const { initialCode, editorKey, codeRef, hasCode, persistCode } = usePersistedCode({
    storageKey,
    template: selectedLanguage?.codeTemplate || '',
  });

  const updateSearch = (values: {
    view?: WorkspaceView;
    tab?: WorkspaceTab;
    symbol?: string | null;
  }) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', values.view ?? view);
    next.set('tab', values.tab ?? activeTab);
    const nextSymbol = values.symbol ?? activeNavigationProblem?.symbol;
    if (nextSymbol) {
      next.set('problem', nextSymbol);
    } else {
      next.delete('problem');
    }
    setSearchParams(next, { replace: true });
  };

  const handleSubmit = async () => {
    if (
      !activeProblem?.problem?.id ||
      !selectedLang ||
      !codeRef.current ||
      !duel ||
      isSubmitting ||
      duel.status === -1
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (duel.canSubmitForDuel) {
        await duelsQueries.duelsRepository.submitToDuel(duel.id, {
          duelProblem: activeProblem.symbol,
          sourceCode: codeRef.current,
          lang: selectedLang,
        });
      } else {
        await problemsQueries.problemsRepository.submitSolution(activeProblem.problem.id, {
          sourceCode: codeRef.current,
          lang: selectedLang,
        });
      }

      toast.success(t('problems.detail.submitSuccess'));
      updateSearch({ view: 'problems', tab: 'attempts' });
      await Promise.all([mutateAttempts(), mutateDuel()]);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        error?.message ??
        t('duels.error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    if (
      !activeProblem?.problem?.id ||
      !selectedLang ||
      !codeRef.current ||
      isRunning ||
      duel?.status === -1
    ) {
      return;
    }

    setIsRunning(true);
    setOutput('');
    try {
      const response = await problemsQueries.problemsRepository.runCustomTest({
        sourceCode: codeRef.current,
        lang: selectedLang,
        inputData: input,
      });

      if (response?.id) {
        wsService.send('custom-test-add', response.id);
        window.setTimeout(() => setIsRunning(false), 8000);
      } else {
        setIsRunning(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        error?.message ??
        t('duels.error');
      toast.error(message);
      setIsRunning(false);
    }
  };

  const handleCheckSamples = async () => {
    if (
      !activeProblem?.problem?.id ||
      !selectedLang ||
      !codeRef.current ||
      isCheckingSamples ||
      duel?.status === -1
    ) {
      return;
    }

    setIsCheckingSamples(true);
    setCheckSamplesResult([]);
    try {
      const response = await problemsQueries.problemsRepository.checkSampleTests(
        activeProblem.problem.id,
        {
          sourceCode: codeRef.current,
          lang: selectedLang,
        },
      );

      if (response?.id) {
        wsService.send('check-sample-tests-add', response.id);
        window.setTimeout(() => setIsCheckingSamples(false), 15000);
      } else {
        setIsCheckingSamples(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        error?.message ??
        t('duels.error');
      toast.error(message);
      setIsCheckingSamples(false);
    }
  };

  useEffect(() => {
    actionStatesRef.current = {
      currentUser,
      hasCode,
      isRunning,
      isSubmitting,
      isCheckingSamples,
      canUseCheckSamples,
      isWorkspaceLocked,
    };
  }, [
    canUseCheckSamples,
    currentUser,
    hasCode,
    isCheckingSamples,
    isRunning,
    isSubmitting,
    isWorkspaceLocked,
  ]);

  useEffect(() => {
    actionHandlersRef.current = {
      onRun: handleRun,
      onSubmit: handleSubmit,
      onCheckSamples: handleCheckSamples,
    };
  }, [handleCheckSamples, handleRun, handleSubmit]);

  useEffect(() => {
    const handleHotkeys = (event: KeyboardEvent) => {
      const state = actionStatesRef.current;
      const handlers = actionHandlersRef.current;

      if (
        event.ctrlKey &&
        event.key === "'" &&
        state.currentUser &&
        state.hasCode &&
        !state.isRunning &&
        !state.isWorkspaceLocked
      ) {
        event.preventDefault();
        handlers.onRun();
      }

      if (
        event.ctrlKey &&
        event.key === ',' &&
        state.currentUser &&
        state.hasCode &&
        state.canUseCheckSamples &&
        !state.isCheckingSamples &&
        !state.isWorkspaceLocked
      ) {
        event.preventDefault();
        handlers.onCheckSamples();
      }

      if (
        event.ctrlKey &&
        event.altKey &&
        (event.key === 'Enter' || event.key === 'NumpadEnter') &&
        state.currentUser &&
        state.hasCode &&
        !state.isSubmitting &&
        !state.isWorkspaceLocked
      ) {
        event.preventDefault();
        handlers.onSubmit();
      }
    };

    window.addEventListener('keydown', handleHotkeys);
    return () => window.removeEventListener('keydown', handleHotkeys);
  }, []);

  if (isLoading && !duel) {
    return (
      <Box
        sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!duel) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{t('duels.error')}</Typography>
      </Box>
    );
  }

  const workspaceAttemptLink = activeNavigationProblem?.symbol
    ? `${getResourceById(resources.Duel, duel.id)}?view=problems&problem=${activeNavigationProblem.symbol}&tab=attempts`
    : getResourceById(resources.Duel, duel.id);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 1000,
        bgcolor: 'background.elevation1',
      }}
    >
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

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'rgba(255,255,255,0.18)' }}
            />

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ minWidth: 0 }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {duel.playerFirst.ratingTitle ? (
                    <ContestsRatingChip title={duel.playerFirst.ratingTitle} imgSize={20} />
                  ) : null}
                  <Typography variant="subtitle2" fontWeight={800} noWrap>
                    {getPlayerDisplayName(duel.playerFirst)}
                  </Typography>
                  {duel.playerFirst.isBot ? (
                    <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                  ) : null}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  vs
                </Typography>

                {duel.playerSecond ? (
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    {duel.playerSecond.ratingTitle ? (
                      <ContestsRatingChip title={duel.playerSecond.ratingTitle} imgSize={20} />
                    ) : null}
                    <Typography variant="subtitle2" fontWeight={800} noWrap>
                      {getPlayerDisplayName(duel.playerSecond)}
                    </Typography>
                    {duel.playerSecond.isBot ? (
                      <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                    ) : null}
                  </Stack>
                ) : null}
              </Stack>

              {duel.duelType?.title ? (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={duel.duelType.title}
                />
              ) : null}
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title={t('contests.problem.prev')}>
                <span style={{ display: 'inline-flex' }}>
                  <Button
                    onClick={() => prevProblem && updateSearch({ symbol: prevProblem.symbol })}
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
                    onClick={() => nextProblem && updateSearch({ symbol: nextProblem.symbol })}
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
                onClick={handleRun}
                disabled={!currentUser || isRunning || !hasCode || isWorkspaceLocked}
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
                onClick={handleSubmit}
                disabled={!currentUser || isSubmitting || !hasCode || isWorkspaceLocked}
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

      <Card
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          position: 'relative',
        }}
      >
        {isLoading || isValidating ? (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        ) : null}

        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={50} minSize={35}>
            {view === 'standings' ? (
              <Card
                background={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 3 }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.5}>
                      <Typography variant="h5" fontWeight={700}>
                        {t('duels.standings')}
                      </Typography>
                      <Typography color="text.secondary">{t('duels.standingsSubtitle')}</Typography>
                    </Stack>

                    {standingsRows.map((row) => (
                      <Card
                        key={row.key}
                        variant="outlined"
                        sx={(theme) => ({
                          borderColor:
                            row.total === maxScore
                              ? alpha(theme.palette[row.accent].main, 0.45)
                              : alpha(
                                  theme.palette.divider,
                                  theme.palette.mode === 'dark' ? 0.75 : 1,
                                ),
                          backgroundColor:
                            row.total === maxScore
                              ? alpha(
                                  theme.palette[row.accent].main,
                                  theme.palette.mode === 'dark' ? 0.14 : 0.06,
                                )
                              : 'transparent',
                        })}
                      >
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1.25}
                              alignItems="center"
                              flexWrap="wrap"
                              useFlexGap
                            >
                              <Typography fontWeight={800}>#{row.rank}</Typography>
                              <Typography variant="subtitle1" fontWeight={700}>
                                {getPlayerDisplayName(row.player)}
                              </Typography>
                              {row.player.isBot ? (
                                <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                              ) : null}
                              <Typography variant="body2" color="text.secondary">
                                {row.player.ratingTitle || '--'}
                              </Typography>
                              <Chip
                                label={`${row.total} pts`}
                                color={row.accent}
                                variant="outlined"
                                size="small"
                              />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>

                <DuelResultsFooter
                  duel={duel}
                  problems={navigationProblems}
                  activeSymbol={activeNavigationProblem?.symbol}
                  view={view}
                  onChangeView={(nextView) => updateSearch({ view: nextView })}
                  onSelectProblem={(symbol) => updateSearch({ symbol, view: 'problems' })}
                />
              </Card>
            ) : activeProblem?.problem ? (
              <Card
                background={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 0 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, value) => updateSearch({ tab: value })}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ px: 2, pt: 1 }}
                  >
                    <Tab
                      sx={{ fontWeight: 600 }}
                      value="description"
                      label={t('contests.problem.description')}
                      icon={
                        <IconifyIcon icon="mdi:book-open-page-variant" width={18} height={18} />
                      }
                      iconPosition="start"
                    />
                    <Tab
                      sx={{ fontWeight: 600 }}
                      value="attempts"
                      label={t('duels.myAttempts')}
                      icon={<IconifyIcon icon="mdi:history" width={18} height={18} />}
                      iconPosition="start"
                    />
                  </Tabs>
                  <Divider />

                  <Box sx={{ p: 3 }}>
                    {activeTab === 'description' ? (
                      <Stack spacing={2}>
                        <Stack spacing={1}>
                          <Typography variant="h5" fontWeight={700}>
                            {activeProblem.symbol}. {activeProblem.problem.title}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip label={`${activeProblem.ball ?? 0} pts`} size="small" />
                            <Chip
                              label={`${selectedLanguage?.timeLimit ?? activeProblem.problem.timeLimit ?? 0} ms`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`${selectedLanguage?.memoryLimit ?? activeProblem.problem.memoryLimit ?? 0} MB`}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>

                        <ProblemBody problem={activeProblem.problem} />
                      </Stack>
                    ) : currentUser ? (
                      <ProblemsAttemptsTable
                        attempts={attemptsPage?.data ?? []}
                        total={attemptsPage?.total ?? 0}
                        paginationModel={attemptsPagination}
                        onPaginationChange={onAttemptsPaginationChange}
                        isLoading={isAttemptsLoading}
                        onRerun={() => mutateAttempts()}
                        showProblemColumn={false}
                        getProblemLink={() => workspaceAttemptLink}
                      />
                    ) : (
                      <Typography color="text.secondary">{t('duels.signInForAttempts')}</Typography>
                    )}
                  </Box>
                </CardContent>

                <DuelResultsFooter
                  duel={duel}
                  problems={navigationProblems}
                  activeSymbol={activeNavigationProblem?.symbol}
                  view={view}
                  onChangeView={(nextView) => updateSearch({ view: nextView })}
                  onSelectProblem={(symbol) => updateSearch({ symbol, view: 'problems' })}
                />
              </Card>
            ) : navigationProblems.length && duel.status !== -1 && (isLoading || isValidating) ? (
              <ProblemDescriptionSkeleton />
            ) : (
              <Card
                background={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Stack spacing={1.5} alignItems="center" maxWidth={420}>
                    <IconifyIcon icon="mdi:shield-lock-outline" width={36} height={36} />
                    <Typography variant="h6" fontWeight={700}>
                      {activeNavigationProblem
                        ? `${activeNavigationProblem.symbol} | ${activeNavigationProblem.ball ?? 0} pts`
                        : t('duels.problems')}
                    </Typography>
                    <Typography color="text.secondary">
                      {duel.status === -1
                        ? t('duels.workspaceLockedDescription', {
                            startTime: formatDate(duel.startTime),
                          })
                        : t('duels.noProblems')}
                    </Typography>
                  </Stack>
                </CardContent>

                <DuelResultsFooter
                  duel={duel}
                  problems={navigationProblems}
                  activeSymbol={activeNavigationProblem?.symbol}
                  view={view}
                  onChangeView={(nextView) => updateSearch({ view: nextView })}
                  onSelectProblem={(symbol) => updateSearch({ symbol, view: 'problems' })}
                />
              </Card>
            )}
          </Panel>

          <PanelHandle />

          <Panel defaultSize={50} minSize={35}>
            {activeProblem?.problem ? (
              <ProblemEditorPanel
                problem={activeProblem.problem}
                initialCode={initialCode}
                editorKey={editorKey}
                onCodeChange={persistCode}
                selectedLang={selectedLang}
                onLangChange={setSelectedLang}
                sampleTests={activeProblem.problem.sampleTests ?? []}
                selectedSampleIndex={selectedSampleIndex}
                onSampleChange={setSelectedSampleIndex}
                input={input}
                onInputChange={setInput}
                output={output}
                answer={answer}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onCheckSamples={handleCheckSamples}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                isCheckingSamples={isCheckingSamples}
                checkSamplesResult={checkSamplesResult}
                editorTab={editorTab}
                onEditorTabChange={setEditorTab}
                canUseCheckSamples={false}
                editorTheme={editorTheme}
              />
            ) : navigationProblems.length && duel.status !== -1 && (isLoading || isValidating) ? (
              <ProblemEditorSkeleton />
            ) : (
              <Card
                background={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <Stack spacing={1.5} alignItems="center" maxWidth={360}>
                  <IconifyIcon icon="mdi:code-tags" width={40} height={40} />
                  <Typography variant="h6" fontWeight={700}>
                    {activeNavigationProblem?.symbol
                      ? `${activeNavigationProblem.symbol} editor`
                      : t('duels.problems')}
                  </Typography>
                  <Typography color="text.secondary">
                    {duel.status === -1 ? t('duels.editorUnlockedOnStart') : t('duels.noProblems')}
                  </Typography>
                </Stack>
              </Card>
            )}
          </Panel>
        </PanelGroup>
      </Card>
    </Box>
  );
};

export default DuelDetailPage;
