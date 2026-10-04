import { useTranslation } from 'react-i18next';
import { Box, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { ChallengeUserStatistics } from 'modules/challenges/domain';
import ReactEchart from 'shared/components/base/ReactEchart';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset } from './statisticsStyles';

echarts.use([PieChart, TooltipComponent, CanvasRenderer]);

const StatisticsResults = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const scheme = mode === 'dark' || (mode === 'system' && systemMode === 'dark') ? 'dark' : 'light';
  const palette = theme.colorSchemes[scheme]?.palette ?? theme.palette;
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );
  const percent = createNumberFormatter(
    { maximumFractionDigits: 1 },
    normalizeSupportedLocale(i18n.language),
  );
  const { general, results } = statistics;
  const rows = [
    { key: 'win', value: results?.wins ?? 0, color: palette.success.main },
    { key: 'draw', value: results?.draws ?? 0, color: palette.grey[400] },
    { key: 'loss', value: results?.losses ?? 0, color: palette.error.main },
  ];
  const options = {
    textStyle: { fontFamily: theme.typography.fontFamily },
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: palette.background.paper,
      borderColor: palette.divider,
      textStyle: { color: palette.text.primary },
    },
    series: [
      {
        name: t('challenges.statisticsPage.overview.results'),
        type: 'pie',
        radius: ['55%', '85%'],
        padAngle: 2,
        itemStyle: { borderRadius: 4 },
        emphasis: { scaleSize: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: rows.map((row) => ({
          name: t('challenges.statisticsPage.results.' + row.key),
          value: row.value,
          itemStyle: { color: row.color },
        })),
      },
    ],
  };

  return (
    <Box component="section" sx={{ p: statisticsInset, fontVariantNumeric: 'tabular-nums' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
        {t('challenges.statisticsPage.overview.results')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {general
          ? t('challenges.statisticsPage.botSplit', {
              human: number.format(general.humanChallenges),
              bot: number.format(general.botChallenges),
            })
          : t('challenges.statisticsPage.noData')}
      </Typography>
      {results ? (
        <>
          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            gap={4}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="column" gap={2.5} sx={{ width: { xs: 1, sm: 160 }, flexShrink: 0 }}>
              {rows.map((row) => (
                <Box key={row.key} sx={{ pl: 2, borderLeft: '4px solid', borderColor: row.color }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    gap={2}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.statisticsPage.results.' + row.key)}
                    </Typography>
                    <Typography variant="h5" component="span" fontWeight={500}>
                      {number.format(row.value)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Box sx={{ position: 'relative', minWidth: 0, width: 1, flex: 1 }}>
              <ReactEchart echarts={echarts} option={options} style={{ height: 230 }} />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="p" fontWeight={500}>
                  {number.format(
                    general?.totalChallenges ?? rows.reduce((sum, row) => sum + row.value, 0),
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('challenges.statisticsPage.challengesShort')}
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('challenges.statisticsPage.questionsSolved')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {percent.format(results.solveRate)}%
            </Typography>
          </Stack>
          <Typography variant="h5" component="p" fontWeight={500} sx={{ mt: 1, mb: 2 }}>
            {number.format(results.questionsSolved)}{' '}
            <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>
              / {number.format(results.questionsSeen)}
            </Box>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, results.solveRate))}
            aria-label={t('challenges.statisticsPage.cards.solveRate')}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('challenges.statisticsPage.noData')}
        </Typography>
      )}
      {general && (
        <Stack
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={{ mt: 3 }}
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
