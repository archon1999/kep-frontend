import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { submitDuelSolution } from 'modules/duels/application/mutations';
import {
  Duel,
  DuelDetailPageNavigationProblem,
  DuelDetailPageWorkspaceTab,
  DuelProblem,
} from 'modules/duels/domain/index.ts';
import { usePersistedCode } from 'modules/problems/application/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/application/hooks/useProblemLanguage';
import {
  checkProblemSampleTests,
  runProblemCustomTest,
} from 'modules/problems/application/mutations';
import { useDuelWorkspaceAttempts } from 'modules/problems/application/queries.ts';
import { AttemptsListParams } from 'modules/problems/domain/contracts/problems.repository';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import { ProblemBody } from 'modules/problems/ui/shared/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import ProblemIntro from 'modules/problems/ui/shared/components/problem-detail/ProblemIntro';
import { ProblemWorkspaceLayout } from 'modules/problems/ui/shared/components/problem-detail/ProblemWorkspaceLayout';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { formatCalendarDateTime } from 'shared/lib/dateTime';
import { enumParam, stringParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import DuelResultsFooter from './components/DuelResultsFooter.tsx';
import { playDuelTickSound } from './duelTickSound.ts';

export type DuelDetailPageWorkspaceProps = {
  duel: Duel;
  hasCode: boolean;
  isLoading: boolean;
  isValidating: boolean;
  activeTab: DuelDetailPageWorkspaceTab;
  navigationProblems: DuelDetailPageNavigationProblem[];
  activeNavigationProblem: DuelDetailPageNavigationProblem | null;
  activeProblem: DuelProblem | null;
  isAuthenticated: boolean;
  attempts: any[];
  attemptsTotal: number;
  attemptsPagination: GridPaginationModel;
  onAttemptsPaginationChange: (model: GridPaginationModel) => void;
  isAttemptsLoading: boolean;
  workspaceAttemptLink: string;
  onRefreshAttempts: () => void;
  onChangeTab: (tab: DuelDetailPageWorkspaceTab) => void;
  onSelectProblem: (symbol: string) => void;
  initialCode: string;
  editorKey: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  selectedLanguage?: {
    timeLimit?: number | null;
    memoryLimit?: number | null;
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
      id?: number | string;
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
  isSubmitLocked: boolean;
  onRun: () => void;
  onSubmit: () => void;
};

const formatDuelDetailPageDate = (value?: string | null) => {
  if (!value) return '--';
  return formatCalendarDateTime(value, value);
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
      canUseCheckSamples: Boolean(value.canUseCheckSamples ?? value.can_use_check_samples),
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
  const {
    state: routeState,
    patchState,
    setField,
  } = useRouteQueryState<DuelDetailQueryState>({
    defaults: {
      activeTab: 'description',
      problem: '',
    },
    schema: {
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
  const handledFirstAcAttemptsRef = useRef(new Set<number>());
  const hasInitializedFirstAcClaimsRef = useRef(false);
  const actionStatesRef = useRef({
    currentUser,
    hasCode: false,
    isRunning,
    isSubmitting,
    isCheckingSamples,
    canUseCheckSamples: false,
    isWorkspaceLocked: true,
    isSubmitLocked: true,
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
  const activeTab = routeState.activeTab;
  const navigationProblems = useMemo<DuelDetailPageNavigationProblem[]>(() => {
    if (problems.length) {
      return problems.map((problem) => ({
        symbol: problem.symbol,
        problemId: problem.problem?.id,
        ball: problem.ball,
        playerFirstBall: problem.playerFirstBall,
        playerSecondBall: problem.playerSecondBall,
        isLocked: problem.isLocked,
        isClaimed: problem.isClaimed,
        firstAcceptedAttemptId: problem.firstAcceptedAttemptId,
        unlockAt: problem.unlockAt,
        firstAcceptedByUserId: problem.firstAcceptedByUserId,
        firstAcceptedByUsername: problem.firstAcceptedByUsername,
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
  const isWorkspaceLocked = duel?.status === -1 || !activeProblem?.problem;
  const isSubmitLocked = isWorkspaceLocked || !activeProblem?.canSubmit;
  const showDuelAttempts = Boolean(
    currentUser && duel && (duel.viewerRole !== 'spectator' || duel.duelType?.code === 'BallF'),
  );
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
    handledFirstAcAttemptsRef.current.clear();
    hasInitializedFirstAcClaimsRef.current = false;
  }, [duel?.id]);

  useEffect(() => {
    const claimedProblems = navigationProblems.filter((problem) => problem.firstAcceptedAttemptId);
    if (!hasInitializedFirstAcClaimsRef.current) {
      claimedProblems.forEach((problem) => {
        handledFirstAcAttemptsRef.current.add(problem.firstAcceptedAttemptId!);
      });
      hasInitializedFirstAcClaimsRef.current = true;
      return;
    }

    claimedProblems.forEach((problem) => {
      const attemptId = problem.firstAcceptedAttemptId!;
      if (handledFirstAcAttemptsRef.current.has(attemptId)) return;
      handledFirstAcAttemptsRef.current.add(attemptId);

      if (problem.firstAcceptedByUserId !== currentUser?.id) {
        playDuelTickSound();
      }
      const index = navigationProblems.findIndex((item) => item.symbol === problem.symbol);
      const nextProblem = navigationProblems[index + 1];
      if (nextProblem?.unlockAt) setField('problem', nextProblem.symbol);
    });
  }, [currentUser?.id, navigationProblems, setField]);

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
    if (!currentUser?.username) return undefined;

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
  }, [currentUser?.username]);

  useEffect(() => {
    if (!currentUser?.id || !duel?.id) return;

    wsService.send('duel-add', duel.id);
    const unsubscribe = wsService.on<{
      event?: string;
      duelId?: number;
      duel_id?: number;
      attemptId?: number;
      attempt_id?: number;
      winnerUserId?: number;
      winner_user_id?: number;
      nextSymbol?: string | null;
      next_symbol?: string | null;
    }>('duel-update', (event) => {
      const eventDuelId = event.duelId ?? event.duel_id;
      if (eventDuelId !== duel.id || event.event !== 'first_ac') return;

      const attemptId = event.attemptId ?? event.attempt_id;
      if (attemptId && handledFirstAcAttemptsRef.current.has(attemptId)) return;
      if (attemptId) handledFirstAcAttemptsRef.current.add(attemptId);

      const winnerUserId = event.winnerUserId ?? event.winner_user_id;
      if (winnerUserId !== currentUser?.id) {
        playDuelTickSound();
      }

      const nextSymbol = event.nextSymbol ?? event.next_symbol;
      if (nextSymbol) setField('problem', nextSymbol);
      void mutateDuel();
    });

    return () => {
      unsubscribe();
      wsService.send('duel-delete', duel.id);
    };
  }, [currentUser?.id, duel?.id, mutateDuel, setField]);

  useEffect(() => {
    if (!activeNavigationProblem?.isLocked || !activeNavigationProblem.unlockAt) return;
    const unlockTime = new Date(activeNavigationProblem.unlockAt).getTime();
    if (Number.isNaN(unlockTime)) return;
    const timeout = window.setTimeout(
      () => void mutateDuel(),
      Math.max(0, unlockTime - Date.now()) + 150,
    );
    return () => window.clearTimeout(timeout);
  }, [activeNavigationProblem?.isLocked, activeNavigationProblem?.unlockAt, mutateDuel]);

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
  } = useDuelWorkspaceAttempts(attemptsParams);

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

  const updateSearch = (values: { tab?: DuelDetailPageWorkspaceTab; symbol?: string | null }) => {
    patchState((prev) => ({
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
      duel.status === -1 ||
      !activeProblem.canSubmit
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDuelSolution(duel.id, {
        duelProblem: activeProblem.symbol,
        sourceCode: codeRef.current,
        lang: selectedLang,
      });

      toast.success(t('problems.detail.submitSuccess'));
      updateSearch({ tab: 'attempts' });
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
      const response = await runProblemCustomTest({
        problemId: activeProblem.problem.id,
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
      const response = await checkProblemSampleTests(activeProblem.problem.id, {
        sourceCode: codeRef.current,
        lang: selectedLang,
      });

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
      isSubmitLocked,
    };
  }, [
    canUseCheckSamples,
    currentUser,
    hasCode,
    isCheckingSamples,
    isRunning,
    isSubmitting,
    isWorkspaceLocked,
    isSubmitLocked,
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
        !state.isSubmitLocked
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
      isSubmitLocked,
      onRun: handleRun,
      onSubmit: handleSubmit,
    };
  }

  const workspaceAttemptLink = activeNavigationProblem?.symbol
    ? `/duels/${duel.id}?problem=${activeNavigationProblem.symbol}&tab=attempts`
    : `/duels/${duel.id}`;

  return {
    workspaceProps: {
      duel,
      hasCode,
      isLoading,
      isValidating,
      activeTab,
      navigationProblems,
      activeNavigationProblem,
      activeProblem,
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
      onChangeTab: (tab) => updateSearch({ tab }),
      onSelectProblem: (symbol) => updateSearch({ symbol }),
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
    isSubmitLocked,
    onRun: handleRun,
    onSubmit: handleSubmit,
  };
};

const DuelDetailPageWorkspace = ({
  duel,
  hasCode,
  isLoading,
  isValidating,
  activeTab,
  navigationProblems,
  activeNavigationProblem,
  activeProblem,
  isAuthenticated,
  attempts,
  attemptsTotal,
  attemptsPagination,
  onAttemptsPaginationChange,
  isAttemptsLoading,
  workspaceAttemptLink,
  onRefreshAttempts,
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
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [mobilePane, setMobilePane] = useState<'description' | 'editor'>('description');
  const [unlockNow, setUnlockNow] = useState(Date.now());
  const attemptsRef = useRef<HTMLElement | null>(null);
  const unlockSeconds = activeNavigationProblem?.unlockAt
    ? Math.max(
        0,
        Math.ceil((new Date(activeNavigationProblem.unlockAt).getTime() - unlockNow) / 1000),
      )
    : 0;
  useEffect(() => {
    if (!activeNavigationProblem?.isLocked || !activeNavigationProblem.unlockAt) return;
    const interval = window.setInterval(() => setUnlockNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [activeNavigationProblem?.isLocked, activeNavigationProblem?.unlockAt]);
  useEffect(() => {
    if (activeTab !== 'attempts' || isSubmitting) return;
    setMobilePane('description');
    attemptsRef.current?.scrollIntoView({ block: 'start' });
  }, [activeTab, isSubmitting, activeProblem?.problem?.id, compact]);
  const lockedMessage =
    duel.status === -1
      ? t('duels.workspaceLockedDescription', {
          startTime: formatDuelDetailPageDate(duel.startTime),
        })
      : activeNavigationProblem?.isLocked
        ? activeNavigationProblem.unlockAt
          ? t('duels.problemUnlocksIn', { seconds: unlockSeconds })
          : t('duels.solvePreviousProblemFirst')
        : t('duels.noProblems');
  const loadingProblem =
    !activeProblem?.problem &&
    navigationProblems.length > 0 &&
    duel.status !== -1 &&
    !activeNavigationProblem?.isLocked &&
    (isLoading || isValidating);
  const description = activeProblem?.problem ? (
    <WorkspacePane component="section" aria-label={t('contests.problem.description')}>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Stack gap={2} sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
          <ProblemIntro
            symbol={activeProblem.symbol}
            title={activeProblem.problem.title}
            timeLimit={selectedLanguage?.timeLimit ?? activeProblem.problem.timeLimit ?? 0}
            memoryLimit={selectedLanguage?.memoryLimit ?? activeProblem.problem.memoryLimit ?? 0}
            metadata={
              <Typography variant="metric" color="primary.main" sx={{ fontSize: 14 }}>
                {activeProblem.ball ?? 0} {t('duels.points')}
              </Typography>
            }
          />
          <ProblemBody problem={activeProblem.problem} />
        </Stack>
        <Box
          component="section"
          ref={attemptsRef}
          aria-labelledby="duel-attempts-heading"
          sx={{ borderTop: '1px solid var(--kep-line)' }}
        >
          <Typography
            component="h2"
            id="duel-attempts-heading"
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              fontFamily: 'var(--kep-display-font)',
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            <MixedText>{t('duels.myAttempts')}</MixedText>
          </Typography>
          {isAuthenticated ? (
            !isAttemptsLoading && !attempts.length ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: { xs: 2, md: 3 }, pb: 3 }}
              >
                {t('common.dataGrid.noRows.problemAttempts')}
              </Typography>
            ) : (
              <ProblemsAttemptsTable
                surface="section"
                paginationStyle="list"
                attempts={attempts}
                total={attemptsTotal}
                paginationModel={attemptsPagination}
                onPaginationChange={onAttemptsPaginationChange}
                isLoading={isAttemptsLoading}
                onRerun={onRefreshAttempts}
                showProblemColumn={false}
                getProblemLink={() => workspaceAttemptLink}
              />
            )
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 3 }}>
              {t('duels.signInForAttempts')}
            </Typography>
          )}
        </Box>
      </Box>
    </WorkspacePane>
  ) : loadingProblem ? (
    <ProblemDescriptionSkeleton />
  ) : (
    <WorkspacePane sx={{ justifyContent: 'center' }}>
      <EmptyState
        compact
        kind="auth"
        title={activeNavigationProblem?.symbol ?? t('duels.problems')}
        description={lockedMessage}
      />
    </WorkspacePane>
  );
  const editor = activeProblem?.problem ? (
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
  ) : loadingProblem ? (
    <ProblemEditorSkeleton />
  ) : (
    <WorkspacePane sx={{ justifyContent: 'center' }}>
      <EmptyState
        compact
        kind="hackathon"
        title={t('duels.editorTitle', { symbol: activeNavigationProblem?.symbol ?? '' })}
        description={duel.status === -1 ? t('duels.editorUnlockedOnStart') : lockedMessage}
      />
    </WorkspacePane>
  );
  return (
    <Box
      className="kep-duel-workspace"
      sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}
    >
      <ProblemWorkspaceLayout
        isMobile={compact}
        showEditor={mobilePane === 'editor'}
        description={description}
        editor={editor}
        loading={isLoading}
        hasLoadError={false}
        onRetry={onRefreshAttempts}
        tabs={
          <WorkspaceToolbar sx={{ px: 0, py: 0 }}>
            <Tabs
              value={mobilePane}
              onChange={(_, value) => setMobilePane(value)}
              variant="fullWidth"
              aria-label={t('duels.problems')}
              sx={{ width: 1, minHeight: 40, '& .MuiTab-root': { minHeight: 40, py: 1 } }}
            >
              <Tab value="description" label={t('contests.problem.description')} />
              <Tab value="editor" label={t('duels.editor')} />
            </Tabs>
          </WorkspaceToolbar>
        }
        footer={
          <Stack direction="row" gap={1} sx={{ p: 1.25, borderTop: '1px solid var(--kep-line)' }}>
            <Button
              variant="outlined"
              fullWidth
              disabled={isRunning || !hasCode || duel.status === -1 || !activeProblem?.problem}
              loading={isRunning}
              onClick={onRun}
              startIcon={<IconifyIcon icon="mdi:play-outline" />}
            >
              {t('problems.detail.run')}
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={isSubmitting || !hasCode || duel.status === -1 || !activeProblem?.canSubmit}
              loading={isSubmitting}
              onClick={onSubmit}
              endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
            >
              {t('problems.detail.submit')}
            </Button>
          </Stack>
        }
      />
      <DuelResultsFooter
        duel={duel}
        problems={navigationProblems}
        activeSymbol={activeNavigationProblem?.symbol}
        onSelectProblem={onSelectProblem}
      />
    </Box>
  );
};
export default DuelDetailPageWorkspace;
