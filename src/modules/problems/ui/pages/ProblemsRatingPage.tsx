import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Palette } from '@mui/material/styles';
import { GridSortModel } from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { useProblemsPeriodRating, useProblemsRating } from '../../application/queries';
import { difficultyOptions } from '../../config/difficulty';
import ProblemsRatingDataGrid from '../components/ProblemsRatingDataGrid';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import UserPopover from 'modules/users/ui/components/UserPopover';

const sortFieldMap: Record<string, string> = {
  rating: 'rating',
  solved: 'solved',
  beginner: 'beginner',
  basic: 'basic',
  normal: 'normal',
  medium: 'medium',
  advanced: 'advanced',
  hard: 'hard',
  extremal: 'extremal',
};

const ProblemsRatingPage = () => {
  const { t } = useTranslation();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (!currentSort) return '-rating';

    const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
    const orderingPrefix = currentSort.sort === 'desc' ? '-' : '';

    return `${orderingPrefix}${orderingField}`;
  }, [sortModel]);

  const {
    data: ratingPage,
    isLoading,
    isValidating,
  } = useProblemsRating({
    ordering,
    page,
    pageSize,
  });

  const rows = ratingPage?.data ?? [];
  const rowCount = ratingPage?.total ?? 0;

  const handleSortModelChange = (model: GridSortModel) => setSortModel(model.slice(0, 1));

  const labels = useMemo(
    () => ({
      rank: t('problems.rating.columns.rank'),
      user: t('problems.rating.columns.user'),
      rating: t('problems.rating.columns.rating'),
      solved: t('problems.rating.columns.solved'),
      difficulties: Object.fromEntries(
        difficultyOptions.map((option) => [option.key, t(option.label)]),
      ) as Record<(typeof difficultyOptions)[number]['key'], string>,
      emptyValue: t('problems.rating.emptyValue'),
    }),
    [t],
  );

  return (
    <Stack direction="column">
      <PageHeader
        title={t('problems.rating.title')}
        breadcrumb={[
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.rating.ordering.rating'), active: true },
        ]}
        actionComponent={
          <Button
            component={RouterLink}
            to={resources.ProblemsRatingHistory}
            variant="text"
            startIcon={<KepIcon name="ranking" fontSize={18} />}
          >
            {t('problems.ratingHistory.title')}
          </Button>
        }
      />

      {isLoading || isValidating ? <LinearProgress /> : null}
      <Stack direction="column" spacing={2} sx={responsivePagePaddingSx}>
        <ProblemsRatingDataGrid
          rows={rows}
          rowCount={rowCount}
          loading={isLoading || isValidating}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          labels={labels}
        />

        <PeriodRatings />
      </Stack>
    </Stack>
  );
};

type PeriodColor = keyof Pick<Palette, 'success' | 'info' | 'primary'>;

const periodConfigs: Array<{
  period: 'today' | 'week' | 'month';
  color: PeriodColor;
  icon: string;
}> = [
  { period: 'today', color: 'success', icon: 'mdi:calendar-today' },
  { period: 'week', color: 'info', icon: 'mdi:calendar-week' },
  { period: 'month', color: 'primary', icon: 'mdi:calendar-month' },
];

const PeriodRatings = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const today = useProblemsPeriodRating('today');
  const week = useProblemsPeriodRating('week');
  const month = useProblemsPeriodRating('month');

  const periodData = [
    { ...periodConfigs[0], hook: today },
    { ...periodConfigs[1], hook: week },
    { ...periodConfigs[2], hook: month },
  ];

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        {t('problems.rating.periodTitle')}
      </Typography>

      <Grid container spacing={2}>
        {periodData.map(({ period, color, icon, hook }) => {
          const items = hook.data ?? [];
          const isLoading = hook.isLoading;

          return (
            <Grid key={period} size={{ xs: 12, lg: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: `var(--mui-palette-${color}-main)`,
                  background: `linear-gradient(135deg, ${cssVarRgba(
                    theme.vars.palette[color].mainChannel,
                    0.12,
                  )}, ${cssVarRgba(theme.vars.palette[color].mainChannel, 0.05)})`,
                  width: '100%',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          backgroundColor: cssVarRgba(theme.vars.palette[color].mainChannel, 0.16),
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <IconifyIcon
                          icon={icon}
                          width={20}
                          height={20}
                          color={`var(--mui-palette-${color}-main)`}
                        />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {t(`problems.rating.period.${period}`)}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color={`var(--mui-palette-${color}-main)`}
                    >
                      {t('problems.rating.ordering.solved')}
                    </Typography>
                  </Stack>

                  {isLoading ? (
                    <Stack direction="column" spacing={1}>
                      {[0, 1, 2].map((skeleton) => (
                        <Skeleton key={skeleton} variant="rounded" height={52} />
                      ))}
                    </Stack>
                  ) : items.length ? (
                    <Stack direction="column" spacing={1}>
                      {items.map((item, index) => (
                        <Stack
                          key={`${period}-${item.username}-${index}`}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: cssVarRgba(
                              theme.vars.palette.background.elevation1Channel,
                              0.8,
                            ),
                            border: `1px solid ${cssVarRgba(theme.vars.palette[color].mainChannel, 0.18)}`,
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography variant="body2" fontWeight={800} color="text.primary">
                              #{index + 1}
                            </Typography>
                            <UserPopover username={item.username}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {item.ratingTitle ? (
                                  <ContestsRatingChip title={item.ratingTitle} imgSize={24} />
                                ) : null}
                                <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
                                  {item.username}
                                </Typography>
                              </Stack>
                            </UserPopover>
                          </Stack>
                          <Chip
                            size="small"
                            color={color}
                            label={item.solved ?? 0}
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.rating.periodEmpty')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default ProblemsRatingPage;
