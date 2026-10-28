import { useTranslation } from 'react-i18next';
import { Box, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { statisticsHeadingSx, statisticsInset } from 'app/theme/styles/statistics';
import type { ChallengeUserStatistics } from 'modules/challenges/domain';
import StatisticsBreakdown from 'shared/components/statistics/StatisticsBreakdown';
import useChartPalette from 'shared/hooks/useChartPalette';
import { createNumberFormatter } from 'shared/lib/numberFormat';

const StatisticsResults = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const palette = useChartPalette();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.language);
  const percent = createNumberFormatter({ maximumFractionDigits: 1 }, i18n.language);
  const { general, results } = statistics;
  return (
    <Box component="section" sx={{ p: statisticsInset }}>
      <Typography component="h2" sx={[statisticsHeadingSx, { mb: 0.75 }]}>
        {t('challenges.statisticsPage.overview.results')}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {general
          ? t('challenges.statisticsPage.botSplit', {
              human: number.format(general.humanChallenges),
              bot: number.format(general.botChallenges),
            })
          : t('challenges.statisticsPage.noData')}
      </Typography>
      <StatisticsBreakdown
        label={t('challenges.statisticsPage.overview.results')}
        totalLabel={t('challenges.statisticsPage.challengesShort')}
        items={[
          {
            label: t('challenges.statisticsPage.results.win'),
            value: results?.wins ?? 0,
            color: palette.success.main,
          },
          {
            label: t('challenges.statisticsPage.results.draw'),
            value: results?.draws ?? 0,
            color: palette.text.disabled,
          },
          {
            label: t('challenges.statisticsPage.results.loss'),
            value: results?.losses ?? 0,
            color: palette.error.main,
          },
        ]}
      />
      {results && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={600}>
              {t('challenges.statisticsPage.questionsSolved')}
            </Typography>
            <Typography variant="metric" fontSize={20} color="success.main">
              {percent.format(results.solveRate)}%
            </Typography>
          </Stack>
          <Typography component="p" variant="metric" fontSize={26} sx={{ mt: 0.75, mb: 1.5 }}>
            {number.format(results.questionsSolved)}{' '}
            <Box component="span" sx={{ fontSize: 16, color: 'text.secondary' }}>
              / {number.format(results.questionsSeen)}
            </Box>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, results.solveRate))}
            aria-label={t('challenges.statisticsPage.cards.solveRate')}
            sx={{ height: 4, borderRadius: 0 }}
          />
        </>
      )}
      {general && (
        <Stack
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          sx={{ mt: 2 }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('challenges.statisticsPage.cards.ratedSplit', {
              rated: number.format(general.ratedChallenges),
              unrated: number.format(general.unratedChallenges),
            })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('challenges.statisticsPage.arenaChallenges', { count: general.arenaChallenges })}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};
export default StatisticsResults;
