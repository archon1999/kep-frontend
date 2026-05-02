import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Card, CardContent, Chip, Divider, LinearProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GridPaginationModel } from '@mui/x-data-grid';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import useSWR from 'swr';
import { duelsQueries } from 'modules/duels/application/queries.ts';
import {
  Duel,
  DuelDetailPageNavigationProblem,
  DuelDetailPageStandingRow,
  DuelDetailPageWorkspaceTab,
  DuelDetailPageWorkspaceView,
  DuelProblem,
  getDuelDetailPagePlayerRows,
} from 'modules/duels/domain/index.ts';
import { problemsQueries } from 'modules/problems/application/queries.ts';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import { ProblemBody } from 'modules/problems/ui/shared/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam, stringParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import DuelResultsFooter from './components/DuelResultsFooter.tsx';

export type DuelDetailPageWorkspaceProps = {
  duel: Duel;
  isLoading: boolean;
  isValidating: boolean;
  view: DuelDetailPageWorkspaceView;
  activeTab: DuelDetailPageWorkspaceTab;
  navigationProblems: DuelDetailPageNavigationProblem[];
  activeNavigationProblem: DuelDetailPageNavigationProblem | null;
  activeProblem: DuelProblem | null;
  standingsRows: DuelDetailPageStandingRow[];
  maxScore: number;
  isAuthenticated: boolean;
  attempts: any[];
  attemptsTotal: number;
  attemptsPagination: GridPaginationModel;
  onAttemptsPaginationChange: (model: GridPaginationModel) => void;
  isAttemptsLoading: boolean;
  workspaceAttemptLink: string;
  onRefreshAttempts: () => void;
  onChangeView: (view: DuelDetailPageWorkspaceView) => void;
  onChangeTab: (tab: DuelDetailPageWorkspaceTab) => void;
  onSelectProblem: (symbol: string) => void;
  initialCode: string;
  editorKey: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  selectedLanguage?: {
    timeLimit?: number;
    memoryLimit?: number;
  } | null;
  selectedSampleIndex: number;
  onSampleChange: (value: number) => void;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  answer: string;
  onRun: () => void;
  onSubmit: () => void;
  onCheckSamples: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isCheckingSamples: boolean;
  checkSamplesResult: Array<{
    verdict?: VerdictKey;
    verdictTitle?: string;
    input?: string;
    output?: string;
    answer?: string;
  }>;
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  editorTheme: 'vs' | 'vs-dark';
};

type DuelDetailQueryState = {
  view: DuelDetailPageWorkspaceView;
  activeTab: DuelDetailPageWorkspaceTab;
  problem: string;
};

type CheckSamplesResult = Array<{
  verdict?: VerdictKey;
  verdictTitle?: string;
  input?: string;
  output?: string;
  answer?: string;
}>;

type DuelDetailPageWorkspaceCurrentUser =
  | {
      username?: string;
      permissions?: unknown;
      isSuperuser?: boolean;
    }
  | null
  | undefined;

type UseDuelDetailPageWorkspaceStateParams = {
  duel?: Duel | null;
  isLoading: boolean;
  isValidating: boolean;
  currentUser?: DuelDetailPageWorkspaceCurrentUser;
  mutateDuel: () => Promise<unknown>;
};

export type DuelDetailPageWorkspaceState = {
  workspaceProps: DuelDetailPageWorkspaceProps | null;
  navigationProblems: DuelDetailPageNavigationProblem[];
  hasCode: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  isWorkspaceLocked: boolean;
  onRun: () => void;
  onSubmit: () => void;
};

const formatDuelDetailPageDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const useProblemPermissions = (permissionsRaw: unknown) =>
  useMemo(() => {
    if (!permissionsRaw) return { canUseCheckSamples: false };
    if (typeof permissionsRaw === 'string') {
      try {
        permissionsRaw = JSON.parse(permissionsRaw);
      } catch {
        return { canUseCheckSamples: false };
      }
    }

    const value = permissionsRaw as Record<string, unknown>;

    return {
      canUseCheckSamples: Boolean(
        value.canUseCheckSamples ?? value.can_use_check_samples,
      ),
    };
  }, [permissionsRaw]);

