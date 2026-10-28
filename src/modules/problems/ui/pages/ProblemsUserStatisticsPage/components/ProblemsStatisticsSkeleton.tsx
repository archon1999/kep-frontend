import { useTranslation } from 'react-i18next';
import { Grid, Skeleton } from '@mui/material';
import {
  StatisticsMetricSkeleton,
  StatisticsSectionSkeleton,
} from 'shared/components/statistics/StatisticsSkeleton';

const ProblemsStatisticsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={0} aria-busy="true" aria-label={t('common.loading')}>
      {['solved', 'rating', 'rank', 'singleAttempt'].map((key, index) => (
        <Grid key={key} size={{ xs: 6, md: 3 }}>
          <StatisticsMetricSkeleton
            label={t(`problems.statisticsPage.cards.${key}`)}
            subtitle={index !== 1}
            icon
          />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 8 }}>
        <StatisticsSectionSkeleton
          title={t('problems.statisticsPage.activity.title')}
          action={<Skeleton variant="rectangular" width={264} height={36} />}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <StatisticsSectionSkeleton
          title={t('problems.statisticsPage.profile.languages')}
          rows={4}
        />
      </Grid>
      <Grid size={12}>
        <StatisticsSectionSkeleton
          title={t('problems.statisticsPage.heatmap.title')}
          height={180}
          action={<Skeleton variant="rectangular" width={150} height={40} />}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <StatisticsSectionSkeleton title={t('problems.statisticsPage.difficulty.title')} rows={7} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <StatisticsSectionSkeleton
          title={t('problems.statisticsPage.profile.byCategoryAndTags')}
          rows={7}
        />
      </Grid>
      {['byWeekday', 'byMonth', 'byTime'].map((key) => (
        <Grid key={key} size={{ xs: 12, md: 4 }}>
          <StatisticsSectionSkeleton title={t(`common.statistics.${key}`)} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 6 }}>
        <StatisticsSectionSkeleton title={t('problems.statisticsPage.attempts.title')} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <StatisticsSectionSkeleton title={t('problems.statisticsPage.facts.title')} rows={6} />
      </Grid>
    </Grid>
  );
};
export default ProblemsStatisticsSkeleton;
