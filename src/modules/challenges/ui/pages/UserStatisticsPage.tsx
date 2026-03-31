import { useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  LinearProgress,
  Pagination,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { BarChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources';
import ReactEchart from 'shared/components/base/ReactEchart.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { getColor } from 'shared/lib/echart-utils';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useChallengeUserStatistics, useUserChallenges } from '../../application/queries.ts';
import type {
  ChallengeStatisticsChapterRow,
  ChallengeStatisticsMatchRecord,
  ChallengeStatisticsOpponentRow,
  ChallengeUserStatistics,
} from '../../domain';
import { ChallengeQuestionTimeType } from '../../domain';
import ChallengeCard from '../components/ChallengeCard.tsx';

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  HeatmapChart,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer,
]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();
const toPercent = (value?: number) => `${Math.round(value ?? 0)}%`;

const OverviewCard = ({
  label,
  value,
  subtitle,
  tone,
}: {
  label: string;
  value: string;
  subtitle?: string;
  tone?: 'success' | 'error' | 'primary';
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={900}
          color={
            tone === 'success'
              ? 'success.main'
              : tone === 'error'
                ? 'error.main'
                : tone === 'primary'
                  ? 'primary.main'
                  : 'text.primary'
          }
        >
          {value}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

const ChartCard = ({
  title,
  option,
  height = 320,
  emptyText,
  extra,
  onEvents,
}: {
  title: string;
  option: EChartsCoreOption | null;
  height?: number;
  emptyText: string;
  extra?: any;
  onEvents?: Record<string, (params?: any) => void>;
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent sx={{ height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {extra}
        </Stack>
        {option ? (
          <ReactEchart echarts={echarts} option={option} style={{ width: '100%', height }} onEvents={onEvents} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

const RecordCard = ({
  title,
  value,
  subtitle,
  href,
  tone,
}: {
  title: string;
  value: string;
  subtitle?: string;
  href?: string;
  tone?: 'success' | 'error';
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          color={tone === 'success' ? 'success.main' : tone === 'error' ? 'error.main' : 'text.primary'}
        >
          {value}
        </Typography>
        {subtitle ? (
          href ? (
            <Button component={RouterLink} to={href} size="small" variant="text" sx={{ px: 0, justifyContent: 'flex-start' }}>
              {subtitle}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

const buildYears = (statistics?: ChallengeUserStatistics | null) => {
  const years = new Set<number>();
  (statistics?.activity?.heatmap ?? []).forEach((entry) => {
    if (entry.date) years.add(dayjs(entry.date).year());
  });
  return Array.from(years).sort((a, b) => b - a);
};

const withPadding = (series: number[]): [number, number] => {
  if (!series.length) return [0, 0];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const padding = Math.max(4, range * 0.1);
  return [Math.floor(min - padding), Math.ceil(max + padding)];
};

const getResultColor = (result: string) => {
  if (result === 'win') return 'success.main';
  if (result === 'loss') return 'error.main';
  return 'text.secondary';
};

const getDifficultyLabel = (difficulty: number, t: ReturnType<typeof useTranslation>['t']) => {
  if (difficulty === 1) return t('challenges.statisticsPage.difficulty.easy', { defaultValue: 'Easy' });
  if (difficulty === 2) return t('challenges.statisticsPage.difficulty.medium', { defaultValue: 'Medium' });
  if (difficulty === 3) return t('challenges.statisticsPage.difficulty.hard', { defaultValue: 'Hard' });
  return t('challenges.statisticsPage.unknown', { defaultValue: 'Unknown' });
};

const getQuestionTypeLabel = (questionType: number, t: ReturnType<typeof useTranslation>['t']) => {
  switch (questionType) {
    case 1:
      return t('challenges.statisticsPage.questionTypes.singleChoice', { defaultValue: 'Single choice' });
    case 2:
      return t('challenges.statisticsPage.questionTypes.multipleChoice', { defaultValue: 'Multiple choice' });
    case 3:
      return t('challenges.statisticsPage.questionTypes.textInput', { defaultValue: 'Text input' });
    case 4:
      return t('challenges.statisticsPage.questionTypes.conformity', { defaultValue: 'Conformity' });
    case 5:
      return t('challenges.statisticsPage.questionTypes.ordering', { defaultValue: 'Ordering' });
    case 6:
      return t('challenges.statisticsPage.questionTypes.classification', { defaultValue: 'Classification' });
    case 7:
      return t('challenges.statisticsPage.questionTypes.codeInput', { defaultValue: 'Custom checker' });
    case 8:
      return t('challenges.statisticsPage.questionTypes.problem', { defaultValue: 'Coding problem' });
    default:
      return t('challenges.statisticsPage.unknown', { defaultValue: 'Unknown' });
  }
};

const getBucketLabel = (bucket: string | undefined, t: ReturnType<typeof useTranslation>['t']) => {
  if (bucket === 'higher') return t('challenges.statisticsPage.buckets.higher', { defaultValue: 'Higher rated' });
  if (bucket === 'same') return t('challenges.statisticsPage.buckets.same', { defaultValue: 'Same rated' });
  if (bucket === 'lower') return t('challenges.statisticsPage.buckets.lower', { defaultValue: 'Lower rated' });
  return t('challenges.statisticsPage.unknown', { defaultValue: 'Unknown' });
};

type ChallengeStatisticsRecordEntry =
  | NonNullable<NonNullable<ChallengeUserStatistics['records']>['biggestGain']>
  | NonNullable<NonNullable<ChallengeUserStatistics['records']>['bestVictory']>;

const formatDateTimeSafe = (value?: string | null) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-');
const formatScoreSafe = (entry?: { userScore?: number; opponentScore?: number } | null) =>
  entry ? `${entry.userScore ?? 0}:${entry.opponentScore ?? 0}` : '-';

const renderRecordListSafe = (items: ChallengeStatisticsMatchRecord[], emptyText: string) => {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return items.map((item) => (
    <Stack
      key={`${item.challengeId}-${item.opponentUsername}`}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}
    >
      <Stack spacing={0.5} minWidth={0}>
        <Typography variant="subtitle2" color={getResultColor(item.result)}>
          {item.opponentUsername} ({Math.round(item.opponentRating)})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatScoreSafe(item)} | {formatDateTimeSafe(item.finishedAt)}
        </Typography>
      </Stack>
      <Button
        component={RouterLink}
        to={getResourceById(resources.Challenge, item.challengeId)}
        size="small"
        variant="text"
        sx={{ px: 0, flexShrink: 0 }}
      >
        Open
      </Button>
    </Stack>
  ));
};

const renderOpponentListSafe = (items: ChallengeStatisticsOpponentRow[], emptyText: string) => {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return items.map((item) => (
    <Stack key={item.username} spacing={0.5} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">{item.username}</Typography>
        <Chip label={`${item.wins}-${item.draws}-${item.losses}`} size="small" variant="soft" color="primary" />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {item.count} matches | avg {Math.round(item.averageOpponentRating)} | {formatDateTimeSafe(item.lastPlayedAt)}
      </Typography>
    </Stack>
  ));
};

const getRecordValue = (entry?: ChallengeStatisticsRecordEntry | null) => {
  if (!entry) return '-';
  if (!('userScore' in entry)) {
    return `${entry.delta > 0 ? '+' : ''}${entry.delta}`;
  }
  return `${entry.opponentUsername} (${Math.round(entry.opponentRating)})`;
};

const getRecordSubtitle = (entry?: ChallengeStatisticsRecordEntry | null) => {
  if (!entry) return null;
  if ('userScore' in entry) {
    return `${formatScoreSafe(entry)} | ${formatDateTimeSafe(entry.finishedAt)}`;
  }
  return `${entry.opponentUsername} | ${formatDateTimeSafe(entry.finishedAt)}`;
};

const getStreakSubtitle = (startAt?: string | null, endAt?: string | null) =>
  `${formatDateTimeSafe(startAt)} - ${formatDateTimeSafe(endAt)}`;

const buildWinRateOption = (
  items: { label: string; winRate: number; count: number }[],
  color: string,
  axisLabelColor: string,
  dividerColor: string,
  t: ReturnType<typeof useTranslation>['t'],
): EChartsCoreOption | null => {
  if (!items.length) return null;

  return {
    color: [color],
    grid: { left: 8, right: 8, top: 12, bottom: 12, containLabel: true },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params?.[0];
        if (!point) return '';
        const item = items[point.dataIndex];
        return `${item.label}<br/>${t('challenges.statisticsPage.winRate', { defaultValue: 'Win rate' })}: ${toPercent(item.winRate)}<br/>${t('challenges.statisticsPage.challengesShort', { defaultValue: 'Challenges' })}: ${item.count}`;
      },
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: axisLabelColor, formatter: '{value}%' },
      splitLine: { lineStyle: { color: dividerColor } },
    },
    yAxis: {
      type: 'category',
      data: items.map((item) => item.label),
      axisLabel: { color: axisLabelColor },
    },
    series: [{ type: 'bar', itemStyle: { borderRadius: 6 }, data: items.map((item) => item.winRate) }],
  } satisfies EChartsCoreOption;
};

const UserStatisticsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const username = currentUser?.username;
  const { state, setField } = useRouteQueryState<{
    page: number;
    selectedYear?: number;
  }>({
    defaults: {
      page: 1,
      selectedYear: undefined,
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
      selectedYear: {
        ...numberParam(),
        param: 'year',
      },
    },
    historyByKey: {
      page: 'push',
    },
  });
  const pageSize = 10;

  const { data: statistics, isLoading: isStatisticsLoading } = useChallengeUserStatistics(username);
  const { data: lastChallenges, isLoading: isChallengesLoading } = useUserChallenges({
    username: username ?? '',
    page: state.page,
    pageSize,
  });

  const availableYears = useMemo(() => buildYears(statistics), [statistics]);
  const activeYear = state.selectedYear ?? availableYears[0];
  const primaryColor = getColor(theme.vars.palette.primary.main);
  const successColor = getColor(theme.vars.palette.success.main);
  const errorColor = getColor(theme.vars.palette.error.main);
  const warningColor = getColor(theme.vars.palette.warning.main);
  const infoColor = getColor(theme.vars.palette.info.main);
  const neutralColor = getColor(theme.vars.palette.text.disabled);
  const axisLabelColor = getColor(theme.vars.palette.text.secondary);
  const dividerColor = getColor(theme.vars.palette.divider);

  const ratingHistory = useMemo(
    () =>
      [...(statistics?.ratingHistory ?? [])].sort(
        (a, b) => dayjs(a.finishedAt ?? 0).valueOf() - dayjs(b.finishedAt ?? 0).valueOf(),
      ),
    [statistics?.ratingHistory],
  );

  const ratingChartOption = useMemo(() => {
    if (!ratingHistory.length) return null;
    const values = ratingHistory.map((item) => item.ratingAfter);
    const [min, max] = withPadding(values);

    return {
      color: [primaryColor],
      grid: { left: 8, right: 8, top: 16, bottom: 12, containLabel: true },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params?.[0]?.data;
          if (!point) return '';
          return [
            `<strong>${dayjs(point.finishedAt).format('YYYY-MM-DD HH:mm')}</strong>`,
            `${t('challenges.statisticsPage.opponent', { defaultValue: 'Opponent' })}: ${point.opponentUsername} (${point.opponentRating})`,
            `${t('challenges.statisticsPage.ratingAfter', { defaultValue: 'Rating' })}: ${point.value}`,
            `${t('challenges.statisticsPage.deltaShort', { defaultValue: 'Delta' })}: ${point.delta > 0 ? '+' : ''}${point.delta}`,
            `${t('challenges.statisticsPage.score', { defaultValue: 'Score' })}: ${point.userScore}:${point.opponentScore}`,
          ].join('<br/>');
        },
      },
      xAxis: {
        type: 'category',
        data: ratingHistory.map((item) => dayjs(item.finishedAt).format('DD MMM')),
        axisLabel: { color: axisLabelColor },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: neutralColor } },
      },
      yAxis: {
        type: 'value',
        min,
        max,
        minInterval: 1,
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.18 },
          showSymbol: true,
          symbolSize: 8,
          lineStyle: { width: 3 },
          data: ratingHistory.map((item) => ({
            value: item.ratingAfter,
            finishedAt: item.finishedAt,
            delta: item.delta,
            opponentUsername: item.opponentUsername,
            opponentRating: item.opponentRating,
            userScore: item.userScore,
            opponentScore: item.opponentScore,
            challengeId: item.challengeId,
          })),
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, dividerColor, neutralColor, primaryColor, ratingHistory, t]);

  const resultsDonutOption = useMemo(() => {
    const results = statistics?.results;
    if (!results) return null;
    return {
      color: [successColor, infoColor, errorColor],
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: axisLabelColor } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['36%', '50%'],
          itemStyle: {
            borderRadius: 6,
            borderColor: getColor(theme.vars.palette.background.paper),
            borderWidth: 2,
          },
          label: { show: false },
          labelLine: { show: false },
          data: [
            { name: t('challenges.statisticsPage.results.win', { defaultValue: 'Wins' }), value: results.wins },
            { name: t('challenges.statisticsPage.results.draw', { defaultValue: 'Draws' }), value: results.draws },
            { name: t('challenges.statisticsPage.results.loss', { defaultValue: 'Losses' }), value: results.losses },
          ],
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, errorColor, infoColor, statistics?.results, successColor, t, theme.vars.palette.background.paper]);

  const ratingBucketOption = useMemo(() => {
    const opponents = statistics?.opponents;
    if (!opponents) return null;
    return {
      color: [primaryColor],
      grid: { left: 8, right: 16, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        axisLabel: { color: axisLabelColor },
        axisTick: { show: false },
        axisLine: { show: false },
        data: [
          t('challenges.statisticsPage.buckets.higher', { defaultValue: 'Higher rated' }),
          t('challenges.statisticsPage.buckets.same', { defaultValue: 'Same rated' }),
          t('challenges.statisticsPage.buckets.lower', { defaultValue: 'Lower rated' }),
        ],
      },
      series: [
        {
          type: 'bar',
          itemStyle: { borderRadius: 6 },
          data: [opponents.vsHigherRated.count, opponents.vsSameRated.count, opponents.vsLowerRated.count],
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, dividerColor, primaryColor, statistics?.opponents, t]);

  const activityOption = useMemo(() => {
    const activity = statistics?.activity?.last30Days ?? [];
    if (!activity.length) return null;
    return {
      color: [primaryColor],
      grid: { left: 8, right: 8, top: 16, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: activity.map((item) => dayjs(item.date).format('DD MMM')),
        axisLabel: { color: axisLabelColor, interval: 4 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: neutralColor } },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
      },
      series: [{ type: 'line', smooth: true, areaStyle: { opacity: 0.16 }, data: activity.map((item) => item.count) }],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, dividerColor, neutralColor, primaryColor, statistics?.activity?.last30Days]);

  const weekdayOption = useMemo(() => {
    const buckets = statistics?.activity?.byWeekday ?? [];
    if (!buckets.length) return null;
    return {
      color: [infoColor],
      grid: { left: 8, right: 8, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
      },
      yAxis: {
        type: 'category',
        axisLabel: { color: axisLabelColor },
        data: [
          t('challenges.statisticsPage.weekday.mon', { defaultValue: 'Mon' }),
          t('challenges.statisticsPage.weekday.tue', { defaultValue: 'Tue' }),
          t('challenges.statisticsPage.weekday.wed', { defaultValue: 'Wed' }),
          t('challenges.statisticsPage.weekday.thu', { defaultValue: 'Thu' }),
          t('challenges.statisticsPage.weekday.fri', { defaultValue: 'Fri' }),
          t('challenges.statisticsPage.weekday.sat', { defaultValue: 'Sat' }),
          t('challenges.statisticsPage.weekday.sun', { defaultValue: 'Sun' }),
        ],
      },
      series: [{ type: 'bar', itemStyle: { borderRadius: 6 }, data: buckets.map((item) => item.count) }],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, dividerColor, infoColor, statistics?.activity?.byWeekday, t]);

  const hourOption = useMemo(() => {
    const buckets = statistics?.activity?.byHour ?? [];
    if (!buckets.length) return null;
    return {
      color: [warningColor],
      grid: { left: 8, right: 8, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: buckets.map((item) => `${String(item.hour).padStart(2, '0')}:00`),
        axisLabel: { color: axisLabelColor, interval: 3, rotate: 30 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: neutralColor } },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
      },
      series: [{ type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0] }, data: buckets.map((item) => item.count) }],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, dividerColor, neutralColor, statistics?.activity?.byHour, warningColor]);

  const heatmapOption = useMemo(() => {
    const entries = (statistics?.activity?.heatmap ?? []).filter((item) => activeYear && dayjs(item.date).year() === activeYear);
    if (!entries.length || !activeYear) return null;
    const weekdayLabels = [
      t('challenges.statisticsPage.weekday.mon', { defaultValue: 'Mon' }),
      t('challenges.statisticsPage.weekday.tue', { defaultValue: 'Tue' }),
      t('challenges.statisticsPage.weekday.wed', { defaultValue: 'Wed' }),
      t('challenges.statisticsPage.weekday.thu', { defaultValue: 'Thu' }),
      t('challenges.statisticsPage.weekday.fri', { defaultValue: 'Fri' }),
      t('challenges.statisticsPage.weekday.sat', { defaultValue: 'Sat' }),
      t('challenges.statisticsPage.weekday.sun', { defaultValue: 'Sun' }),
    ];
    const data = entries.map((item) => {
      const date = dayjs(item.date);
      return [date.valueOf(), date.day() === 0 ? 6 : date.day() - 1, item.count];
    });
    const maxValue = Math.max(...entries.map((item) => item.count), 1);

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => `${dayjs(params?.value?.[0]).format('YYYY-MM-DD')}: ${params?.value?.[2] ?? 0}`,
      },
      grid: { left: 16, right: 16, top: 12, bottom: 42 },
      xAxis: {
        type: 'time',
        splitNumber: 12,
        axisLabel: { formatter: '{MMM}', color: axisLabelColor },
        axisLine: { lineStyle: { color: neutralColor } },
      },
      yAxis: { type: 'category', data: weekdayLabels, axisLabel: { color: axisLabelColor } },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: [
            getColor(theme.vars.palette.background.paper),
            getColor(theme.vars.palette.primary.light),
            getColor(theme.vars.palette.primary.main),
          ],
        },
      },
      series: [{ type: 'heatmap', data }],
    } satisfies EChartsCoreOption;
  }, [activeYear, axisLabelColor, neutralColor, statistics?.activity?.heatmap, t, theme.vars.palette.background.paper, theme.vars.palette.primary.light, theme.vars.palette.primary.main]);

  const timeControlOption = useMemo(
    () =>
      buildWinRateOption(
        (statistics?.formats?.byTimeControl ?? []).map((item) => ({ label: item.label, winRate: item.winRate, count: item.count })),
        primaryColor,
        axisLabelColor,
        dividerColor,
        t,
      ),
    [axisLabelColor, dividerColor, primaryColor, statistics?.formats?.byTimeControl, t],
  );

  const questionTimeTypeOption = useMemo(
    () =>
      buildWinRateOption(
        (statistics?.formats?.byQuestionTimeType ?? []).map((item) => ({
          label: item.questionTimeType === ChallengeQuestionTimeType.TimeToOne ? t('challenges.timer.perQuestion') : t('challenges.timer.wholeChallenge'),
          winRate: item.winRate,
          count: item.count,
        })),
        infoColor,
        axisLabelColor,
        dividerColor,
        t,
      ),
    [axisLabelColor, dividerColor, infoColor, statistics?.formats?.byQuestionTimeType, t],
  );

  const questionsCountOption = useMemo(
    () =>
      buildWinRateOption(
        (statistics?.formats?.byQuestionsCount ?? []).map((item) => ({
          label: t('challenges.questionsCount', { count: item.questionsCount }),
          winRate: item.winRate,
          count: item.count,
        })),
        successColor,
        axisLabelColor,
        dividerColor,
        t,
      ),
    [axisLabelColor, dividerColor, statistics?.formats?.byQuestionsCount, successColor, t],
  );

  const questionTypeOption = useMemo(() => {
    const rows = statistics?.distribution?.byQuestionType ?? [];
    if (!rows.length) return null;
    return {
      color: [primaryColor, successColor, warningColor, errorColor, infoColor, neutralColor],
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: axisLabelColor } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['36%', '50%'],
          itemStyle: {
            borderRadius: 6,
            borderColor: getColor(theme.vars.palette.background.paper),
            borderWidth: 2,
          },
          label: { show: false },
          labelLine: { show: false },
          data: rows.map((item) => ({ name: getQuestionTypeLabel(item.questionType, t), value: item.seen })),
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, errorColor, infoColor, neutralColor, primaryColor, statistics?.distribution?.byQuestionType, successColor, t, theme.vars.palette.background.paper, warningColor]);

  const highlights = [
    { title: t('challenges.statisticsPage.records.biggestGain', { defaultValue: 'Biggest gain' }), entry: statistics?.records?.biggestGain, tone: 'success' as const },
    { title: t('challenges.statisticsPage.records.biggestDrop', { defaultValue: 'Biggest drop' }), entry: statistics?.records?.biggestDrop, tone: 'error' as const },
    { title: t('challenges.statisticsPage.records.bestVictory', { defaultValue: 'Best victory' }), entry: statistics?.records?.bestVictory, tone: 'success' as const },
    { title: t('challenges.statisticsPage.records.worstDefeat', { defaultValue: 'Worst defeat' }), entry: statistics?.records?.worstDefeat, tone: 'error' as const },
    { title: t('challenges.statisticsPage.records.mostDominantWin', { defaultValue: 'Most dominant win' }), entry: statistics?.records?.mostDominantWin, tone: 'success' as const },
    { title: t('challenges.statisticsPage.records.closestLoss', { defaultValue: 'Closest loss' }), entry: statistics?.records?.mostPainfulLoss, tone: 'error' as const },
  ];

  const chapters = (statistics?.distribution?.byChapter ?? []).slice(0, 10);

  const ratingChartEvents = useMemo(
    () => ({
      click: (params: any) => {
        const challengeId = params?.data?.challengeId;
        if (challengeId) navigate(getResourceById(resources.Challenge, challengeId));
      },
    }),
    [navigate],
  );

  return (
    <Stack direction="column">
      <PageHeader
        title={t('challenges.statisticsTitle')}
        breadcrumb={[
          { label: t('challenges.title'), url: resources.Challenges },
          { label: t('contests.tabs.statistics'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <Stack spacing={3}>
          {(isStatisticsLoading || isChallengesLoading) && (
            <Card variant="outlined">
              <CardContent>
                <LinearProgress />
              </CardContent>
            </Card>
          )}

          {statistics ? (
            <>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6, xl: 3 }}>
                  <OverviewCard label={t('challenges.statisticsPage.cards.currentRating', { defaultValue: 'Current rating' })} value={String(Math.round(statistics.general?.currentRating ?? 0))} subtitle={statistics.general?.rankTitle} tone="primary" />
                </Grid>
                <Grid size={{ xs: 12, md: 6, xl: 3 }}>
                  <OverviewCard label={t('challenges.statisticsPage.cards.bestRating', { defaultValue: 'Best rating' })} value={String(Math.round(statistics.general?.bestRating ?? 0))} subtitle={formatDateTimeSafe(statistics.general?.bestRatingAt)} tone="success" />
                </Grid>
                <Grid size={{ xs: 12, md: 6, xl: 3 }}>
                  <OverviewCard label={t('challenges.statisticsPage.cards.totalChallenges', { defaultValue: 'Total challenges' })} value={String(statistics.general?.totalChallenges ?? 0)} subtitle={t('challenges.statisticsPage.cards.ratedSplit', { defaultValue: '{{rated}} rated / {{unrated}} unrated', rated: statistics.general?.ratedChallenges ?? 0, unrated: statistics.general?.unratedChallenges ?? 0 })} />
                </Grid>
                <Grid size={{ xs: 12, md: 6, xl: 3 }}>
                  <OverviewCard label={t('challenges.statisticsPage.cards.solveRate', { defaultValue: 'Solve rate' })} value={toPercent(statistics.results?.solveRate)} subtitle={t('challenges.statisticsPage.cards.winRateSubtitle', { defaultValue: 'Win rate {{value}}', value: toPercent(statistics.results?.winRate) })} />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <ChartCard title={t('challenges.statisticsPage.ratingHistory', { defaultValue: 'Rating history' })} option={ratingChartOption} emptyText={t('challenges.noChanges')} onEvents={ratingChartEvents} extra={statistics.general?.ratingPlace ? <Chip label={t('challenges.statisticsPage.rankPlace', { defaultValue: 'Rank #{{value}}', value: statistics.general.ratingPlace })} size="small" color="primary" variant="soft" /> : null} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title={t('challenges.statisticsPage.ratingSummary', { defaultValue: 'Rating summary' })} />
                    <CardContent>
                      <Stack spacing={1.25}>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.playersCount', { defaultValue: 'Players in rating' })}</Typography><Typography variant="subtitle2">{statistics.general?.playersCount ?? 0}</Typography></Stack>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.lowestRating', { defaultValue: 'Lowest rating' })}</Typography><Typography variant="subtitle2" color="error.main">{Math.round(statistics.general?.worstRating ?? 0)}</Typography></Stack>
                        <Typography variant="caption" color="text.secondary">{formatDateTimeSafe(statistics.general?.worstRatingAt)}</Typography>
                        <Divider />
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip size="small" variant="outlined" label={t('challenges.statisticsPage.botSplit', { defaultValue: '{{human}} human / {{bot}} bot', human: statistics.general?.humanChallenges ?? 0, bot: statistics.general?.botChallenges ?? 0 })} />
                          <Chip size="small" variant="outlined" label={t('challenges.statisticsPage.arenaChallenges', { defaultValue: '{{count}} arena challenges', count: statistics.general?.arenaChallenges ?? 0 })} />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <ChartCard title={t('challenges.statisticsPage.performance.title', { defaultValue: 'Result split' })} option={resultsDonutOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title={t('challenges.statisticsPage.performance.solveSummary', { defaultValue: 'Question performance' })} />
                    <CardContent>
                      <Stack spacing={1.25}>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.questionsSolved', { defaultValue: 'Solved questions' })}</Typography><Typography variant="subtitle2">{statistics.results?.questionsSolved ?? 0} / {statistics.results?.questionsSeen ?? 0}</Typography></Stack>
                        <LinearProgress variant="determinate" value={statistics.results?.solveRate ?? 0} color="success" sx={{ height: 8, borderRadius: 1 }} />
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.averageSolved', { defaultValue: 'Average solved per challenge' })}</Typography><Typography variant="subtitle2">{statistics.results?.averageSolvedPerChallenge ?? 0}</Typography></Stack>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.perfectChallenges', { defaultValue: 'Perfect challenges' })}</Typography><Typography variant="subtitle2">{statistics.results?.perfectChallenges ?? 0}</Typography></Stack>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.cleanSweepWins', { defaultValue: 'Clean sweep wins' })}</Typography><Typography variant="subtitle2">{statistics.results?.cleanSweepWins ?? 0}</Typography></Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <ChartCard title={t('challenges.statisticsPage.performance.opponentBuckets', { defaultValue: 'Opponent buckets' })} option={ratingBucketOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} extra={<Chip size="small" variant="soft" color="info" label={t('challenges.statisticsPage.avgOpponent', { defaultValue: 'Avg {{value}}', value: Math.round(statistics.opponents?.averageOpponentRating ?? 0) })} />} />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <ChartCard title={t('challenges.statisticsPage.activity.title', { defaultValue: 'Recent activity' })} option={activityOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <ChartCard title={t('challenges.statisticsPage.activity.heatmap', { defaultValue: 'Activity heatmap' })} option={heatmapOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} extra={availableYears.length ? <ToggleButtonGroup size="small" exclusive value={activeYear} onChange={(_, value) => value && setField('selectedYear', value)}>{availableYears.map((year) => <ToggleButton key={year} value={year}>{year}</ToggleButton>)}</ToggleButtonGroup> : null} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <ChartCard title={t('challenges.statisticsPage.activity.weekdays', { defaultValue: 'Weekday activity' })} option={weekdayOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <ChartCard title={t('challenges.statisticsPage.activity.hours', { defaultValue: 'Hour activity' })} option={hourOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 4 }}><ChartCard title={t('challenges.statisticsPage.formats.timeControl', { defaultValue: 'By time control' })} option={timeControlOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={260} /></Grid>
                <Grid size={{ xs: 12, lg: 4 }}><ChartCard title={t('challenges.statisticsPage.formats.timerMode', { defaultValue: 'By timer mode' })} option={questionTimeTypeOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={260} /></Grid>
                <Grid size={{ xs: 12, lg: 4 }}><ChartCard title={t('challenges.statisticsPage.formats.questionCount', { defaultValue: 'By question count' })} option={questionsCountOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={260} /></Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title={t('challenges.statisticsPage.knowledge.difficulty', { defaultValue: 'Difficulty breakdown' })} />
                    <CardContent>
                      <Stack spacing={1.5}>
                        {(statistics.distribution?.byDifficulty ?? []).map((item) => {
                          const percent = item.seen ? Math.round((item.solved * 100) / item.seen) : 0;
                          const color = item.difficulty === 1 ? 'success' : item.difficulty === 2 ? 'warning' : 'error';
                          return (
                            <Stack key={item.difficulty} spacing={0.5}>
                              <Stack direction="row" justifyContent="space-between"><Typography variant="body2">{getDifficultyLabel(item.difficulty, t)}</Typography><Typography variant="body2" color="text.secondary">{item.solved} / {item.seen} ({percent}%)</Typography></Stack>
                              <LinearProgress variant="determinate" value={percent} color={color as any} sx={{ height: 8, borderRadius: 1 }} />
                            </Stack>
                          );
                        })}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}><ChartCard title={t('challenges.statisticsPage.knowledge.questionTypes', { defaultValue: 'Question types' })} option={questionTypeOption} emptyText={t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' })} height={280} /></Grid>
                <Grid size={{ xs: 12 }}>
                  <Card variant="outlined"><CardHeader title={t('challenges.statisticsPage.knowledge.topChapters', { defaultValue: 'Top chapters' })} /><CardContent><Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{chapters.map((chapter: ChallengeStatisticsChapterRow) => <Chip key={chapter.chapterId} label={`${chapter.title} (${chapter.solved}/${chapter.seen})`} variant="soft" color="primary" size="small" />)}</Stack></CardContent></Card>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title={t('challenges.statisticsPage.records.title', { defaultValue: 'Records' })} />
                    <CardContent>
                      <Grid container spacing={2}>
                        {highlights.map((item) => {
                          const link = item.entry?.challengeId ? getResourceById(resources.Challenge, item.entry.challengeId) : undefined;
                          const subtitle =
                            getRecordSubtitle(item.entry) ??
                            t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' });

                          return (
                            <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                              <RecordCard
                                title={item.title}
                                value={getRecordValue(item.entry)}
                                subtitle={subtitle}
                                href={link}
                                tone={item.tone}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title={t('challenges.statisticsPage.records.streaks', { defaultValue: 'Streaks' })} />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <RecordCard
                            title={t('challenges.statisticsPage.records.longestWinStreak', { defaultValue: 'Longest win streak' })}
                            value={t('challenges.statisticsPage.streakCount', {
                              defaultValue: '{{count}} challenges',
                              count: statistics.records?.longestWinStreak.count ?? 0,
                            })}
                            subtitle={getStreakSubtitle(
                              statistics.records?.longestWinStreak.startAt,
                              statistics.records?.longestWinStreak.endAt,
                            )}
                            tone="success"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <RecordCard
                            title={t('challenges.statisticsPage.records.currentWinStreak', { defaultValue: 'Current win streak' })}
                            value={t('challenges.statisticsPage.streakCount', {
                              defaultValue: '{{count}} challenges',
                              count: statistics.records?.currentWinStreak.count ?? 0,
                            })}
                            subtitle={getStreakSubtitle(
                              statistics.records?.currentWinStreak.startAt,
                              statistics.records?.currentWinStreak.endAt,
                            )}
                            tone="success"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <RecordCard
                            title={t('challenges.statisticsPage.records.longestLossStreak', { defaultValue: 'Longest loss streak' })}
                            value={t('challenges.statisticsPage.streakCount', {
                              defaultValue: '{{count}} challenges',
                              count: statistics.records?.longestLossStreak.count ?? 0,
                            })}
                            subtitle={getStreakSubtitle(
                              statistics.records?.longestLossStreak.startAt,
                              statistics.records?.longestLossStreak.endAt,
                            )}
                            tone="error"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <RecordCard
                            title={t('challenges.statisticsPage.records.currentLossStreak', { defaultValue: 'Current loss streak' })}
                            value={t('challenges.statisticsPage.streakCount', {
                              defaultValue: '{{count}} challenges',
                              count: statistics.records?.currentLossStreak.count ?? 0,
                            })}
                            subtitle={getStreakSubtitle(
                              statistics.records?.currentLossStreak.startAt,
                              statistics.records?.currentLossStreak.endAt,
                            )}
                            tone="error"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 4 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={t('challenges.statisticsPage.opponents.summary', { defaultValue: 'Opponent summary' })} /><CardContent><Stack spacing={1.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{t('challenges.statisticsPage.avgOpponent', { defaultValue: 'Average opponent rating' })}</Typography><Typography variant="subtitle2">{Math.round(statistics.opponents?.averageOpponentRating ?? 0)}</Typography></Stack>{[statistics.opponents?.vsHigherRated, statistics.opponents?.vsSameRated, statistics.opponents?.vsLowerRated].map((bucket) => <Stack key={bucket?.bucket} spacing={0.5}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">{getBucketLabel(bucket?.bucket, t)}</Typography><Typography variant="body2" color="text.secondary">{bucket?.wins ?? 0}-{bucket?.draws ?? 0}-{bucket?.losses ?? 0}</Typography></Stack><LinearProgress variant="determinate" value={bucket?.winRate ?? 0} sx={{ height: 8, borderRadius: 1 }} /></Stack>)}</Stack></CardContent></Card></Grid>
                <Grid size={{ xs: 12, lg: 4 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={t('challenges.statisticsPage.opponents.mostPlayed', { defaultValue: 'Most played opponents' })} /><CardContent><Stack spacing={1.25}>{renderOpponentListSafe(statistics.opponents?.mostPlayedOpponents ?? [], t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' }))}</Stack></CardContent></Card></Grid>
                <Grid size={{ xs: 12, lg: 4 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={t('challenges.statisticsPage.opponents.rivals', { defaultValue: 'Rivals' })} /><CardContent><Stack spacing={1.25}>{renderOpponentListSafe(statistics.opponents?.rivals ?? [], t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' }))}</Stack></CardContent></Card></Grid>
                <Grid size={{ xs: 12, lg: 6 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={t('challenges.statisticsPage.opponents.bestVictories', { defaultValue: 'Best victories' })} /><CardContent><Stack spacing={1.25}>{renderRecordListSafe(statistics.opponents?.bestVictories ?? [], t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' }))}</Stack></CardContent></Card></Grid>
                <Grid size={{ xs: 12, lg: 6 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={t('challenges.statisticsPage.opponents.worstDefeats', { defaultValue: 'Worst defeats' })} /><CardContent><Stack spacing={1.25}>{renderRecordListSafe(statistics.opponents?.worstDefeats ?? [], t('challenges.statisticsPage.noData', { defaultValue: 'No data yet.' }))}</Stack></CardContent></Card></Grid>
              </Grid>

              <Card variant="outlined">
                <CardHeader title={t('challenges.lastChallenges')} />
                <CardContent>
                  <Stack spacing={1.5}>
                    {(lastChallenges?.data ?? []).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
                    {!isChallengesLoading && !lastChallenges?.data?.length ? <Typography variant="body2" color="text.secondary">{t('challenges.noChallenges')}</Typography> : null}
                    {(lastChallenges?.pagesCount ?? 0) > 1 ? <Box display="flex" justifyContent="flex-end"><Pagination color="primary" shape="rounded" page={state.page} count={lastChallenges?.pagesCount ?? 0} onChange={(_, value) => setField('page', value)} /></Box> : null}
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
};

export default UserStatisticsPage;
