import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import type { ChallengeUserStatistics } from 'modules/challenges/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';

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
    <Grid container spacing={0}>
      {kpis.map((kpi) => (
        <Grid key={kpi.title} size={{ xs: 6, md: 3 }}>
          <StatisticsMetric
            label={kpi.title}
            value={typeof kpi.value === 'number' ? number.format(kpi.value) : kpi.value}
            subtitle={kpi.detail}
            icon={<IconifyIcon icon={kpi.icon} fontSize={20} />}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsKpis;
