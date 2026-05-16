import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Typography, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getResourceByParams, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useContestRatingChanges } from 'modules/contests/application/queries';
import ReactEchart from 'shared/components/base/ReactEchart';
import {
  CONTESTS_RATING_LEVELS,
  getContestsRatingImageSrc,
  getContestsRatingLevelByRating,
} from 'shared/components/rating/contestsRating';
import { getColor } from 'shared/lib/echart-utils';

echarts.use([
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
  LineChart,
  CanvasRenderer,
]);

interface ContestRatingChangesChartProps {
  username?: string;
  height?: number;
}

interface RatingChartPoint {
  value: [number, number];
  contestId?: number;
  contestTitle?: string;
  contestStartDate?: string;
  delta?: number;
  rank?: number;
  newRatingTitle?: string;
  color: string;
}

const AXIS_MIN_RATING = 0;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;
const CONTESTS_RATING_BACKGROUND_COLORS: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    NEOFIT: '#CCCCCC',
    RITOR: '#77FF77',
    LIKTOR: '#77DDBB',
    LEGAT: '#AAAAFF',
    MASTER: '#FF77FF',
    MAGISTR: '#FFCC88',
    PRETOR: '#FFBB55',
    ARCHON: '#FF7777',
    POLEMARCH: '#FF3333',
    MALIK: '#DD0000',
    MAYAR: '#CC0000',
    VALAR: '#BB0000',
    RIDWAN: '#AA0000',
  },
  dark: {
    NEOFIT: '#3D4248',
    RITOR: '#174A2A',
    LIKTOR: '#14524E',
    LEGAT: '#262A63',
    MASTER: '#55205E',
    MAGISTR: '#5E4422',
    PRETOR: '#684018',
    ARCHON: '#663030',
    POLEMARCH: '#6B1D1D',
    MALIK: '#631717',
    MAYAR: '#581414',
    VALAR: '#4E1111',
    RIDWAN: '#451010',
  },
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getAxisMaxRating = (ratings: number[]) => {
  const maxRating = Math.max(AXIS_MIN_RATING, ...ratings);
  let maxLevelIndex = 0;
  CONTESTS_RATING_LEVELS.forEach((level, index) => {
    if (maxRating >= level.min) {
      maxLevelIndex = index;
    }
  });
  const nextLevel = CONTESTS_RATING_LEVELS[maxLevelIndex + 1];

  return nextLevel?.min ?? Math.ceil((maxRating + 100) / 200) * 200;
};

const getAxisMinRating = (ratings: number[]) =>
  Math.max(AXIS_MIN_RATING, Math.floor((Math.min(...ratings) - 100) / 100) * 100);

const getDateAxisConfig = (minTime: number, maxTime: number) => {
  const years = dayjs(maxTime).diff(dayjs(minTime), 'year', true);
  const months = Math.max(1, dayjs(maxTime).diff(dayjs(minTime), 'month'));

  if (years > 4) {
    return {
      interval: YEAR_MS,
      splitNumber: Math.ceil(years),
      format: 'YYYY',
    };
  }

  if (years >= 1) {
    return {
      interval: 4 * MONTH_MS,
      splitNumber: Math.ceil(months / 4),
      format: 'MMM/YYYY',
    };
  }

  return {
    interval: MONTH_MS,
    splitNumber: months,
    format: 'MMM/YYYY',
  };
};

const getYearDateAxisConfig = (minTime: number, maxTime: number) => {
  const years = Math.max(1, Math.ceil(dayjs(maxTime).diff(dayjs(minTime), 'year', true)));

  return {
    interval: YEAR_MS,
    splitNumber: years,
    format: 'YYYY',
  };
};

const formatDelta = (delta?: number) => {
  if (delta === undefined || delta === null) return '-';
  return `${delta > 0 ? '+' : ''}${delta}`;
};

const getContestRatingBackgroundColor = (title: string, mode: 'light' | 'dark') =>
  CONTESTS_RATING_BACKGROUND_COLORS[mode][title] ?? CONTESTS_RATING_BACKGROUND_COLORS[mode].NEOFIT;

const getStandingsParticipantPath = (contestId?: number, username?: string) => {
  if (!contestId || !username) {
    return null;
  }

  return getResourceByParams(resources.ContestStandingsParticipant, {
    id: contestId,
    username: encodeURIComponent(username),
  });
};

