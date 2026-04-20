import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { duelsQueries, useDuelDetail } from 'modules/duels/application/queries.ts';
import { problemsQueries } from 'modules/problems/application/queries.ts';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { enumParam, stringParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import useSWR from 'swr';
import DuelDetailPageHeader from './DuelDetailPageHeader.tsx';
import DuelDetailPageWorkspace from './DuelDetailPageWorkspace.tsx';
import {
  DuelDetailPageNavigationProblem,
  DuelDetailPageWorkspaceView,
  getDuelDetailPagePlayerRows,
} from './components/DuelDetailPageResultsFooter.tsx';

type WorkspaceView = DuelDetailPageWorkspaceView;
type WorkspaceTab = 'description' | 'attempts';
type DuelDetailQueryState = {
  view: WorkspaceView;
  activeTab: WorkspaceTab;
  problem: string;
};

type CheckSamplesResult = Array<{
  verdict?: VerdictKey;
  verdictTitle?: string;
  input?: string;
  output?: string;
  answer?: string;
}>;

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

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const themeMode = useThemeMode();
  const permissions = useProblemPermissions(currentUser?.permissions);
  const { id } = useParams<{ id: string }>();
  const duelId = Number(id);
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
  const [timerText, setTimerText] = useState('');
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

    return getDuelDetailPagePlayerRows(duel)
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
    setField('problem', navigationProblems[0].symbol, { history: 'replace' });
  }, [currentSymbol, navigationProblems, setField]);

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
    patchState((prev) => ({
      view: values.view ?? prev.view,
      activeTab: values.tab ?? prev.activeTab,
      problem: values.symbol ?? activeNavigationProblem?.symbol ?? prev.problem,
    }));
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
      <DuelDetailPageHeader
        duel={duel}
        timerText={timerText}
        prevProblem={prevProblem}
        nextProblem={nextProblem}
        hasCurrentUser={Boolean(currentUser)}
        hasCode={hasCode}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        isWorkspaceLocked={isWorkspaceLocked}
        onRun={handleRun}
        onSubmit={handleSubmit}
        onSelectProblem={(symbol) => updateSearch({ symbol })}
      />

      <DuelDetailPageWorkspace
        duel={duel}
        isLoading={isLoading}
        isValidating={isValidating}
        view={view}
        activeTab={activeTab}
        navigationProblems={navigationProblems}
        activeNavigationProblem={activeNavigationProblem}
        activeProblem={activeProblem}
        standingsRows={standingsRows}
        maxScore={maxScore}
        isAuthenticated={Boolean(currentUser)}
        attempts={attemptsPage?.data ?? []}
        attemptsTotal={attemptsPage?.total ?? 0}
        attemptsPagination={attemptsPagination}
        onAttemptsPaginationChange={onAttemptsPaginationChange}
        isAttemptsLoading={isAttemptsLoading}
        workspaceAttemptLink={workspaceAttemptLink}
        onRefreshAttempts={() => mutateAttempts()}
        onChangeView={(nextView) => updateSearch({ view: nextView })}
        onChangeTab={(tab) => updateSearch({ tab })}
        onSelectProblem={(symbol) => updateSearch({ symbol, view: 'problems' })}
        initialCode={initialCode}
        editorKey={editorKey}
        onCodeChange={persistCode}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
        selectedLanguage={selectedLanguage}
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
        editorTheme={editorTheme}
      />
    </Box>
  );
};

export default DuelDetailPage;
