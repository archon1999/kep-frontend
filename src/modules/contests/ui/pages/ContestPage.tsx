import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestCountdownCard from '../components/ContestCountdownCard';
import { contestsQueries, useContest, useContestProblems } from '../../application/queries';
import ContestCard from '../components/ContestCard';
import ContestPageHeader from '../components/ContestPageHeader';
import { ContestStatus } from '../../domain/entities/contest-status';

const ContestPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest, mutate: mutateContest, isLoading: isContestLoading } = useContest(contestId);
  const { data: contestProblems, isLoading: problemsLoading } = useContestProblems(contestId);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contest' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const showProblemsPreview = contest ? contest.statusCode !== ContestStatus.NotStarted : true;
  const canRegister = contest ? contest.statusCode !== ContestStatus.Finished : false;
  const isPreviewLoading = isContestLoading || problemsLoading;

  const handleRegistrationToggle = useCallback(async () => {
    if (!contestId || !contest) return;
    setIsRegistrationLoading(true);
    try {
      if (contest.userInfo?.isRegistered && contest.statusCode === ContestStatus.Already) {
        return;
      }

      if (contest.userInfo?.isRegistered) {
        await contestsQueries.contestsRepository.cancelRegistration(contest.id);
      } else {
        await contestsQueries.contestsRepository.register(contest.id);
      }
      await mutateContest();
    } finally {
      setIsRegistrationLoading(false);
    }
  }, [contest, contestId, mutateContest]);

  const registrationCta = useMemo(() => {
    if (!canRegister || !contest) return null;
    const isRegistered = Boolean(contest.userInfo?.isRegistered);
    return (
      <Button
        variant="contained"
        color={isRegistered ? 'error' : 'primary'}
        onClick={handleRegistrationToggle}
        disabled={isRegistrationLoading}
      >
        {isRegistered ? t('contests.unregister') : t('contests.register')}
      </Button>
    );
  }, [canRegister, contest, handleRegistrationToggle, isRegistrationLoading, t]);

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.overview')}
        contest={contest}
        contestId={contestId}
        tabsRightContent={registrationCta ?? (isContestLoading ? <Box /> : null)}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {contest ? (
            <ContestCard contest={contest} />
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Skeleton height={32} width="60%" />
                  <Skeleton height={18} width="90%" />
                  <Skeleton height={18} width="80%" />
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />

          {showProblemsPreview ? (
            <Box mt={3}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {t('contests.problemsPreview')}
                    </Typography>
                    {contestProblems && contestProblems.length ? (
                      <Stack spacing={1}>
                        {contestProblems.slice(0, 5).map((problem) => (
                          <Stack
                            key={problem.symbol}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                          >
                            <Stack direction="column" spacing={0.25} minWidth={0}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                component={RouterLink}
                                to={getResourceByParams(resources.ContestProblem, {
                                  id: contest?.id ?? contestId ?? '',
                                  symbol: problem.symbol,
                                })}
                                style={{ textDecoration: 'none' }}
                              >
                                {problem.symbol}. {problem.problem.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {problem.problem.timeLimit} ms - {problem.problem.memoryLimit} MB
                              </Typography>
                            </Stack>
                            <Chip
                              label={t('contests.solvedShort', { solved: problem.solved ?? 0 })}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Stack>
                        ))}
                      </Stack>
                    ) : isPreviewLoading ? (
                      <Stack spacing={1.25}>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Stack
                            key={index}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                          >
                            <Stack direction="column" spacing={0.5} minWidth={0} flex={1}>
                              <Skeleton variant="rounded" width={72} height={24} />
                              <Skeleton variant="text" width="80%" />
                            </Stack>
                            <Skeleton variant="rounded" width={90} height={28} />
                          </Stack>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.noProblems')}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestPage;
