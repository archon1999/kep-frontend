import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { getResourceByParams, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { contestHasBalls } from 'modules/contests/utils/contestType.ts';
import { problemsQueries, useAttemptsList } from 'modules/problems/application/queries.ts';
import { ProblemSampleTest } from 'modules/problems/domain/entities/problem.entity';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import ProblemsAttemptsTable from 'modules/problems/ui/components/ProblemsAttemptsTable.tsx';
import { PanelHandle } from 'modules/problems/ui/components/problem-detail/PanelHandles';
import { ProblemBody } from 'modules/problems/ui/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/components/problem-detail/ProblemEditorSkeleton';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo.tsx';
import { VerdictKey } from 'shared/components/problems/AttemptVerdict';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import {
  useContest,
  useContestContestant,
  useContestProblem,
  useContestProblems,
} from '../../application/queries';
import { contestsQueries } from '../../application/queries.ts';
import {
  ContestProblemEntity,
  ContestProblemInfo,
} from '../../domain/entities/contest-problem.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import { ContestantEntity } from '../../domain/entities/contestant.entity';
import { sortContestProblems } from '../../utils/sortContestProblems';
import ContestantView from '../components/ContestantView';
import useGridPagination from 'shared/hooks/useGridPagination';

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

const ContestantResultsFooter = ({
  contestant,
  contestProblems,
  contestType,
}: {
  contestant?: ContestantEntity | null;
  contestProblems: ContestProblemEntity[];
  contestType?: string;
}) => {
  const { t } = useTranslation();

  if (!contestant) {
    return null;
  }

  const formatResult = (info?: ContestProblemInfo | null) => {
    if (!info) return { label: '-', color: 'default' as const };
    if (info.firstAcceptedTime) {
      return { label: '+', color: 'success' as const };
    }
    if (info.attemptsCount > 0) {
      return { label: `-${info.attemptsCount}`, color: 'error' as const };
    }
    return { label: '-', color: 'default' as const };
  };

  const delta = contestant.delta ?? 0;
  const deltaColor = delta > 0 ? 'success' : delta < 0 ? 'error' : 'default';
  const deltaLabel = delta ? `${delta > 0 ? '+' : ''}${delta}` : '0';

  return (
    <Card
      sx={{
        px: 2.5,
        py: 2,
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography fontWeight={600}>#{contestant.rank}</Typography>
          <ContestantView
            contestant={contestant}
            imgSize={28}
            isVirtual={contestant.isVirtual}
            isUnrated={contestant.isUnrated}
            isOfficial={contestant.isOfficial}
          />
          <Typography color="primary" fontWeight={600}>
            {contestant.points}
          </Typography>
          {contestHasBalls(contestType as any) ? (
            <Typography>
              {`${t('contests.standings.penalties')}: ${contestant.penalties ?? 0}`}
            </Typography>
          ) : null}
          <Chip
            label={`${t('contests.ratingChanges.columns.delta')}: ${deltaLabel}`}
            color={deltaColor === 'default' ? 'default' : deltaColor}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {contestProblems.map((problem) => {
            const info =
              contestant.problemsInfo?.find((item) => item.problemSymbol === problem.symbol) ??
              null;
            const result = formatResult(info);
            return (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                key={problem.symbol}
                sx={(theme) => ({
                  borderRadius: 1.5,
                  px: 1.25,
                  py: 0.75,
                  border: '1px solid',
                  borderColor:
                    result.color === 'default'
                      ? alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 1)
                      : alpha(theme.palette[result.color].main, 0.6),
                  backgroundColor:
                    result.color === 'default'
                      ? alpha(
                          theme.palette.common.white,
                          theme.palette.mode === 'dark' ? 0.04 : 0.02,
                        )
                      : alpha(
                          theme.palette[result.color].main,
                          theme.palette.mode === 'dark' ? 0.16 : 0.1,
                        ),
                  minWidth: 54,
                })}
              >
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {problem.symbol}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={result.color === 'default' ? 'text.primary' : `${result.color}.main`}
                  sx={{ lineHeight: 1.2 }}
                >
                  {result.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

const ContestProblemPage = () => {
  const { id, symbol } = useParams<{ id: string; symbol: string }>();
  const contestId = id ? Number(id) : undefined;
  const problemSymbol = symbol;
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const themeMode = useThemeMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const permissions = useProblemPermissions(currentUser?.permissions);

  const [activeTab, setActiveTab] = useState<'description' | 'attempts'>(
    (searchParams.get('tab') as 'attempts') || 'description',
  );
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs' | 'vs-dark'>(
    themeMode.mode === 'dark' ? 'vs-dark' : 'vs',
  );
  const {
    paginationModel: attemptsPagination,
    onPaginationModelChange: onAttemptsPaginationChange,
    pageParams: attemptsPageParams,
  } = useGridPagination({ initialPageSize: 10 });
  const [timeLeft, setTimeLeft] = useState<string>('');
  const actionStatesRef = useRef({
    currentUser,
    hasCode: false,
    isRunning,
    isSubmitting,
    isContestFinished: false,
  });
  const actionHandlersRef = useRef({
    onRun: () => {},
    onSubmit: () => {},
  });

  useEffect(() => {
    setEditorTheme(themeMode.mode === 'dark' ? 'vs-dark' : 'vs');
  }, [themeMode.mode]);

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: contestProblems = [], mutate: mutateContestProblems } =
    useContestProblems(contestId);
  const { data: contestProblem, isLoading: isProblemLoading } = useContestProblem(
    contestId,
    problemSymbol,
  );
  const { data: contestant, mutate: mutateContestant } = useContestContestant(contestId, {
    refreshInterval: 30000,
  });
  const isContestFinished = contest?.statusCode === ContestStatus.Finished;

  const problem = contestProblem?.problem;
  const upsolveHref = problem?.id
    ? getResourceByParams(resources.Problem, { id: problem.id })
    : undefined;
  const sampleTests: ProblemSampleTest[] = problem?.sampleTests ?? [];
  useDocumentTitle(contest?.title && problem?.title, {
    contestTitle: contest?.title,
    problemSymbol: contestProblem?.symbol ?? '',
    problemTitle: problem?.title,
  });

  useEffect(() => {
    if (problem?.id) {
      setHasLoadedOnce(true);
    }
  }, [problem?.id]);

  useEffect(() => {
    if (!contest?.finishTime || contest?.statusCode !== ContestStatus.Already) {
      setTimeLeft('');
      return;
    }

    const update = () => {
      const diffSeconds = dayjs(contest.finishTime).diff(dayjs(), 'second');
      if (diffSeconds <= 0) {
        setTimeLeft('');
        return;
      }
      const hours = Math.floor(diffSeconds / 3600)
        .toString()
        .padStart(2, '0');
      const minutes = Math.floor((diffSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
      const seconds = Math.floor(diffSeconds % 60)
        .toString()
        .padStart(2, '0');
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [contest?.finishTime, contest?.statusCode]);

  const attemptsParams = useMemo<AttemptsListParams>(
    () => ({
      contestId,
      contestProblem: problemSymbol,
      username: currentUser?.username,
      page: attemptsPageParams.page,
      pageSize: attemptsPageParams.pageSize,
      ordering: '-id',
    }),
    [
      contestId,
      currentUser?.username,
      attemptsPageParams.page,
      attemptsPageParams.pageSize,
      problemSymbol,
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

  const contestCodeStorageKey = useMemo(
    () =>
      problem?.id && selectedLang
        ? `contest-${contest?.id ?? contestId ?? 'unknown'}-problem-${problem.id}-code-${selectedLang}`
        : null,
    [contest?.id, contestId, problem?.id, selectedLang],
  );

  const { initialCode, editorKey, codeRef, hasCode, persistCode } = usePersistedCode({
    storageKey: contestCodeStorageKey,
    template: selectedLanguage?.codeTemplate || '',
  });

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
      wsService.on('check-sample-tests-result', (result: any) => {
        setCheckSamplesResult(result ?? []);
        setIsCheckingSamples(false);
        setEditorTab('samples');
      }),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [t]);

  const sortedProblems = useMemo(() => sortContestProblems(contestProblems), [contestProblems]);

  const currentIndex = sortedProblems.findIndex((item) => item.symbol === problemSymbol);
  const prevSymbol = currentIndex > 0 ? sortedProblems[currentIndex - 1]?.symbol : null;
  const nextSymbol =
    currentIndex >= 0 && currentIndex < sortedProblems.length - 1
      ? sortedProblems[currentIndex + 1]?.symbol
      : null;

  const handlePrev = () => {
    if (prevSymbol) {
      navigate(
        getResourceByParams(resources.ContestProblem, { id: contestId ?? '', symbol: prevSymbol }),
      );
    }
  };

  const handleNext = () => {
    if (nextSymbol) {
      navigate(
        getResourceByParams(resources.ContestProblem, { id: contestId ?? '', symbol: nextSymbol }),
      );
    }
  };

  const handleSubmit = async () => {
    if (
      !contest?.id ||
      !problemSymbol ||
      !selectedLang ||
      !codeRef.current ||
      isSubmitting ||
      isContestFinished
    )
      return;
    setIsSubmitting(true);
    try {
      await contestsQueries.contestsRepository.submitSolution(contest.id, {
        contestProblem: problemSymbol,
        sourceCode: codeRef.current,
        lang: selectedLang,
      });
      toast.success(t('problems.detail.submitSuccess'));
      setActiveTab('attempts');
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', 'attempts');
        return next;
      });
      await Promise.all([mutateAttempts(), mutateContestProblems(), mutateContestant()]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    if (!problem?.id || !selectedLang || !codeRef.current || isRunning || isContestFinished) return;
    setIsRunning(true);
    setOutput('');
    const response = await problemsQueries.problemsRepository.runCustomTest({
      sourceCode: codeRef.current,
      lang: selectedLang,
      inputData: input,
    });
    if (response?.id) {
      wsService.send('custom-test-add', response.id);
    }
    setTimeout(() => setIsRunning(false), 8000);
  };

  const handleCheckSamples = async () => {
    if (!problem?.id || !selectedLang || !codeRef.current || isCheckingSamples || isContestFinished)
      return;
    setIsCheckingSamples(true);
    setCheckSamplesResult([]);
    const response = await problemsQueries.problemsRepository.checkSampleTests(problem.id, {
      sourceCode: codeRef.current,
      lang: selectedLang,
    });
    if (response?.id) {
      wsService.send('check-sample-tests-add', response.id);
    }
    setTimeout(() => setIsCheckingSamples(false), 15000);
  };

  const canUseCheckSamples = Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser);
  const showInitialSkeleton = !hasLoadedOnce && (isProblemLoading || !problem);
  const isRevalidating =
    Boolean(problem) && hasLoadedOnce && (isProblemLoading || isContestLoading);

  useEffect(() => {
    actionStatesRef.current = {
      currentUser,
      hasCode,
      isRunning,
      isSubmitting,
      isContestFinished,
    };
  }, [currentUser, hasCode, isContestFinished, isRunning, isSubmitting]);

  useEffect(() => {
    actionHandlersRef.current = {
      onRun: handleRun,
      onSubmit: handleSubmit,
    };
  }, [handleRun, handleSubmit]);

  useEffect(() => {
    const handleHotkeys = (event: KeyboardEvent) => {
      const state = actionStatesRef.current;
      const handlers = actionHandlersRef.current;

      if (event.ctrlKey && event.key === "'") {
        if (state.currentUser && state.hasCode && !state.isRunning && !state.isContestFinished) {
          event.preventDefault();
          handlers.onRun();
        }
      }

      if (
        event.ctrlKey &&
        event.altKey &&
        (event.key === 'Enter' || event.key === 'NumpadEnter') &&
        state.currentUser &&
        state.hasCode &&
        !state.isSubmitting &&
        !state.isContestFinished
      ) {
        event.preventDefault();
        handlers.onSubmit();
      }
    };

    window.addEventListener('keydown', handleHotkeys);
    return () => window.removeEventListener('keydown', handleHotkeys);
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        minWidth: 1000,
        flexDirection: 'column',
        bgcolor: 'background.elevation1',
      }}
    >
      <Box
        component="header"
        sx={{
          borderColor: 'divider',
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

          <Stack direction="row" alignItems="center" spacing={0}>
            {timeLeft ? (
              <Chip
                icon={<IconifyIcon icon="mdi:timer-outline" width={18} height={18} />}
                label={timeLeft}
                color="primary"
                variant="soft"
                size="medium"
                sx={{
                  '& .MuiChip-label': {
                    fontFamily: 'Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  },
                }}
              />
            ) : null}

            <Button
              component={RouterLink}
              to={getResourceByParams(resources.ContestProblems, { id: contestId ?? '' })}
              startIcon={<IconifyIcon icon="mdi:format-list-bulleted" width={18} height={18} />}
              variant="text"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {t('contests.tabs.problems')}
            </Button>
            <Button
              component={RouterLink}
              to={getResourceByParams(resources.ContestStandings, { id: contestId ?? '' })}
              startIcon={<IconifyIcon icon="mdi:podium" width={18} height={18} />}
              variant="text"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {t('contests.tabs.standings')}
            </Button>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title={t('contests.problem.prev')}>
                <Button
                  onClick={handlePrev}
                  variant="text"
                  color="primary"
                  disabled={!prevSymbol}
                  startIcon={<IconifyIcon icon="mdi:chevron-left" width={18} height={18} />}
                />
              </Tooltip>
              <Tooltip title={t('contests.problem.next')}>
                <Button
                  onClick={handleNext}
                  variant="text"
                  color="primary"
                  disabled={!nextSymbol}
                  endIcon={<IconifyIcon icon="mdi:chevron-right" width={18} height={18} />}
                />
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
          <Stack direction="row" spacing={1}>
            <Tooltip title={t('problems.detail.runHotkey')}>
              <span style={{ display: 'inline-flex' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRun}
                  disabled={!currentUser || isRunning || !hasCode || isContestFinished}
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
                  disabled={!currentUser || isSubmitting || !hasCode || isContestFinished}
                  startIcon={<IconifyIcon icon="mdi:send-outline" width={18} height={18} />}
                >
                  {t('problems.detail.submit')}
                </Button>
              </span>
            </Tooltip>
          </Stack>
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
          position: 'relative',
          minHeight: 0,
        }}
        aria-busy={isProblemLoading}
      >
        {isProblemLoading ? (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        ) : null}

        {isRevalidating ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              bgcolor: (theme) =>
                alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.3 : 0.45),
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : null}

        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={50} minSize={35}>
            {problem && !showInitialSkeleton ? (
              <Card
                background={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 0 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, value) => {
                      setActiveTab(value);
                      setSearchParams((prev) => {
                        const next = new URLSearchParams(prev);
                        next.set('tab', value);
                        return next;
                      });
                    }}
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
                      label={t('contests.problem.myAttempts')}
                      icon={<IconifyIcon icon="mdi:history" width={18} height={18} />}
                      iconPosition="start"
                    />
                  </Tabs>
                  <Divider />

                  <Box sx={{ p: 3 }}>
                    {activeTab === 'description' ? (
                      <Stack direction="column" spacing={2}>
                        <Stack direction="column" spacing={1} flexWrap="wrap">
                          <Typography variant="h5" fontWeight={700}>
                            {problemSymbol}. {problem.title}
                          </Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                              label={`${selectedLanguage?.timeLimit ?? problem.timeLimit ?? 0} ms`}
                              variant="outlined"
                              size="small"
                            />
                            <Chip
                              label={`${selectedLanguage?.memoryLimit ?? problem.memoryLimit ?? 0} MB`}
                              variant="outlined"
                              size="small"
                            />
                          </Stack>
                        </Stack>

                        <ProblemBody problem={problem} />
                      </Stack>
                    ) : null}

                    {activeTab === 'attempts' ? (
                      <ProblemsAttemptsTable
                        attempts={attemptsPage?.data ?? []}
                        total={attemptsPage?.total ?? 0}
                        paginationModel={attemptsPagination}
                        onPaginationChange={onAttemptsPaginationChange}
                        isLoading={isAttemptsLoading}
                        onRerun={() => mutateAttempts()}
                        showProblemColumn={false}
                        getProblemLink={(attempt) =>
                          getResourceByParams(resources.ContestProblem, {
                            id: contest?.id ?? contestId ?? '',
                            symbol: attempt.contestProblemSymbol ?? problemSymbol ?? '',
                          })
                        }
                      />
                    ) : null}
                  </Box>
                </CardContent>

                <ContestantResultsFooter
                  contestant={contestant}
                  contestProblems={sortedProblems}
                  contestType={contest?.type}
                />
              </Card>
            ) : (
              <ProblemDescriptionSkeleton />
            )}
          </Panel>

          <PanelHandle />

          <Panel defaultSize={50} minSize={35}>
            {problem && !showInitialSkeleton ? (
              <ProblemEditorPanel
                problem={problem}
                initialCode={initialCode}
                editorKey={editorKey}
                onCodeChange={(value, langOverride) => {
                  const langToUse = langOverride || selectedLang;
                  if (!problem?.id || !langToUse) return;

                  const codeKey =
                    langToUse === selectedLang
                      ? contestCodeStorageKey
                      : `contest-${contest?.id ?? contestId ?? 'unknown'}-problem-${problem.id}-code-${langToUse}`;

                  const shouldResetEditor = Boolean(langOverride);
                  persistCode(value, codeKey, shouldResetEditor);
                }}
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
                isDisabled={isContestFinished}
                upsolveHref={upsolveHref}
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

export default ContestProblemPage;
