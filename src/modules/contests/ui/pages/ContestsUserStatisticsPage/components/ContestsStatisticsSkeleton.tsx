import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import StatisticsBreakdown from 'shared/components/statistics/StatisticsBreakdown';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import {
  StatisticsMetricSkeleton,
  StatisticsRowsSkeleton,
  StatisticsSectionSkeleton,
} from 'shared/components/statistics/StatisticsSkeleton';

const ContestsStatisticsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={0} aria-busy="true" aria-label={t('common.loading')}>
      {['currentRating', 'bestRating', 'rank', 'totalContestants'].map((key, index) => (
        <Grid key={key} size={{ xs: 6, md: 3 }}>
          <StatisticsMetricSkeleton
            label={t(`contests.statistics.${key}`)}
            subtitle={index < 3}
            icon
          />
        </Grid>
      ))}
      <Grid size={12}>
        <StatisticsSectionSkeleton title={t('contests.statistics.ratingChangesHistory')} />
      </Grid>
      {['totalAttempts', 'totalAccepted', 'averageAttempts', 'singleAttempts'].map((key, index) => (
        <Grid key={`overview-${key}`} size={{ xs: 6, md: 3 }}>
          <StatisticsMetricSkeleton
            label={t(`contests.statistics.${key}`)}
            subtitle={index === 3}
            icon
          />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 8 }}>
        <StatisticsSectionSkeleton title={t('contests.statistics.attemptsTimeline')} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <StatisticsSectionSkeleton title={t('contests.statistics.languages')} />
      </Grid>
      {['verdictDistribution', 'tags', 'symbols'].map((key) => (
        <Grid key={key} size={{ xs: 12, md: 4 }}>
          <StatisticsSection title={t(`contests.statistics.${key}`)}>
            <StatisticsBreakdown loading label={t(`contests.statistics.${key}`)} items={[]} />
          </StatisticsSection>
        </Grid>
      ))}
      {['contestRanks', 'ratingChanges'].map((key) => (
        <Grid key={key} size={{ xs: 12, md: 6 }}>
          <StatisticsSectionSkeleton title={t(`contests.statistics.${key}`)} rows={2} />
        </Grid>
      ))}
      {['mostAttemptsProblem', 'fastestSolve', 'slowestSolve'].map((key) => (
        <Grid key={key} size={{ xs: 12, md: 4 }}>
          <StatisticsSectionSkeleton title={t(`contests.statistics.${key}`)} rows={1} />
        </Grid>
      ))}
      {['unsolvedProblems', 'topAttempts'].map((key) => (
        <Grid key={key} size={{ xs: 12, md: 6 }}>
          <StatisticsSectionSkeleton title={t(`contests.statistics.${key}`)} rows={5} />
        </Grid>
      ))}
      <Grid size={12}>
        <StatisticsSection title={t('contests.statistics.worthyOpponents')}>
          <Grid container spacing={2}>
            {[0, 1, 2].map((key) => (
              <Grid key={key} size={{ xs: 12, md: 4 }}>
                <StatisticsRowsSkeleton rows={6} />
              </Grid>
            ))}
          </Grid>
        </StatisticsSection>
      </Grid>
    </Grid>
  );
};
export default ContestsStatisticsSkeleton;
