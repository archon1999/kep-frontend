import { useTranslation } from 'react-i18next';
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { statisticsHeadingSx } from 'app/theme/styles/statistics';
import StatisticsBreakdown from 'shared/components/statistics/StatisticsBreakdown';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import {
  StatisticsChartSkeleton,
  StatisticsMetricSkeleton,
  StatisticsSectionSkeleton,
} from 'shared/components/statistics/StatisticsSkeleton';

const ChallengesStatisticsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={0} aria-busy="true" aria-label={t('common.loading')}>
      {['cards.totalChallenges', 'winRate', 'questionsSolved', 'records.longestWinStreak'].map(
        (key) => (
          <Grid key={key} size={{ xs: 6, md: 3 }}>
            <StatisticsMetricSkeleton label={t(`challenges.statisticsPage.${key}`)} subtitle icon />
          </Grid>
        ),
      )}
      <Grid size={{ xs: 12, lg: 7 }}>
        <StatisticsSection>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{ mb: 2 }}
          >
            <Typography component="h2" sx={statisticsHeadingSx}>
              {t('challenges.statisticsPage.ratingHistory')}
            </Typography>
            <TextField
              select
              disabled
              size="small"
              value="all"
              sx={{ minWidth: { xs: 128, sm: 168 }, '& .MuiInputBase-root': { fontSize: 14 } }}
              slotProps={{
                htmlInput: { 'aria-label': t('challenges.statisticsPage.ratingHistory') },
              }}
            >
              <MenuItem value="all">{t('challenges.statisticsPage.rating.all')}</MenuItem>
            </TextField>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            gap={2.5}
            sx={{ mb: 3 }}
          >
            <Box>
              <Skeleton width={110} height={38} />
              <Skeleton width={130} height={21} sx={{ mt: 1 }} />
            </Box>
            <Stack direction="row" gap={{ xs: 3, sm: 4 }}>
              {['overview.bestRating', 'lowestRating'].map((key) => (
                <Box key={key}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t(`challenges.statisticsPage.${key}`)}
                  </Typography>
                  <Skeleton width={90} height={32} sx={{ mt: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    <Skeleton
                      width={85}
                      sx={{ height: '1em', display: 'inline-block', verticalAlign: 'middle' }}
                    />
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
          <StatisticsChartSkeleton />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            gap={1}
            sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <Skeleton width={130} height={18} />
            <Skeleton width={170} height={18} />
          </Stack>
        </StatisticsSection>
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <StatisticsSection>
          <Typography component="h2" sx={[statisticsHeadingSx, { mb: 0.75 }]}>
            {t('challenges.statisticsPage.overview.results')}
          </Typography>
          <Skeleton width="80%" height={18} sx={{ mb: 2 }} />
          <StatisticsBreakdown
            loading
            label={t('challenges.statisticsPage.overview.results')}
            items={[]}
          />
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Skeleton width={110} height={21} />
            <Skeleton width={48} height={24} />
          </Stack>
          <Skeleton width={150} height={31} sx={{ mt: 0.75, mb: 1.5 }} />
          <Skeleton variant="rectangular" height={4} />
          <Stack
            direction="row"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Skeleton width={120} height={18} />
            <Skeleton width={100} height={18} />
          </Stack>
        </StatisticsSection>
      </Grid>
      <Grid size={12}>
        <StatisticsSectionSkeleton title={t('challenges.lastChallenges')} rows={5} />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <StatisticsSectionSkeleton
          title={t('challenges.statisticsPage.activity.title')}
          height={400}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <StatisticsSectionSkeleton
          title={t('challenges.statisticsPage.details.records')}
          rows={6}
        />
      </Grid>
      {[
        ['knowledge.difficulty', 5],
        ['knowledge.questionTypes', 7],
        ['knowledge.topChapters', 7],
        ['history.format', 5],
      ].map(([key, columns]) => (
        <Grid key={key} size={{ xs: 12, lg: Number(columns) }}>
          <StatisticsSectionSkeleton title={t(`challenges.statisticsPage.${key}`)} rows={5} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, lg: 5 }}>
        <StatisticsSectionSkeleton
          title={t('challenges.statisticsPage.opponents.summary')}
          rows={3}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <StatisticsSectionSkeleton
          title={t('challenges.statisticsPage.opponents.mostPlayed')}
          rows={5}
        />
      </Grid>
    </Grid>
  );
};
export default ChallengesStatisticsSkeleton;
