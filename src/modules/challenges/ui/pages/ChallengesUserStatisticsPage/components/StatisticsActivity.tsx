import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { alpha, useColorScheme, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {
  ChallengeStatisticsActivity,
  ChallengeUserStatistics,
} from 'modules/challenges/domain';
import ReactEchart from 'shared/components/base/ReactEchart';
import { formatDateTime, formatMachineDateTime } from 'shared/lib/dateTime';
import { statisticsInset } from './statisticsStyles';

echarts.use([BarChart, GridComponent, TooltipComponent, LegacyGridContainLabel, CanvasRenderer]);
const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const ActivityCalendar = ({
  activity,
  selectedYear,
  onYearChange,
}: {
  activity: ChallengeStatisticsActivity;
  selectedYear?: number;
  onYearChange: (year: number) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const activeScheme =
    mode === 'dark' || (mode === 'system' && systemMode === 'dark') ? 'dark' : 'light';
  const palette = theme.colorSchemes[activeScheme]?.palette ?? theme.palette;
  const years = [...new Set(activity.heatmap.map((entry) => dayjs(entry.date).year()))]
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  const year = years.includes(selectedYear ?? 0) ? selectedYear! : (years[0] ?? dayjs().year());
  const counts = new Map(activity.heatmap.map((entry) => [entry.date.slice(0, 10), entry.count]));
  const start = dayjs(`${year}-01-01`);
  const end = start.endOf('year');
  const firstWeekday = (start.day() + 6) % 7;
  const firstMonday = start.subtract(firstWeekday, 'day');
  const days = Array.from({ length: end.diff(start, 'day') + 1 }, (_, index) => {
    const date = start.add(index, 'day');
    return {
      date: date.format('YYYY-MM-DD'),
      weekday: (date.day() + 6) % 7,
      week: Math.floor(date.diff(firstMonday, 'day') / 7),
      count: counts.get(date.format('YYYY-MM-DD')) ?? 0,
    };
  });
  const weeks = days[days.length - 1]?.week ?? 52;
  const max = Math.max(1, ...days.map((day) => day.count));
  const primary = palette.primary.main;
  const color = (count: number) =>
    count ? alpha(primary, 0.25 + (0.75 * count) / max) : alpha(palette.text.primary, 0.07);
  const recentTotal = activity.last30Days.reduce((sum, row) => sum + row.count, 0);
  const activeDays = activity.last30Days.filter((row) => row.count > 0).length;
  const recentDays = [...activity.last30Days].sort((first, second) =>
    first.date.localeCompare(second.date),
  );
  const rangeStart = recentDays[0]?.date;
  const rangeEnd = recentDays[recentDays.length - 1]?.date;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="column" spacing={0.75}>
          <Typography variant="h6" component="h2">
            {t('challenges.statisticsPage.activity.title')}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
              {t('challenges.statisticsPage.challengesShort')}: {recentTotal}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
              {t('challenges.statisticsPage.activity.activeDays', { count: activeDays })}
            </Typography>
          </Stack>
          {rangeStart && rangeEnd ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {formatDateTime(rangeStart, 'compactDateNoComma')} –{' '}
              {formatDateTime(rangeEnd, 'compactDateNoComma')}
            </Typography>
          ) : null}
        </Stack>
        {years.length > 0 && (
          <TextField
            select
            size="small"
            label={t('challenges.statisticsPage.activity.year')}
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            sx={{ minWidth: 100 }}
          >
            {years.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>
      {!years.length ? (
        <Typography variant="body2" color="text.secondary">
          {t('challenges.statisticsPage.noData')}
        </Typography>
      ) : (
        <>
          <Box sx={{ overflowX: 'auto', pb: 1 }}>
            <Box sx={{ minWidth: 720 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `36px repeat(${weeks + 1}, minmax(0, 1fr))`,
                  mb: 1,
                }}
              >
                {Array.from({ length: 12 }, (_, month) => {
                  const date = start.month(month).startOf('month');
                  const week = Math.floor(date.diff(firstMonday, 'day') / 7);
                  return (
                    <Typography
                      key={month}
                      variant="caption"
                      color="text.secondary"
                      sx={{ gridColumn: week + 2, gridRow: 1, whiteSpace: 'nowrap' }}
                    >
                      {formatMachineDateTime(date, 'monthShort')}
                    </Typography>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 32,
                    flexShrink: 0,
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 1fr)',
                    gap: '4px',
                  }}
                >
                  {weekdayKeys.map((key, index) => (
                    <Typography
                      key={key}
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 10, lineHeight: '12px', gridRow: index + 1 }}
                    >
                      {index % 2 === 0 ? t(`challenges.statisticsPage.weekday.${key}`) : ''}
                    </Typography>
                  ))}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${weeks + 1}, minmax(0, 1fr))`,
                    gridTemplateRows: 'repeat(7, auto)',
                    gap: '4px',
                  }}
                >
                  {days.map((day) => (
                    <Tooltip
                      key={day.date}
                      title={`${formatDateTime(day.date, 'compactDateNoComma')}: ${t('challenges.statisticsPage.streakCount', { count: day.count })}`}
                    >
                      <Box
                        role="img"
                        aria-label={`${day.date}: ${day.count}`}
                        sx={{
                          gridColumn: day.week + 1,
                          gridRow: day.weekday + 1,
                          bgcolor: color(day.count),
                          minWidth: 0,
                          aspectRatio: '1',
                          borderRadius: '2px',
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={0.75}
            sx={{ mt: 1.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('challenges.statisticsPage.activity.less')}
            </Typography>
            {[0, 0.25, 0.5, 0.75, 1].map((level) => (
              <Box
                key={level}
                sx={{ width: 12, height: 12, bgcolor: color(level * max), borderRadius: '2px' }}
              />
            ))}
            <Typography variant="caption" color="text.secondary">
              {t('challenges.statisticsPage.activity.more')}
            </Typography>
          </Stack>
        </>
      )}
    </Box>
  );
};

const StatisticsActivity = ({
  statistics,
  selectedYear,
  onYearChange,
}: {
  statistics: ChallengeUserStatistics;
  selectedYear?: number;
  onYearChange: (year: number) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const activeScheme =
    mode === 'dark' || (mode === 'system' && systemMode === 'dark') ? 'dark' : 'light';
  const activity = statistics.activity;
  const options = useMemo(() => {
    const palette = theme.colorSchemes[activeScheme]?.palette ?? theme.palette;
    const axisColor = palette.text.secondary;
    const divider = palette.divider;
    const color = palette.primary.main;
    const chart = (labels: string[], values: number[], horizontal = false) => ({
      color: [color],
      textStyle: { fontFamily: theme.typography.fontFamily },
      grid: { top: 16, right: 12, bottom: 8, left: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: palette.background.paper,
        borderColor: divider,
        textStyle: { color: palette.text.primary },
      },
      xAxis: horizontal
        ? {
            type: 'value',
            minInterval: 1,
            axisLabel: { color: axisColor },
            splitLine: { lineStyle: { color: divider, type: 'dashed' } },
          }
        : {
            type: 'category',
            data: labels,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: axisColor, hideOverlap: true },
          },
      yAxis: horizontal
        ? {
            type: 'category',
            data: labels,
            inverse: true,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: axisColor },
          }
        : {
            type: 'value',
            minInterval: 1,
            axisLabel: { color: axisColor },
            splitLine: { lineStyle: { color: divider, type: 'dashed' } },
          },
      series: [
        {
          type: 'bar',
          barMaxWidth: horizontal ? 16 : 18,
          itemStyle: { borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0] },
          data: values,
        },
      ],
    });
    const lastDays = [...(activity?.last30Days ?? [])].sort((a, b) => a.date.localeCompare(b.date));
    return {
      daily: chart(
        lastDays.map((row) => formatDateTime(row.date, 'dayMonth')),
        lastDays.map((row) => row.count),
      ),
      weekdays: chart(
        weekdayKeys.map((key) => t(`challenges.statisticsPage.weekday.${key}`)),
        weekdayKeys.map(
          (_, day) => activity?.byWeekday.find((row) => row.weekday === day)?.count ?? 0,
        ),
        true,
      ),
      hours: chart(
        Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`),
        Array.from(
          { length: 24 },
          (_, hour) => activity?.byHour.find((row) => row.hour === hour)?.count ?? 0,
        ),
      ),
    };
  }, [activity, activeScheme, theme, t]);
  if (!activity)
    return (
      <Box sx={{ p: statisticsInset }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          {t('challenges.statisticsPage.activity.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('challenges.statisticsPage.noData')}
        </Typography>
      </Box>
    );
  return (
    <Box sx={{ minWidth: 0, p: statisticsInset }}>
      <ActivityCalendar
        activity={activity}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
      />
      <Box sx={{ mt: 5, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography
              variant="subtitle1"
              component="h3"
              fontWeight={600}
              sx={{ mb: 1, fontSize: 16 }}
            >
              {t('challenges.statisticsPage.activity.title')}
            </Typography>
            {activity.last30Days.length ? (
              <ReactEchart echarts={echarts} option={options.daily} style={{ height: 240 }} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('challenges.statisticsPage.noData')}
              </Typography>
            )}
          </Grid>
          {(
            [
              { key: 'weekdays', rows: activity.byWeekday },
              { key: 'hours', rows: activity.byHour },
            ] as const
          ).map(({ key, rows }) => (
            <Grid key={key} size={{ xs: 12, md: 6 }}>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  fontWeight={600}
                  sx={{ mb: 1, fontSize: 16 }}
                >
                  {t(`challenges.statisticsPage.activity.${key}`)}
                </Typography>
                {rows.length ? (
                  <ReactEchart echarts={echarts} option={options[key]} style={{ height: 250 }} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.statisticsPage.noData')}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsActivity;
