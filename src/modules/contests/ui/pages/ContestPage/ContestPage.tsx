import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useContestPage } from 'modules/contests/application/hooks/useContestPage';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ContestTypeInfoCard from 'modules/contests/ui/shared/components/ContestTypeInfoCard';
import { Page404 } from 'modules/errors/ui/pages';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import ContestPageProblemsPreviewCard from './ContestPageProblemsPreviewCard.tsx';
import ContestAnnouncement from './components/ContestAnnouncement';
import ContestPodium from './components/ContestPodium';

const VIRTUAL_CONTEST_COST = 5;

const ContestPage = () => {
  const {
    contest,
    mutateContest,
    isContestLoading,
    contestError,
    contestProblems,
    problemsError,
    isStatisticsSummaryLoading,
    statisticsError,
    handleRegistrationToggle,
    handleStartVirtualContest,
    contestId,
    showProblemsPreview,
    showStatisticsSummary,
    canRegister,
    isPreviewLoading,
    overviewKpis,
    isRegistrationLoading,
    isVirtualLoading,
  } = useContestPage();

  const { t } = useTranslation();

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
          <Button fullWidth variant="outlined" color="secondary" disabled={isVirtualLoading}>
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
    <ContestPageLayout
      flush
      error={contestError}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.tabs.overview')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <Stack spacing={0}>
            {contest ? (
              <ContestAnnouncement contest={contest} />
            ) : (
              <Card variant="section">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Skeleton height={32} width="60%" />
                    <Skeleton height={18} width="90%" />
                    <Skeleton height={18} width="80%" />
                  </Stack>
                </CardContent>
              </Card>
            )}

            {showStatisticsSummary && statisticsError ? (
              <Alert severity="error">{t('contests.detail.dataError')}</Alert>
            ) : showStatisticsSummary ? (
              <Grid container spacing={0}>
                {overviewKpis.map((item, index) => (
                  <Grid size={{ xs: 6, lg: 3 }} key={item.key}>
                    <Card
                      variant="section"
                      sx={{
                        height: '100%',
                        borderRight: {
                          xs: index % 2 === 0 ? '1px solid var(--kep-line)' : 0,
                          lg: index < 3 ? '1px solid var(--kep-line)' : 0,
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          '&:last-child': { pb: { xs: 1.5, sm: 2 } },
                        }}
                      >
                        <Stack direction="column" spacing={1.25} alignItems="flex-start">
                          <KepIcon
                            name={item.icon as any}
                            fontSize={20}
                            sx={{ color: 'primary.main' }}
                          />
                          <Stack spacing={0.25} minWidth={0}>
                            <Typography
                              variant="label"
                              color="text.secondary"
                              sx={{ minHeight: '3em' }}
                            >
                              {item.label}
                            </Typography>
                            {isStatisticsSummaryLoading || item.value === null ? (
                              <Skeleton width={64} height={28} />
                            ) : (
                              <Typography variant="metric" sx={{ fontSize: 28 }} noWrap>
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
            ) : null}
            {contest?.statusCode === ContestStatus.Finished && (
              <ContestPodium contestId={contest.id} />
            )}
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            borderLeft: { md: '1px solid var(--kep-line)' },
            borderTop: { xs: '1px solid var(--kep-line)', md: 0 },
          }}
        >
          <Stack spacing={0}>
            <ContestCountdownCard contest={contest} isLoading={isContestLoading} />

            {contest ? <ContestTypeInfoCard contest={contest} /> : null}

            {registrationCta || virtualContestCta ? (
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                {registrationCta ?? virtualContestCta}
              </Box>
            ) : null}

            {showProblemsPreview && problemsError ? (
              <Alert severity="error">{t('contests.detail.dataError')}</Alert>
            ) : showProblemsPreview ? (
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
    </ContestPageLayout>
  );
};

export default ContestPage;
