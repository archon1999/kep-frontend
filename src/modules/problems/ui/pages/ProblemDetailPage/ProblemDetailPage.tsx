import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Card, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { Page404 } from 'modules/errors/ui/pages';
import {
  problemsQueries,
  useAttemptsList,
  useProblemDetail,
} from 'modules/problems/application/queries';
import { getDifficultyColor } from 'modules/problems/config/difficulty';
import { ProblemSampleTest } from 'modules/problems/domain/entities/problem.entity';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import { ProblemDescription } from 'modules/problems/ui/shared/components/problem-detail/ProblemDescription';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import { ProblemHeader } from 'modules/problems/ui/shared/components/problem-detail/ProblemHeader';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import { booleanFlagParam, enumParam, stringParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';

const useProblemPermissions = (permissionsRaw: any) => {
  return useMemo(() => {
    if (!permissionsRaw)
      return { canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false };
    if (typeof permissionsRaw === 'string') {
      try {
        permissionsRaw = JSON.parse(permissionsRaw);
      } catch {
        return { canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false };
      }
    }

    return {
      canCreateProblems: Boolean(
        permissionsRaw.canCreateProblems ?? permissionsRaw.can_create_problems,
      ),
      canChangeProblemTags: Boolean(
        permissionsRaw.canChangeProblemTags ?? permissionsRaw.can_change_problem_tags,
      ),
      canUseCheckSamples: Boolean(
        permissionsRaw.canUseCheckSamples ?? permissionsRaw.can_use_check_samples,
      ),
    };
  }, [permissionsRaw]);
};

const ProblemDetailPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const themeMode = useThemeMode();
  const theme = useTheme();
  const isNarrowLayout = useMediaQuery(theme.breakpoints.down('md'));
  const permissions = useProblemPermissions(currentUser?.permissions);
  const [editorTheme, setEditorTheme] = useState<'vs' | 'vs-dark'>(
    themeMode.mode === 'dark' ? 'vs-dark' : 'vs',
  );
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    setEditorTheme(themeMode.mode === 'dark' ? 'vs-dark' : 'vs');
  }, [themeMode.mode]);

  const params = useParams<{ id: string }>();
  const problemId = Number(params.id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studyPlanIdParam = Number(searchParams.get('study-plan'));
  const studyPlanId = Number.isNaN(studyPlanIdParam) ? null : studyPlanIdParam;
  const { state: routeState, setField: setRouteField } = useRouteQueryState({
    defaults: {
      activeTab: 'description' as 'description' | 'attempts' | 'stats' | 'solvers',
      attemptsLang: '',
      attemptsVerdict: '',
      allAttempts: false,
    },
    schema: {
      activeTab: {
        ...enumParam(['description', 'attempts', 'stats', 'solvers'] as const),
        param: 'tab',
      },
      attemptsLang: {
        ...stringParam(),
        param: 'attemptsLang',
      },
      attemptsVerdict: {
        ...stringParam(),
        param: 'attemptsVerdict',
      },
      allAttempts: {
        ...booleanFlagParam(),
        param: 'allAttempts',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });
  const activeTab = routeState.activeTab;
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSamples, setIsCheckingSamples] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
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
  const myAttemptsOnly = !routeState.allAttempts;
  const {
    paginationModel: attemptsPagination,
    onPaginationModelChange: onAttemptsPaginationChange,
    pageParams: attemptsPageParams,
    setPaginationModel: setAttemptsPagination,
  } = useGridPagination({
    initialPageSize: 10,
    querySync: {
      pageKey: 'attemptsPage',
      pageSizeKey: 'attemptsPageSize',
    },
  });
  const attemptsLangFilter = routeState.attemptsLang;
  const attemptsVerdictFilter = routeState.attemptsVerdict;

  const {
    data: problem,
    isLoading: isProblemLoading,
    isValidating: isProblemValidating,
    error: problemError,
    mutate: mutateProblem,
  } = useProblemDetail(Number.isNaN(problemId) ? undefined : problemId);

  useDocumentTitle(
    problem ? 'pageTitles.problem' : undefined,
    problem
      ? {
          problemId: problem.id,
          problemTitle: problem.title ?? '',
        }
      : undefined,
  );

  useEffect(() => {
    if (problem?.id) {
      setHasLoadedOnce(true);
    }
  }, [problem?.id]);

  const attemptsParams = useMemo<AttemptsListParams>(
    () => ({
      problemId: problemId || undefined,
      username: myAttemptsOnly ? currentUser?.username : undefined,
      lang: attemptsLangFilter || undefined,
      verdict: attemptsVerdictFilter ? Number(attemptsVerdictFilter) : undefined,
      page: attemptsPageParams.page,
      pageSize: attemptsPageParams.pageSize,
      ordering: '-id',
    }),
    [
      problemId,
      myAttemptsOnly,
      currentUser?.username,
      attemptsLangFilter,
      attemptsVerdictFilter,
      attemptsPageParams.page,
      attemptsPageParams.pageSize,
    ],
  );

  const {
    data: attemptsPage,
    mutate: mutateAttempts,
    isLoading: isAttemptsLoading,
  } = useAttemptsList(attemptsParams);

  const { selectedLang, setSelectedLang, selectedLanguage } = useProblemLanguage({
    availableLanguages: problem?.availableLanguages,
    defaultLang: problem?.availableLanguages?.[0]?.lang,
  });

  const problemCodeStorageKey = useMemo(
    () => (problem?.id ? `problem-${problem.id}-code` : null),
    [problem?.id],
  );

  const { initialCode, editorKey, codeRef, hasCode, persistCode } = usePersistedCode({
    storageKey: problemCodeStorageKey,
    template: selectedLanguage?.codeTemplate || '',
  });

  const sampleTests: ProblemSampleTest[] = problem?.sampleTests ?? [];

  useEffect(() => {
    setSelectedSampleIndex(0);
    setInput('');
    setOutput('');
    setAnswer('');
    setCheckSamplesResult([]);
    setEditorTab('console');
  }, [problem?.id]);

  useEffect(() => {
    if (!problem) return;
    const test = sampleTests[selectedSampleIndex];
    if (test) {
      setInput(test.input ?? '');
      setAnswer(test.output ?? '');
    }
  }, [problem?.id, sampleTests, selectedSampleIndex]);

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
      wsService.on('answer-for-input-result', (result: any) => {
        setAnswer(result?.answer ? `${t('problems.detail.answer')}: ${result.answer}` : '');
        setIsAnswering(false);
      }),
    );

    unsubscribers.push(
      wsService.on('check-sample-tests-result', (result: any[]) => {
        setCheckSamplesResult(result || []);
        setIsCheckingSamples(false);
        setEditorTab('samples');
      }),
    );

    // wsService.send('lang-change', i18n.language);

    return () => unsubscribers.forEach((off) => off());
  }, [t]);

  const handleTabChange = (value: 'description' | 'attempts' | 'stats' | 'solvers') => {
    setRouteField('activeTab', value);
  };

  const handleAttemptsLangFilterChange = (value: string) => {
    setRouteField('attemptsLang', value);
    setAttemptsPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleAttemptsVerdictFilterChange = (value: string) => {
    setRouteField('attemptsVerdict', value);
    setAttemptsPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePrev = async () => {
    if (!problem?.id) return;
    const prevId = await problemsQueries.problemsRepository.getProblemPrev(problem.id);
    if (prevId) {
      navigate(
        `${getResourceById(resources.Problem, prevId)}${
          studyPlanId ? `?study-plan=${studyPlanId}` : ''
        }`,
      );
    }
  };

  const handleNext = async () => {
    if (!problem?.id) return;
    const nextId = await problemsQueries.problemsRepository.getProblemNext(problem.id);
    if (nextId) {
      navigate(
        `${getResourceById(resources.Problem, nextId)}${
          studyPlanId ? `?study-plan=${studyPlanId}` : ''
        }`,
      );
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!problem?.id || !selectedLang || !codeRef.current || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await problemsQueries.problemsRepository.submitSolution(problem.id, {
        sourceCode: codeRef.current,
        lang: selectedLang,
      });
      toast.success(t('problems.detail.submitSuccess'));
      setRouteField('activeTab', 'attempts');
      mutateAttempts();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
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

    if (!problem?.id || !selectedLang || !codeRef.current || isRunning) return;
    setIsRunning(true);
    setOutput('');
    try {
      const response = await problemsQueries.problemsRepository.runCustomTest({
        problemId: problem.id,
        sourceCode: codeRef.current,
        lang: selectedLang,
        inputData: input,
      });
      if (response?.id) {
        wsService.send('custom-test-add', response.id);
      }
      setTimeout(() => setIsRunning(false), 8000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      toast.error(message);
      setIsRunning(false);
    }
  };

  const handleCheckSamples = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!problem?.id || !selectedLang || !codeRef.current || isCheckingSamples) return;
    setIsCheckingSamples(true);
    setCheckSamplesResult([]);
    try {
      const response = await problemsQueries.problemsRepository.checkSampleTests(problem.id, {
        sourceCode: codeRef.current,
        lang: selectedLang,
      });
      if (response?.id) {
        wsService.send('check-sample-tests-add', response.id);
      }
      setTimeout(() => setIsCheckingSamples(false), 15000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      toast.error(message);
      setIsCheckingSamples(false);
    }
  };

  const handleAnswerForInput = async (payload?: any) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!problem?.id || isAnswering) return;
    setIsAnswering(true);
    const id = payload?.id;
    if (id) {
      wsService.send('answer-for-input-add', id);
      setTimeout(() => setIsAnswering(false), 12000);
      return;
    }
    try {
      const response = await problemsQueries.problemsRepository.answerForInput(problem.id, {
        input_data: input,
        lang: selectedLang,
        sourceCode: codeRef.current,
      });
      if (response?.id) {
        wsService.send('answer-for-input-add', response.id);
      }
      setTimeout(() => setIsAnswering(false), 12000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      toast.error(message);
      setIsAnswering(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!problem?.id) return;
    if (problem.userInfo?.isFavorite) {
      await problemsQueries.problemsRepository.removeFavorite(problem.id);
    } else {
      await problemsQueries.problemsRepository.addFavorite(problem.id);
    }
    mutateProblem();
  };

  const handleLikeDislike = async (type: 'like' | 'dislike') => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!problem?.id) return;
    if (type === 'like') {
      await problemsQueries.problemsRepository.likeProblem(problem.id);
    } else {
      await problemsQueries.problemsRepository.dislikeProblem(problem.id);
    }
    mutateProblem();
  };

  const selectedDifficultyColor = getDifficultyColor(problem?.difficulty);
  const canUseCheckSamples = Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser);
  const showInitialSkeleton = !hasLoadedOnce && (isProblemLoading || !problem);
  const isRevalidating =
    Boolean(problem) && hasLoadedOnce && (isProblemValidating || isProblemLoading);
  const showAnswerForInputAction = Boolean(problem?.hasSolution && problem?.hasCheckInput);

  const actionStatesRef = useRef({
    currentUser: currentUser,
    hasCode: hasCode,
    isRunning,
    isCheckingSamples,
    isAnswering,
    isSubmitting,
    canUseCheckSamples,
    showAnswerForInputAction,
  });

  const actionHandlersRef = useRef({
    onRun: handleRun,
    onCheckSamples: handleCheckSamples,
    onAnswerForInput: handleAnswerForInput,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    actionStatesRef.current = {
      currentUser: currentUser,
      hasCode: hasCode,
      isRunning,
      isCheckingSamples,
      isAnswering,
      isSubmitting,
      canUseCheckSamples,
      showAnswerForInputAction,
    };
  }, [
    currentUser,
    hasCode,
    isRunning,
    isCheckingSamples,
    isAnswering,
    isSubmitting,
    canUseCheckSamples,
    showAnswerForInputAction,
  ]);

  useEffect(() => {
    actionHandlersRef.current = {
      onRun: handleRun,
      onCheckSamples: handleCheckSamples,
      onAnswerForInput: handleAnswerForInput,
      onSubmit: handleSubmit,
    };
  }, [handleRun, handleCheckSamples, handleAnswerForInput, handleSubmit]);

  useEffect(() => {
    const handleHotkeys = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      const {
        currentUser: stateUser,
        hasCode,
        isRunning,
        isCheckingSamples,
        isAnswering,
        isSubmitting,
        canUseCheckSamples: canCheckSamples,
        showAnswerForInputAction: canAnswer,
      } = actionStatesRef.current;
      const { onRun, onCheckSamples, onAnswerForInput, onSubmit } = actionHandlersRef.current;

      if (event.key === "'" && stateUser && hasCode && !isRunning) {
        event.preventDefault();
        onRun();
        return;
      }

      if (event.key === ',' && stateUser && hasCode && canCheckSamples && !isCheckingSamples) {
        event.preventDefault();
        onCheckSamples();
        return;
      }

      if (event.key === '.' && stateUser && canAnswer && !isAnswering) {
        event.preventDefault();
        onAnswerForInput();
        return;
      }

      if (
        (event.key === 'Enter' || event.key === 'NumpadEnter') &&
        event.altKey &&
        stateUser &&
        hasCode &&
        !isSubmitting
      ) {
        event.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleHotkeys);
    return () => window.removeEventListener('keydown', handleHotkeys);
  }, []);

  if (isNotFoundError(problemError)) {
    return <Page404 />;
  }

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        minWidth: 0,
        flexDirection: 'column',
        bgcolor: 'background.elevation1',
        overflow: 'hidden',
      }}
    >
      <ProblemHeader
        studyPlanId={studyPlanId}
        onPrev={handlePrev}
        onNext={handleNext}
        canNavigate={Boolean(problem?.id)}
        problemId={problemId}
        problem={problem}
        hasCode={hasCode}
        isRunning={isRunning}
        isCheckingSamples={isCheckingSamples}
        isAnswering={isAnswering}
        isSubmitting={isSubmitting}
        onRun={handleRun}
        onCheckSamples={handleCheckSamples}
        onAnswerForInput={handleAnswerForInput}
        onSubmit={handleSubmit}
        onRefreshProblem={() => mutateProblem()}
        canUseCheckSamples={canUseCheckSamples}
        showAnswerForInput={showAnswerForInputAction}
        inputValue={input}
      />

      <Card
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 0,
        }}
        aria-busy={isProblemLoading}
      >
        {isProblemLoading || isRevalidating ? (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        ) : null}

        <PanelGroup
          direction={isNarrowLayout ? 'vertical' : 'horizontal'}
          style={{ flex: 1, minHeight: 0 }}
        >
          <Panel defaultSize={isNarrowLayout ? 45 : 50} minSize={isNarrowLayout ? 25 : 35}>
            {problem && !showInitialSkeleton ? (
              <ProblemDescription
                problem={problem}
                selectedDifficultyColor={selectedDifficultyColor}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                myAttemptsOnly={myAttemptsOnly}
                onToggleMyAttempts={() => {
                  setRouteField('allAttempts', myAttemptsOnly);
                  setAttemptsPagination((prev) => ({ ...prev, page: 0 }));
                }}
                attemptsLangFilter={attemptsLangFilter}
                onAttemptsLangFilterChange={handleAttemptsLangFilterChange}
                attemptsVerdictFilter={attemptsVerdictFilter}
                onAttemptsVerdictFilterChange={handleAttemptsVerdictFilterChange}
                attempts={attemptsPage?.data ?? []}
                attemptsTotal={attemptsPage?.total ?? 0}
                attemptsPagination={attemptsPagination}
                onAttemptsPaginationChange={onAttemptsPaginationChange}
                isAttemptsLoading={isAttemptsLoading}
                onAttemptsRefresh={() => mutateAttempts()}
                onFavoriteToggle={handleFavoriteToggle}
                onLike={() => handleLikeDislike('like')}
                onDislike={() => handleLikeDislike('dislike')}
                selectedLanguage={selectedLanguage}
              />
            ) : (
              <ProblemDescriptionSkeleton />
            )}
          </Panel>

          <PanelHandle orientation={isNarrowLayout ? 'vertical' : 'horizontal'} />

          <Panel defaultSize={isNarrowLayout ? 55 : 50} minSize={isNarrowLayout ? 35 : 35}>
            {problem && !showInitialSkeleton ? (
              <ProblemEditorPanel
                problem={problem}
                initialCode={initialCode}
                editorKey={editorKey}
                onCodeChange={persistCode}
                selectedLang={selectedLang}
                onLangChange={setSelectedLang}
                sampleTests={sampleTests}
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
                canUseCheckSamples={canUseCheckSamples}
                editorTheme={editorTheme}
              />
            ) : (
              <ProblemEditorSkeleton />
            )}
          </Panel>
        </PanelGroup>
      </Card>
    </Box>
  );
};

export default ProblemDetailPage;