export const useDuelDetailPageWorkspaceState = ({
  duel,
  isLoading,
  isValidating,
  currentUser,
  mutateDuel,
}: UseDuelDetailPageWorkspaceStateParams): DuelDetailPageWorkspaceState => {
  const { t } = useTranslation();
  const themeMode = useThemeMode();
  const redirectToLogin = useLoginRedirect();
  const permissions = useProblemPermissions(currentUser?.permissions);
  const { state: routeState, patchState, setField } = useRouteQueryState<DuelDetailQueryState>({
    defaults: {
      view: 'problems',
      activeTab: 'description',
      problem: '',
    },
    schema: {
      view: {
        ...enumParam(['problems', 'standings'] as const),
        param: 'view',
      },
      activeTab: {
        ...enumParam(['description', 'attempts'] as const),
        param: 'tab',
      },
      problem: {
        ...stringParam(),
        param: 'problem',
      },
    },
    historyByKey: {
      view: 'push',
      activeTab: 'push',
      problem: 'push',
    },
  });
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSamples, setIsCheckingSamples] = useState(false);
  const [checkSamplesResult, setCheckSamplesResult] = useState<CheckSamplesResult>([]);
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
  } = useGridPagination({
    initialPageSize: 10,
    querySync: {
      pageKey: 'attemptsPage',
      pageSizeKey: 'attemptsPageSize',
    },
  });

  const problems = duel?.problems ?? [];
  const view = routeState.view;
  const activeTab = routeState.activeTab;
  const navigationProblems = useMemo<DuelDetailPageNavigationProblem[]>(() => {
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
  const currentSymbol = routeState.problem || null;
  const activeNavigationProblem =
    navigationProblems.find((problem) => problem.symbol === currentSymbol) ??
    navigationProblems[0] ??
    null;
  const activeProblem =
    problems.find((problem) => problem.symbol === activeNavigationProblem?.symbol) ?? null;
  const standingsRows = useMemo<DuelDetailPageStandingRow[]>(() => {
    if (!duel) return [];

    return getDuelDetailPagePlayerRows(duel)
      .map((row) => ({ ...row, total: row.player.balls ?? 0 }))
      .sort((left, right) => right.total - left.total || left.order - right.order)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [duel]);
  const maxScore = standingsRows.reduce((best, row) => Math.max(best, row.total), 0);
  const isWorkspaceLocked = duel?.status === -1 || !activeProblem?.problem;
  const showDuelAttempts = Boolean(duel?.viewerRole && duel.viewerRole !== 'spectator');
  const canUseCheckSamples = Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser);

  useEffect(() => {
    setEditorTheme(themeMode.mode === 'dark' ? 'vs-dark' : 'vs');
  }, [themeMode.mode]);

  useEffect(() => {
    if (!navigationProblems.length) return;
    if (currentSymbol && navigationProblems.some((problem) => problem.symbol === currentSymbol)) {
      return;
    }
    setField('problem', navigationProblems[0].symbol, { history: 'replace' });
  }, [currentSymbol, navigationProblems, setField]);

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
    view?: DuelDetailPageWorkspaceView;
    tab?: DuelDetailPageWorkspaceTab;
    symbol?: string | null;
  }) => {
    patchState((prev) => ({
      view: values.view ?? prev.view,
      activeTab: values.tab ?? prev.activeTab,
      problem: values.symbol ?? activeNavigationProblem?.symbol ?? prev.problem,
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

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
    if (!currentUser) {
      redirectToLogin();
      return;
    }

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
    if (!currentUser) {
      redirectToLogin();
      return;
    }

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

  if (!duel) {
    return {
      workspaceProps: null,
      navigationProblems,
      hasCode,
      isRunning,
      isSubmitting,
      isWorkspaceLocked,
      onRun: handleRun,
      onSubmit: handleSubmit,
    };
  }

  const workspaceAttemptLink = activeNavigationProblem?.symbol
    ? `/duels/${duel.id}?view=problems&problem=${activeNavigationProblem.symbol}&tab=attempts`
    : `/duels/${duel.id}`;

  return {
    workspaceProps: {
      duel,
      isLoading,
      isValidating,
      view,
      activeTab,
      navigationProblems,
      activeNavigationProblem,
      activeProblem,
      standingsRows,
      maxScore,
      isAuthenticated: Boolean(currentUser),
      attempts: attemptsPage?.data ?? [],
      attemptsTotal: attemptsPage?.total ?? 0,
      attemptsPagination,
      onAttemptsPaginationChange,
      isAttemptsLoading,
      workspaceAttemptLink,
      onRefreshAttempts: () => {
        void mutateAttempts();
      },
      onChangeView: (nextView) => updateSearch({ view: nextView }),
      onChangeTab: (tab) => updateSearch({ tab }),
      onSelectProblem: (symbol) => updateSearch({ symbol, view: 'problems' }),
      initialCode,
      editorKey,
      onCodeChange: persistCode,
      selectedLang,
      onLangChange: setSelectedLang,
      selectedLanguage,
      selectedSampleIndex,
      onSampleChange: setSelectedSampleIndex,
      input,
      onInputChange: setInput,
      output,
      answer,
      onRun: handleRun,
      onSubmit: handleSubmit,
      onCheckSamples: handleCheckSamples,
      isRunning,
      isSubmitting,
      isCheckingSamples,
      checkSamplesResult,
      editorTab,
      onEditorTabChange: setEditorTab,
      editorTheme,
    },
    navigationProblems,
    hasCode,
    isRunning,
    isSubmitting,
    isWorkspaceLocked,
    onRun: handleRun,
    onSubmit: handleSubmit,
  };
};

const DuelDetailPageWorkspace = ({
  duel,
  isLoading,
  isValidating,
  view,
  activeTab,
  navigationProblems,
  activeNavigationProblem,
  activeProblem,
  standingsRows,
  maxScore,
  isAuthenticated,
  attempts,
  attemptsTotal,
  attemptsPagination,
  onAttemptsPaginationChange,
  isAttemptsLoading,
  workspaceAttemptLink,
  onRefreshAttempts,
  onChangeView,
  onChangeTab,
  onSelectProblem,
  initialCode,
  editorKey,
  onCodeChange,
  selectedLang,
  onLangChange,
  selectedLanguage,
  selectedSampleIndex,
  onSampleChange,
  input,
  onInputChange,
  output,
  answer,
  onRun,
  onSubmit,
  onCheckSamples,
  isRunning,
  isSubmitting,
  isCheckingSamples,
  checkSamplesResult,
  editorTab,
  onEditorTabChange,
  editorTheme,
}: DuelDetailPageWorkspaceProps) => {
  const { t } = useTranslation();

  return (
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
                              {row.player.username}
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
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
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
                  onChange={(_, value) => onChangeTab(value)}
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
                    icon={<IconifyIcon icon="mdi:book-open-page-variant" width={18} height={18} />}
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
                  ) : isAuthenticated ? (
                    <ProblemsAttemptsTable
                      attempts={attempts}
                      total={attemptsTotal}
                      paginationModel={attemptsPagination}
                      onPaginationChange={onAttemptsPaginationChange}
                      isLoading={isAttemptsLoading}
                      onRerun={onRefreshAttempts}
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
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
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
                          startTime: formatDuelDetailPageDate(duel.startTime),
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
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
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
              onCodeChange={onCodeChange}
              selectedLang={selectedLang}
              onLangChange={onLangChange}
              sampleTests={activeProblem.problem.sampleTests ?? []}
              selectedSampleIndex={selectedSampleIndex}
              onSampleChange={onSampleChange}
              input={input}
              onInputChange={onInputChange}
              output={output}
              answer={answer}
              onRun={onRun}
              onSubmit={onSubmit}
              onCheckSamples={onCheckSamples}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              isCheckingSamples={isCheckingSamples}
              checkSamplesResult={checkSamplesResult}
              editorTab={editorTab}
              onEditorTabChange={onEditorTabChange}
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
  );
};

export default DuelDetailPageWorkspace;