const getSupportedNumberLocale = (language?: string) => {
  const normalized = language?.trim().replace(/_/g, '-');
  const languageRegion = normalized?.replace(
    /^([a-zA-Z]{2})([A-Z]{2})$/,
    (_, languageCode: string, regionCode: string) => `${languageCode.toLowerCase()}-${regionCode}`,
  );
  const fallbackLanguage = normalized?.slice(0, 2).toLowerCase();
  const candidates = [languageRegion, normalized, fallbackLanguage];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    try {
      if (Intl.NumberFormat.supportedLocalesOf(candidate).length > 0) {
        return candidate;
      }
    } catch {
      // Ignore invalid app locale aliases such as "enUS"; Intl will use the default locale.
    }
  }

  return undefined;
};

const ContestRatingChangesChart = ({ username, height = 360 }: ContestRatingChangesChartProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: changes, isLoading } = useContestRatingChanges(username);
  const numberLocale = useMemo(() => getSupportedNumberLocale(i18n.language), [i18n.language]);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        maximumFractionDigits: 0,
        useGrouping: false,
      }),
    [numberLocale],
  );

  const chartData = useMemo(
    () =>
      [...(changes ?? [])]
        .filter((change) => change.newRating !== undefined && change.contestStartDate)
        .sort((a, b) => dayjs(a.contestStartDate).valueOf() - dayjs(b.contestStartDate).valueOf()),
    [changes],
  );

  const option = useMemo(() => {
    if (!chartData.length) {
      return null;
    }

    const ratings = chartData.map((change) => change.newRating ?? AXIS_MIN_RATING);
    const axisMinRating = getAxisMinRating(ratings);
    const axisMaxRating = getAxisMaxRating(ratings);
    const axisLabelColor = getColor(theme.vars.palette.text.secondary);
    const axisTextColor = getColor(theme.vars.palette.text.primary);
    const textColor = getColor(theme.vars.palette.text.primary);
    const dividerColor = getColor(theme.vars.palette.divider);
    const paperColor = getColor(theme.vars.palette.background.paper);
    const shadowColor = getColor(theme.vars.palette.common.black);
    const primaryColor = getColor(theme.vars.palette.primary.main);
    const times = chartData.map((change) => dayjs(change.contestStartDate).valueOf());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const dateAxisConfig = isDownSm
      ? getYearDateAxisConfig(minTime, maxTime)
      : getDateAxisConfig(minTime, maxTime);

    const ratingRanges = CONTESTS_RATING_LEVELS.map((level, index) => {
      const nextLevel = CONTESTS_RATING_LEVELS[index + 1];
      const rangeTo = nextLevel?.min ?? axisMaxRating;

      return {
        level,
        from: Math.max(level.min, axisMinRating),
        to: Math.min(rangeTo, axisMaxRating),
        visualTo: rangeTo,
      };
    }).filter(({ from, to }) => from < to);

    const points: RatingChartPoint[] = chartData.map((change) => {
      const rating = change.newRating ?? AXIS_MIN_RATING;
      const level = getContestsRatingLevelByRating(rating);

      return {
        value: [dayjs(change.contestStartDate).valueOf(), rating],
        contestId: change.contestId,
        contestTitle: change.contestTitle,
        contestStartDate: change.contestStartDate,
        delta: change.delta,
        rank: change.rank,
        newRatingTitle: change.newRatingTitle ?? level?.title,
        color: level?.color ?? primaryColor,
      };
    });

    return {
      grid: { left: 0, right: 0, top: 8, bottom: 24, containLabel: true },
      tooltip: {
        trigger: 'item',
        confine: false,
        enterable: true,
        triggerOn: 'click',
        hideDelay: 200,
        backgroundColor: paperColor,
        borderWidth: 1,
        borderColor: dividerColor,
        extraCssText: `box-shadow: 0 14px 36px -20px ${alpha(shadowColor, 0.45)}; border-radius: 8px;`,
        textStyle: {
          color: textColor,
          fontFamily: theme.typography.fontFamily,
        },
        formatter: (params: any) => {
          const point = params?.data as RatingChartPoint | undefined;
          if (!point) return '';

          const rating = point.value?.[1] ?? 0;
          const titleLabel = point.newRatingTitle ?? getContestsRatingLevelByRating(rating)?.title;
          const titleIcon = getContestsRatingImageSrc(titleLabel);
          const standingsPath = getStandingsParticipantPath(point.contestId, username);
          const delta = point.delta ?? 0;
          const deltaColor =
            delta > 0
              ? getColor(theme.vars.palette.success.main)
              : delta < 0
                ? getColor(theme.vars.palette.error.main)
                : axisLabelColor;

          return `
            <div style="min-width:220px; color:${textColor};">
              <div style="font-weight:800; font-size:13px; margin-bottom:8px;">${escapeHtml(
                point.contestTitle,
              )}</div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                ${
                  titleIcon
                    ? `<img src="${titleIcon}" alt="" style="width:24px;height:24px;border-radius:50%;" />`
                    : ''
                }
                <div>
                  <div style="font-size:11px;color:${axisLabelColor};">${escapeHtml(
                    titleLabel,
                  )}</div>
                  <div style="font-weight:800;color:${point.color};">${numberFormatter.format(
                    rating,
                  )}</div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr auto;gap:5px 16px;font-size:12px;">
                <span style="color:${axisLabelColor};">${escapeHtml(
                  t('contests.ratingChanges.tooltip.date'),
                )}</span>
                <strong>${dayjs(point.contestStartDate).format('DD MMM YYYY')}</strong>
                <span style="color:${axisLabelColor};">${escapeHtml(
                  t('contests.ratingChanges.tooltip.delta'),
                )}</span>
                <strong style="color:${deltaColor};">${formatDelta(point.delta)}</strong>
                <span style="color:${axisLabelColor};">${escapeHtml(
                  t('contests.ratingChanges.tooltip.rank'),
                )}</span>
                <strong>${point.rank ? `#${point.rank}` : '-'}</strong>
              </div>
              ${
                standingsPath
                  ? `<a href="${escapeHtml(
                      standingsPath,
                    )}" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;margin-top:11px;padding:7px 10px;border-radius:6px;background:${getColor(
                      theme.vars.palette.primary.main,
                    )};color:${getColor(
                      theme.vars.palette.primary.contrastText,
                    )};font-size:12px;font-weight:800;text-decoration:none;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71"></path>
                      </svg>
                      <span>${escapeHtml(t('contests.ratingChanges.tooltip.openStandings'))}</span>
                    </a>`
                  : ''
              }
            </div>
          `;
        },
      },
      visualMap: {
        show: false,
        dimension: 1,
        pieces: ratingRanges.map(({ level, visualTo }) => ({
          gte: level.min,
          lt: visualTo,
          color: level.color,
        })),
        outOfRange: {
          color: primaryColor,
        },
      },
      xAxis: {
        type: 'time',
        min: minTime,
        max: maxTime,
        boundaryGap: false,
        interval: dateAxisConfig.interval,
        minInterval: dateAxisConfig.interval,
        maxInterval: dateAxisConfig.interval,
        splitNumber: dateAxisConfig.splitNumber,
        axisLabel: {
          color: axisTextColor,
          hideOverlap: true,
          formatter: (value: number | string) => dayjs(Number(value)).format(dateAxisConfig.format),
        },
        axisLine: { lineStyle: { color: dividerColor } },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: dividerColor, opacity: 0.4 } },
      },
      yAxis: {
        type: 'value',
        min: axisMinRating,
        max: axisMaxRating,
        minInterval: 1,
        axisLabel: {
          color: axisTextColor,
          formatter: (value: number | string) => String(Math.round(Number(value))),
        },
        axisLine: { lineStyle: { color: dividerColor } },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: dividerColor, opacity: 0.35 } },
      },
      series: [
        {
          type: 'line',
          clip: false,
          smooth: true,
          showSymbol: true,
          symbolSize: 10,
          cursor: username ? 'pointer' : 'default',
          data: points,
          lineStyle: { width: 3 },
          itemStyle: {
            borderWidth: 2,
            borderColor: paperColor,
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: alpha(shadowColor, 0.35),
            },
          },
          markArea: {
            silent: true,
            itemStyle: { opacity: 1 },
            data: ratingRanges.map(({ level, from, to }) => [
              {
                yAxis: from,
                itemStyle: {
                  color: getContestRatingBackgroundColor(level.title, theme.palette.mode),
                },
              },
              { yAxis: to },
            ]),
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { width: 1, type: 'solid', opacity: 1 },
            label: {
              show: false,
            },
            data: CONTESTS_RATING_LEVELS.filter(
              (level) => level.min >= axisMinRating && level.min <= axisMaxRating,
            ).map((level) => ({
              yAxis: level.min,
              lineStyle: { color: alpha(level.color, 0.1) },
            })),
          },
        },
      ],
    } satisfies EChartsCoreOption;
  }, [chartData, isDownSm, numberFormatter, t, theme, username]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={height} />;
  }

  if (!option) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('contests.statistics.noData')}
      </Typography>
    );
  }

  return (
    <ReactEchart
      echarts={echarts}
      option={option}
      style={{ width: '100%', height, overflow: 'visible' }}
      sx={{
        overflow: 'visible',
        '& > div': { overflow: 'visible !important' },
      }}
    />
  );
};

export default ContestRatingChangesChart;
