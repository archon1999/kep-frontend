import { useTranslation } from 'react-i18next';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import type { ChallengeUserStatistics } from 'modules/challenges/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset, statisticsPanelSx } from './statisticsStyles';

const StatisticsKpis = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 1 },
    normalizeSupportedLocale(i18n.language),
  );
  const { general, results, records } = statistics;
  const longest = records?.longestWinStreak;
  const kpis = [
    {
      title: t('challenges.statisticsPage.cards.totalChallenges'),
      value: general?.totalChallenges,
      icon: 'material-symbols:swords-rounded',
      color: 'primary',
      detail: general
        ? t('challenges.statisticsPage.cards.ratedSplit', {
            rated: number.format(general.ratedChallenges),
            unrated: number.format(general.unratedChallenges),
          })
        : '—',
    },
    {
      title: t('challenges.statisticsPage.winRate'),
      value: results ? `${number.format(results.winRate)}%` : undefined,
      icon: 'mdi:trophy-outline',
      color: 'warning',
      detail: results
        ? `${t('challenges.statisticsPage.results.win')}: ${number.format(results.wins)}`
        : '—',
    },
    {
      title: t('challenges.statisticsPage.questionsSolved'),
      value: results?.questionsSolved,
      icon: 'material-symbols:task-alt-rounded',
      color: 'success',
      detail: results
        ? `${t('challenges.statisticsPage.cards.solveRate')}: ${number.format(results.solveRate)}%`
        : '—',
    },
    {
      title: t('challenges.statisticsPage.records.longestWinStreak'),
      value: longest?.count,
      icon: 'material-symbols:local-fire-department-outline-rounded',
      color: 'info',
      detail: longest?.startAt
        ? `${formatDateTime(longest.startAt, 'compactDateNoComma')} – ${formatDateTime(longest.endAt, 'compactDateNoComma')}`
        : t('challenges.statisticsPage.noData'),
    },
  ];

  return (
    <Grid container sx={{ height: 1 }}>
      {kpis.map((kpi) => (
        <Grid key={kpi.title} size={{ xs: 6, md: 3, xl: 6 }}>
          <Paper component="section" sx={[statisticsPanelSx, { p: statisticsInset }]}>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.secondary',
                minHeight: { xs: '2.6em', sm: 'auto' },
              }}
            >
              {kpi.title}
            </Typography>
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                bgcolor: `${kpi.color}.lighter`,
                borderRadius: 2,
                mb: 1,
              }}
            >
              <IconifyIcon icon={kpi.icon} sx={{ fontSize: 32, color: `${kpi.color}.main` }} />
            </Avatar>
            <Typography variant="h4" component="p" sx={{ fontWeight: 500, mb: 3 }}>
              {typeof kpi.value === 'number' ? number.format(kpi.value) : (kpi.value ?? '—')}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {kpi.detail}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsKpis;
