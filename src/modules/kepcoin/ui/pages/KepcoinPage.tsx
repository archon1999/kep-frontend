import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Logo from 'shared/components/common/Logo';
import Streak from 'shared/components/rating/Streak';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from '../../application/queries';
import { HistoryView } from '../types';
import HowToEarnWidget from '../widgets/HowToEarnWidget';
import HowToSpendWidget from '../widgets/HowToSpendWidget';
import KepcoinActivityWidget from '../widgets/KepcoinActivityWidget';

const PAGE_SIZE = 10;
const STREAK_FREEZE_COST = 10;

const getHeroPanelSx = (theme: Theme) => ({
  borderRadius: 4,
  color: theme.vars.palette.text.primary,
  border: `1px solid ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.08)}`,
  bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.42),
  backdropFilter: 'blur(16px)',
  boxShadow: `inset 0 1px 0 ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.24)}`,
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.common.white,
    border: `1px solid ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.1)}`,
    bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.06),
    boxShadow: `inset 0 1px 0 ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08)}`,
  }),
});

const getHeroSkeletonSx = (theme: Theme) => ({
  bgcolor: cssVarRgba(theme.vars.palette.common.blackChannel, 0.08),
  ...theme.applyStyles('dark', {
    bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.12),
  }),
});

const getHeroCaptionSx = (theme: Theme) => ({
  color: theme.vars.palette.text.secondary,
  ...theme.applyStyles('dark', {
    color: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.78),
  }),
});

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
      ...getHeroPanelSx(theme),
      p: 2,
      height: '100%',
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
      {isLoading ? (
        <Skeleton
          variant="rounded"
          width="65%"
          height={32}
          sx={getHeroSkeletonSx}
        />
      ) : (
        value
      )}
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
  const isHistoryLoading =
    state.view === 'earns' ? isEarnHistoryLoading : isSpendHistoryLoading;
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
      <Button
        size="large"
        variant="contained"
        disabled={isSummaryLoading}
        sx={{
          minHeight: 48,
          px: 2.5,
          borderRadius: 999,
          fontWeight: 700,
          color: '#fff8eb',
          bgcolor: '#3f2d18',
          boxShadow: '0 18px 36px rgba(63, 45, 24, 0.18)',
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#2f2112',
            boxShadow: '0 18px 36px rgba(63, 45, 24, 0.24)',
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
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
      </Button>
    </KepcoinSpendConfirm>
  );

  return (
    <Grid sx={responsivePagePaddingSx} size={12} container spacing={3}>
      <Grid size={12}>
        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 6,
            color: theme.vars.palette.text.primary,
            border: `1px solid ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.06)}`,
            background: 'linear-gradient(135deg, #f6ebd7 0%, #e6d2a5 58%, #d7ad56 100%)',
            boxShadow: theme.shadows[10],
            ...theme.applyStyles('dark', {
              color: theme.vars.palette.common.white,
              border: `1px solid ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08)}`,
              background: 'linear-gradient(135deg, #17120d 0%, #261b10 48%, #5b4013 100%)',
            }),
          })}
        >
          <Box sx={{ position: 'absolute', inset: 0 }} />
          <Box
            sx={(theme) => ({
              position: 'absolute',
              right: -80,
              top: -120,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(135, 147, 111, 0.22) 0%, rgba(135, 147, 111, 0) 74%)',
              ...theme.applyStyles('dark', {
                background:
                  'radial-gradient(circle, rgba(214, 163, 72, 0.22) 0%, rgba(214, 163, 72, 0) 74%)',
              }),
            })}
          />
          <Box
            sx={(theme) => ({
              position: 'absolute',
              right: { xs: -24, md: 28 },
              bottom: { xs: -36, md: -10 },
              opacity: 0.08,
              pointerEvents: 'none',
              ...theme.applyStyles('dark', {
                opacity: 0.05,
              }),
            })}
          >
            <Logo sx={{ width: { xs: 180, md: 240 }, height: { xs: 180, md: 240 } }} />
          </Box>
          <CardContent
            sx={{ ...responsivePagePaddingSx, py: { xs: 4, md: 5 }, position: 'relative' }}
          >
            <Grid container spacing={3} alignItems="stretch">
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack spacing={3}>
                  <Stack spacing={1.25}>
                    <Typography variant="h2" fontWeight={900} lineHeight={1.05} maxWidth={560}>
                      {t('kepcoinPage.hero.title')}
                    </Typography>
                  </Stack>

                  <Stack spacing={1}>
                    {isSummaryLoading ? (
                      <Skeleton
                        variant="rounded"
                        width={220}
                        height={54}
                        sx={getHeroSkeletonSx}
                      />
                    ) : (
                      <KepcoinValue
                        value={balance}
                        iconSize={42}
                        textVariant="h2"
                        fontWeight={900}
                        color="inherit"
                      />
                    )}
                    <Typography
                      variant="body1"
                      sx={getHeroCaptionSx}
                    >
                      {t('kepcoinPage.hero.balanceCaption')}
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      component={RouterLink}
                      to={resources.KepcoinEarn}
                      variant="contained"
                      size="large"
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                        borderRadius: 999,
                        fontWeight: 700,
                        color: '#fff8eb',
                        bgcolor: '#3f2d18',
                        boxShadow: '0 18px 36px rgba(63, 45, 24, 0.18)',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#2f2112',
                          boxShadow: '0 18px 36px rgba(63, 45, 24, 0.24)',
                        },
                      }}
                    >
                      {t('kepcoinPage.earnEntry.action')}
                    </Button>
                    <Button
                      component={RouterLink}
                      to={resources.Shop}
                      variant="outlined"
                      size="large"
                      sx={(theme) => ({
                        minHeight: 48,
                        px: 2.5,
                        borderRadius: 999,
                        fontWeight: 700,
                        color: 'inherit',
                        borderColor: cssVarRgba(theme.vars.palette.common.blackChannel, 0.16),
                        bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.28),
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: cssVarRgba(theme.vars.palette.common.blackChannel, 0.28),
                          bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.38),
                        },
                        ...theme.applyStyles('dark', {
                          borderColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.18),
                          bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08),
                          '&:hover': {
                            borderColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.28),
                            bgcolor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.14),
                          },
                        }),
                      })}
                    >
                      {t('kepcoinPage.earnPage.openShop')}
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Stack spacing={2} height="100%">
                  <Box
                    sx={(theme) => ({
                      ...getHeroPanelSx(theme),
                      p: 2.5,
                      color: 'inherit',
                    })}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight={800}>
                          {t('kepcoinPage.hero.freezeTitle')}
                        </Typography>
                        {isSummaryLoading ? (
                          <Skeleton
                            variant="rounded"
                            width={74}
                            height={28}
                            sx={getHeroSkeletonSx}
                          />
                        ) : (
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <IconifyIcon
                              icon="solar:snowflake-line-duotone"
                              fontSize={22}
                              sx={{ color: 'info.main' }}
                            />
                            <Typography variant="h5" fontWeight={800} color="inherit">
                              {summary?.streakFreeze ?? 0}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={getHeroCaptionSx}
                      >
                        {t('kepcoinPage.hero.freezeSubtitle')}
                      </Typography>

                      {freezePurchaseAction}
                    </Stack>
                  </Box>

                  <Grid container spacing={2}>
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
                            iconSize={26}
                            textVariant="h5"
                            fontWeight={800}
                            color="inherit"
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
                            iconSize={26}
                            textVariant="h5"
                            fontWeight={800}
                            color="inherit"
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
                              fontSize={24}
                              sx={{ color: 'info.main' }}
                            />
                            <Typography variant="h5" fontWeight={800} color="inherit">
                              {summary?.streakFreeze ?? 0}
                            </Typography>
                          </Stack>
                        }
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
  );
};

export default KepcoinPage;
