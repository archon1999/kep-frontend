import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { resources } from 'app/routes/resources';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from 'modules/kepcoin/application/queries';
import HowToEarnWidget from 'modules/kepcoin/ui/shared/widgets/HowToEarnWidget';
import HowToSpendWidget from 'modules/kepcoin/ui/shared/widgets/HowToSpendWidget';
import KepcoinActivityWidget from 'modules/kepcoin/ui/shared/widgets/KepcoinActivityWidget';
import { HistoryView } from 'modules/kepcoin/ui/types';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Streak from 'shared/components/rating/Streak';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam } from 'shared/lib/queryParams';

const PAGE_SIZE = 10;
const STREAK_FREEZE_COST = 10;

const surfaceCardSx = {
  borderRadius: 2,
  border: (theme: Theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  boxShadow: 'none',
} as const;

interface HeroStatCardProps {
  label: string;
  icon: string;
  tone: 'warning' | 'success' | 'info';
  isLoading: boolean;
  value: ReactNode;
}

const HeroStatCard = ({ label, icon, tone, isLoading, value }: HeroStatCardProps) => (
  <Box
    sx={(theme) => ({
      p: 2,
      height: '100%',
      borderRadius: 2,
      border: `1px solid ${alpha(theme.palette[tone].main, 0.14)}`,
      bgcolor: alpha(theme.palette[tone].main, 0.05),
    })}
  >
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={(theme) => ({
            width: 34,
            height: 34,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette[tone].main, 0.16),
          })}
        >
          <IconifyIcon icon={icon} fontSize={18} sx={{ color: `${tone}.main` }} />
        </Box>
        <Typography variant="body1" fontWeight={500} noWrap color="inherit">
          {label}
        </Typography>
      </Stack>
      {isLoading ? <Skeleton variant="rounded" width="65%" height={32} /> : value}
    </Stack>
  </Box>
);

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState<{
    view: HistoryView;
    page: number;
  }>({
    defaults: {
      view: 'earns',
      page: 1,
    },
    schema: {
      view: {
        ...enumParam(['earns', 'spends'] as const),
        param: 'view',
      },
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
    },
    historyByKey: {
      view: 'push',
      page: 'push',
    },
    pageResetKeys: ['view'],
  });

  const { data: summary, isLoading: isSummaryLoading, mutate: reloadSummary } = useKepcoinSummary();
  const {
    data: earnHistory,
    isLoading: isEarnHistoryLoading,
    error: earnError,
    mutate: reloadEarn,
  } = useKepcoinEarnHistory(state.page, PAGE_SIZE, state.view === 'earns');
  const {
    data: spendHistory,
    isLoading: isSpendHistoryLoading,
    error: spendError,
    mutate: reloadSpend,
  } = useKepcoinSpendHistory(state.page, PAGE_SIZE, state.view === 'spends');

  const activeHistory = state.view === 'earns' ? earnHistory : spendHistory;
  const isHistoryLoading = state.view === 'earns' ? isEarnHistoryLoading : isSpendHistoryLoading;
  const historyError = state.view === 'earns' ? earnError : spendError;
  const retryHistory = state.view === 'earns' ? reloadEarn : reloadSpend;

  const handleViewChange = (_: unknown, nextView: HistoryView | null) => {
    if (!nextView || nextView === state.view) {
      return;
    }

    setField('view', nextView);
  };

  const handlePageChange = (_: unknown, nextPage: number) => {
    setField('page', nextPage);
  };

  const historyItems = activeHistory?.items ?? [];
  const pagesCount = activeHistory?.pagesCount ?? 1;
  const balance = summary?.balance ?? 0;

  const handlePurchaseStreakFreeze = async () => {
    await Promise.all([reloadSummary(), reloadSpend()]);
  };

  const freezePurchaseAction = (
    <KepcoinSpendConfirm
      value={STREAK_FREEZE_COST}
      purchaseUrl="/api/purchase-streak-freeze"
      onSuccess={handlePurchaseStreakFreeze}
      disabled={isSummaryLoading}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          minHeight: 40,
          px: 2.5,
          borderRadius: 1.5,
          fontWeight: 700,
          color: 'primary.contrastText',
          bgcolor: 'primary.main',
          textTransform: 'none',
          opacity: isSummaryLoading ? 0.5 : 1,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <Typography variant="button" color="inherit" sx={{ textTransform: 'none' }}>
          {t('kepcoinPage.streakFreeze.purchaseAction')}
        </Typography>
        <KepcoinValue
          value={STREAK_FREEZE_COST}
          iconSize={16}
          textVariant="body2"
          fontWeight={700}
          color="inherit"
        />
      </Stack>
    </KepcoinSpendConfirm>
  );

  return (
    <Stack direction="column" spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        title={t('kepcoinPage.hero.title')}
        sx={{ alignItems: { sm: 'center' } }}
        actionComponent={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          >
            <Button
              component={RouterLink}
              to={resources.KepcoinEarn}
              variant="contained"
              color="primary"
              sx={{ width: { xs: 1, sm: 'auto' } }}
            >
              {t('kepcoinPage.earnEntry.action')}
            </Button>
            <Button
              component={RouterLink}
              to={resources.Shop}
              variant="outlined"
              color="primary"
              sx={{ width: { xs: 1, sm: 'auto' } }}
            >
              {t('kepcoinPage.earnPage.openShop')}
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3, md: 5 }, pb: { xs: 4 }}}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ ...surfaceCardSx, height: 1 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2.25}>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <IconifyIcon icon="solar:wallet-money-line-duotone" fontSize={22} />
                  <Typography variant="body2" fontWeight={700} color="inherit">
                    {t('kepcoinSpend.balanceLabel')}
                  </Typography>
                </Stack>

                {isSummaryLoading ? (
                  <Skeleton variant="rounded" width={180} height={52} />
                ) : (
                  <KepcoinValue value={balance} iconSize={38} textVariant="h3" fontWeight={800} />
                )}

                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.hero.balanceCaption')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ ...surfaceCardSx, height: 1 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={(theme) => ({
                        width: 36,
                        height: 36,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                      })}
                    >
                      <IconifyIcon
                        icon="solar:snowflake-line-duotone"
                        fontSize={20}
                        sx={{ color: 'info.main' }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {t('kepcoinPage.hero.freezeTitle')}
                    </Typography>
                  </Stack>

                  {isSummaryLoading ? (
                    <Skeleton variant="rounded" width={56} height={28} />
                  ) : (
                    <Typography variant="h5" fontWeight={800}>
                      {summary?.streakFreeze ?? 0}
                    </Typography>
                  )}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.hero.freezeSubtitle')}
                </Typography>

                {freezePurchaseAction}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2} height={1}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <HeroStatCard
                label={t('kepcoinPage.hero.statLabels.streak')}
                icon="solar:flame-line-duotone"
                tone="warning"
                isLoading={isSummaryLoading}
                value={
                  <Streak
                    streak={summary?.streak}
                    maxStreak={summary?.maxStreak}
                    iconSize={24}
                    textVariant="h5"
                    fontWeight={800}
                  />
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <HeroStatCard
                label={t('kepcoinPage.hero.statLabels.maxStreak')}
                icon="solar:medal-star-line-duotone"
                tone="info"
                isLoading={isSummaryLoading}
                value={
                  <Streak
                    streak={summary?.maxStreak}
                    maxStreak={summary?.maxStreak}
                    iconSize={24}
                    textVariant="h5"
                    fontWeight={800}
                  />
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <HeroStatCard
                label={t('kepcoinPage.hero.statLabels.freeze')}
                icon="solar:snowflake-line-duotone"
                tone="info"
                isLoading={isSummaryLoading}
                value={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconifyIcon
                      icon="solar:snowflake-line-duotone"
                      fontSize={22}
                      sx={{ color: 'info.main' }}
                    />
                    <Typography variant="h5" fontWeight={800}>
                      {summary?.streakFreeze ?? 0}
                    </Typography>
                  </Stack>
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <KepcoinActivityWidget
            view={state.view}
            onViewChange={handleViewChange}
            isLoading={isHistoryLoading}
            error={historyError}
            historyItems={historyItems}
            pagesCount={pagesCount}
            page={state.page}
            onPageChange={handlePageChange}
            onRetry={retryHistory}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack direction="column" spacing={3}>
            <HowToSpendWidget balance={summary?.balance} />
            <HowToEarnWidget />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default KepcoinPage;
