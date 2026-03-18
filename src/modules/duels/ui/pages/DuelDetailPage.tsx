import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
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
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { problemsQueries } from 'modules/problems/application/queries.ts';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { usePersistedCode } from 'modules/problems/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/hooks/useProblemLanguage';
import ProblemsAttemptsTable from 'modules/problems/ui/components/ProblemsAttemptsTable.tsx';
import { PanelHandle } from 'modules/problems/ui/components/problem-detail/PanelHandles';
import { ProblemBody } from 'modules/problems/ui/components/problem-detail/ProblemBody';
import { ProblemEditorPanel } from 'modules/problems/ui/components/problem-detail/ProblemEditorPanel';
import useGridPagination from 'shared/hooks/useGridPagination';
import { toast } from 'sonner';
import { duelsQueries, useDuelDetail } from '../../application/queries.ts';

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatDuration = (value?: string | null) => {
  if (!value) return '--';
  const match = /^(\d+):(\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
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

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const duelId = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'description' | 'attempts'>(
    (searchParams.get('tab') as 'attempts') || 'description',
  );
  const [timerText, setTimerText] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const currentSymbol = searchParams.get('problem');
  const activeProblem =
    problems.find((problem) => problem.symbol === currentSymbol) ?? problems[0] ?? null;

  useEffect(() => {
    if (!problems.length) return;
    if (currentSymbol && problems.some((problem) => problem.symbol === currentSymbol)) return;
    const next = new URLSearchParams(searchParams);
    next.set('problem', problems[0].symbol);
    next.set('tab', activeTab);
    setSearchParams(next, { replace: true });
  }, [activeTab, currentSymbol, problems, searchParams, setSearchParams]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    setActiveTab(tab === 'attempts' ? 'attempts' : 'description');
  }, [searchParams]);

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
    const tab = activeProblem?.problem?.sampleTests?.[selectedSampleIndex];
    setInput(tab?.input ?? '');
    setAnswer(tab?.output ?? '');
    setOutput('');
  }, [activeProblem?.problem?.id, activeProblem?.problem?.sampleTests, selectedSampleIndex]);

  const attemptsParams = useMemo<AttemptsListParams | null>(() => {
    if (!activeProblem?.problem?.id || !currentUser?.username || !duel) return null;
    const base = {
      username: currentUser.username,
      page: attemptsPageParams.page,
      pageSize: attemptsPageParams.pageSize,
      ordering: '-id',
    };
    if (duel.canSubmitForDuel) {
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

  const currentIndex = problems.findIndex((problem) => problem.symbol === activeProblem?.symbol);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  const updateSearch = (values: { tab?: 'description' | 'attempts'; symbol?: string }) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', values.tab ?? activeTab);
    if (values.symbol ?? activeProblem?.symbol) {
      next.set('problem', values.symbol ?? activeProblem!.symbol);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSubmit = async () => {
    if (!activeProblem?.problem?.id || !selectedLang || !codeRef.current || !duel || isSubmitting) {
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

  if (isLoading && !duel) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 1000 }}>
      <Box
        component="header"
        sx={{
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button component={RouterLink} to={resources.Duels} variant="text" color="primary">
              {t('duels.title')}
            </Button>
            <Typography variant="h6" fontWeight={800}>
              {duel.playerFirst.username} vs {duel.playerSecond?.username ?? '--'}
            </Typography>
            <Chip
              label={duel.canSubmitForDuel ? t('duels.submitModeDuel') : t('duels.submitModePractice')}
              size="small"
              variant="outlined"
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={timerText} size="small" color="primary" variant="outlined" />
            {duel.preset ? (
              <Chip
                label={`${duel.preset.title || t('duels.preset')} | ${formatDuration(duel.preset.duration)}`}
                size="small"
                variant="outlined"
              />
            ) : null}
            <Typography variant="caption" color="text.secondary">
              {t('duels.starts')}: {formatDate(duel.startTime)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => prevProblem && updateSearch({ symbol: prevProblem.symbol })} disabled={!prevProblem}>
            {t('duels.prevProblem')}
          </Button>
          <Button variant="outlined" onClick={() => nextProblem && updateSearch({ symbol: nextProblem.symbol })} disabled={!nextProblem}>
            {t('duels.nextProblem')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!currentUser || !hasCode || !activeProblem?.problem?.id || isSubmitting}
          >
            {t('problems.detail.submit')}
          </Button>
        </Stack>
      </Box>

      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        {isLoading || isValidating ? (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        ) : null}

        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Stack spacing={1.5}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  {[duel.playerFirst, duel.playerSecond].filter(Boolean).map((player) => (
                    <Stack
                      key={player!.id}
                      sx={{ px: 1.5, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                    >
                      <Typography variant="subtitle2" fontWeight={800}>
                        {player!.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {player!.ratingTitle}
                      </Typography>
                      <Typography variant="h5" fontWeight={900} color="primary.main">
                        {player!.balls ?? 0}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t('duels.problems')}
                  </Typography>
                  {!problems.length ? (
                    <Typography variant="body2" color="text.secondary">
                      {duel.status === -1 ? t('duels.problemsHiddenUntilStart') : t('duels.noProblems')}
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {problems.map((problem) => (
                        <Button
                          key={problem.symbol}
                          variant={problem.symbol === activeProblem?.symbol ? 'contained' : 'outlined'}
                          onClick={() => updateSearch({ symbol: problem.symbol })}
                        >
                          <Stack spacing={0.25} alignItems="flex-start">
                            <Typography variant="subtitle2" fontWeight={800}>
                              {problem.symbol}
                            </Typography>
                            <Typography variant="caption">{problem.ball ?? 0} pts</Typography>
                            <Typography variant="caption">
                              {duel.playerFirst.username}: {problem.playerFirstBall ?? 0}
                            </Typography>
                            {duel.playerSecond ? (
                              <Typography variant="caption">
                                {duel.playerSecond.username}: {problem.playerSecondBall ?? 0}
                              </Typography>
                            ) : null}
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={50} minSize={35}>
            {activeProblem?.problem ? (
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 0 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, value) => updateSearch({ tab: value })}
                    sx={{ px: 2, pt: 1 }}
                  >
                    <Tab value="description" label={t('contests.problem.description')} />
                    <Tab value="attempts" label={t('duels.myAttempts')} />
                  </Tabs>
                  <Divider />
                  <Box sx={{ p: 3 }}>
                    {activeTab === 'description' ? (
                      <Stack spacing={2}>
                        <Stack spacing={0.5}>
                          <Typography variant="h5" fontWeight={700}>
                            {activeProblem.symbol}. {activeProblem.problem.title}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip label={`${activeProblem.ball ?? 0} pts`} size="small" />
                            <Chip label={`${selectedLanguage?.timeLimit ?? activeProblem.problem.timeLimit ?? 0} ms`} size="small" variant="outlined" />
                            <Chip label={`${selectedLanguage?.memoryLimit ?? activeProblem.problem.memoryLimit ?? 0} MB`} size="small" variant="outlined" />
                          </Stack>
                        </Stack>
                        <ProblemBody problem={activeProblem.problem} />
                      </Stack>
                    ) : (
                      currentUser ? (
                        <ProblemsAttemptsTable
                          attempts={attemptsPage?.data ?? []}
                          total={attemptsPage?.total ?? 0}
                          paginationModel={attemptsPagination}
                          onPaginationChange={onAttemptsPaginationChange}
                          isLoading={isAttemptsLoading}
                          onRerun={() => mutateAttempts()}
                          showProblemColumn={false}
                          getProblemLink={() => getResourceById(resources.Duel, duel.id)}
                        />
                      ) : (
                        <Typography color="text.secondary">{t('duels.signInForAttempts')}</Typography>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
                <Typography color="text.secondary">
                  {duel.status === -1 ? t('duels.workspaceLockedDescription', { startTime: formatDate(duel.startTime) }) : t('duels.noProblems')}
                </Typography>
              </Box>
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
                onRun={() => {}}
                onSubmit={handleSubmit}
                onCheckSamples={() => {}}
                isRunning={false}
                isSubmitting={isSubmitting}
                isCheckingSamples={false}
                checkSamplesResult={[]}
                editorTab="console"
                onEditorTabChange={() => {}}
                canUseCheckSamples={false}
                editorTheme="vs"
              />
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
                <Typography color="text.secondary">
                  {duel.status === -1 ? t('duels.editorUnlockedOnStart') : t('duels.noProblems')}
                </Typography>
              </Box>
            )}
          </Panel>
        </PanelGroup>
      </Card>
    </Box>
  );
};

export default DuelDetailPage;
