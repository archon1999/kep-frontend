import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { Page404 } from 'modules/errors/ui/pages';
import {
  contestsQueries,
  useContest,
  useContestProblems,
  useContestStatisticsSummary,
} from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import ContestCard from 'modules/contests/ui/shared/components/ContestCard';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestTypeInfoCard from 'modules/contests/ui/shared/components/ContestTypeInfoCard';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestPageProblemsPreviewCard from './ContestPageProblemsPreviewCard.tsx';

const VIRTUAL_CONTEST_COST = 5;

const ContestPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();

  const {
    data: contest,
    mutate: mutateContest,
    isLoading: isContestLoading,
    error: contestError,
  } = useContest(contestId);
  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );
  const { data: contestProblems, isLoading: problemsLoading } = useContestProblems(
    contestId,
    undefined,
    canLoadContestProblems,
  );
  const { data: statisticsSummary, isLoading: isStatisticsSummaryLoading } =
    useContestStatisticsSummary(contestId);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [isVirtualLoading, setIsVirtualLoading] = useState(false);
  useDocumentTitle('pageTitles.contest', { contestTitle: contest?.title });

  const showProblemsPreview = canLoadContestProblems;
  const canRegister = contest ? contest.statusCode !== ContestStatus.Finished : false;
  const isPreviewLoading = isContestLoading || (canLoadContestProblems && problemsLoading);
  const resolvedLocale = useMemo(() => {
    const normalized = (i18n.language || '').replace('_', '-');
    try {
      const [canonical] = Intl.getCanonicalLocales(normalized || []);
      return canonical || undefined;
    } catch {
      return undefined;
    }
  }, [i18n.language]);
  const integerFormatter = useMemo(
    () => new Intl.NumberFormat(resolvedLocale, { maximumFractionDigits: 0 }),
    [resolvedLocale],
  );
  const percentFormatter = useMemo(
    () => new Intl.NumberFormat(resolvedLocale, { maximumFractionDigits: 2 }),
    [resolvedLocale],
  );
  const overviewKpis = useMemo(
    () => [
      {
        key: 'participants',
        icon: 'users',
        label: t('contests.statisticsPage.participants'),
        value:
          statisticsSummary?.participants !== undefined
            ? integerFormatter.format(statisticsSummary.participants)
            : null,
      },
      {
        key: 'attempts',
        icon: 'attempts',
        label: t('contests.statisticsPage.totalAttempts'),
        value:
          statisticsSummary?.attempts?.total !== undefined
            ? integerFormatter.format(statisticsSummary.attempts.total)
            : null,
      },
      {
        key: 'accepted',
        icon: 'verdict',
        label: t('contests.statisticsPage.totalAccepted'),
        value:
          statisticsSummary?.accepted?.total !== undefined
            ? integerFormatter.format(statisticsSummary.accepted.total)
            : null,
      },
      {
        key: 'acceptance',
        icon: 'statistics',
        label: t('contests.statisticsPage.acceptance'),
        value:
          statisticsSummary?.acceptanceRate !== undefined
            ? `${percentFormatter.format(statisticsSummary.acceptanceRate)}%`
            : null,
      },
    ],
    [integerFormatter, percentFormatter, statisticsSummary, t],
  );

  const handleRegistrationToggle = useCallback(async () => {
    if (!contestId || !contest) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

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
  }, [contest, contestId, currentUser, mutateContest, redirectToLogin]);

  const registrationCta = useMemo(() => {
    if (!canRegister || !contest) return null;
    const isRegistered = Boolean(contest.userInfo?.isRegistered);
    return (
      <Button
        fullWidth
        variant="contained"
        color={isRegistered ? 'error' : 'primary'}
        onClick={handleRegistrationToggle}
        disabled={isRegistrationLoading}
      >
        {isRegistered ? t('contests.unregister') : t('contests.register')}
      </Button>
    );
  }, [canRegister, contest, handleRegistrationToggle, isRegistrationLoading, t]);

  const handleStartVirtualContest = useCallback(async () => {
    if (!contest) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    setIsVirtualLoading(true);
    try {
      await contestsQueries.contestsRepository.startVirtualContest(contest.id);
      await mutateContest();
      navigate(getResourceByParams(resources.ContestProblems, { id: contest.id }));
    } finally {
      setIsVirtualLoading(false);
    }
  }, [contest, currentUser, mutateContest, navigate, redirectToLogin]);

  const virtualContestCta = useMemo(() => {
    if (!contest || contest.statusCode !== ContestStatus.Finished) return null;

    const availableStarts = contest.userInfo?.virtualContestAvailable ?? 0;
    const canStart = availableStarts > 0;

    if (!canStart) {
      return (
        <KepcoinSpendConfirm
          value={VIRTUAL_CONTEST_COST}
          purchaseUrl={`/api/contests/${contest.id}/purchase-virtual-contest/`}
          onSuccess={async () => {
            await mutateContest();
          }}
          disabled={isVirtualLoading}
          fullWidth
        >
          <Button fullWidth variant="contained" color="secondary" disabled={isVirtualLoading}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <span>{t('contests.purchaseVirtualContest')}</span>
              <KepcoinValue value={VIRTUAL_CONTEST_COST} iconSize={16} color="inherit" />
            </Stack>
          </Button>
        </KepcoinSpendConfirm>
      );
    }

    return (
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleStartVirtualContest}
        disabled={isVirtualLoading}
      >
        {t('contests.startVirtualContest')}
      </Button>
    );
  }, [contest, handleStartVirtualContest, isVirtualLoading, mutateContest, t]);

  if (isNotFoundError(contestError)) {
    return <Page404 />;
  }

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.overview')}
        contest={contest}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
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

            <Grid container spacing={2}>
              {overviewKpis.map((item) => (
                <Grid size={{ xs: 6 }} key={item.key}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent
                      sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            flexShrink: 0,
                          }}
                        >
                          <KepIcon name={item.icon as any} fontSize={18} />
                        </Avatar>
                        <Stack spacing={0.25} minWidth={0}>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {item.label}
                          </Typography>
                          {isStatisticsSummaryLoading || item.value === null ? (
                            <Skeleton width={64} height={28} />
                          ) : (
                            <Typography variant="h6" fontWeight={800} noWrap>
                              {item.value}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <ContestCountdownCard contest={contest} isLoading={isContestLoading} />

            {contest ? <ContestTypeInfoCard contest={contest} /> : null}

            {registrationCta ? <Box>{registrationCta}</Box> : null}
            {virtualContestCta ? <Box>{virtualContestCta}</Box> : null}

            {showProblemsPreview ? (
              <ContestPageProblemsPreviewCard
                contest={contest}
                contestId={contestId}
                contestProblems={contestProblems}
                isLoading={isPreviewLoading}
              />
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestPage;
