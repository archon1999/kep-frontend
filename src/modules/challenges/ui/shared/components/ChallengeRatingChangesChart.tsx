import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Typography, useMediaQuery } from '@mui/material';
import { alpha, useColorScheme, useTheme } from '@mui/material/styles';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useChallengeRatingChanges } from 'modules/challenges/application/queries';
import type { ChallengeRatingChange, ChallengeRatingHistoryEntry } from 'modules/challenges/domain';
import ReactEchart from 'shared/components/base/ReactEchart';
import {
  CHALLENGES_RATING_LEVELS,
  getChallengesRatingLevelByRating,
} from 'shared/components/rating/challengesRating';
import {
  diffDateTime,
  formatDateTime,
  formatDateTimePattern,
  getDateTimeValue,
} from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';

echarts.use([
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
  LegacyGridContainLabel,
  LineChart,
  CanvasRenderer,
]);

type ChallengeRatingChartChange = ChallengeRatingChange | ChallengeRatingHistoryEntry;

interface ChallengeRatingChangesChartProps {
  username?: string;
  height?: number;
  history?: ChallengeRatingHistoryEntry[];
  rankBandOpacity?: number;
  markerSize?: number;
  lineWidth?: number;
  smooth?: boolean | number;
  monochrome?: boolean;
  tooltipTrigger?: 'item' | 'axis';
}

interface ChallengeRatingChartPoint {
  value: [number, number];
  challengeId?: number;
  finishedAt?: string | null;
  delta?: number;
  opponentUsername?: string;
  opponentRating?: number;
  result?: string;
  userScore?: number;
  opponentScore?: number;
  rankTitle?: string;
  color: string;
}

const AXIS_MIN_RATING = 0;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;
const CHALLENGES_RATING_BACKGROUND_COLORS: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    R4: '#CCCCCC',
    R3: '#77FF77',
    R2: '#77DDBB',
    R1: '#AAAAFF',
    CM: '#FF77FF',
    M: '#FFCC88',
    IM: '#FFBB55',
    GM: '#FF7777',
    SGM: '#AA0000',
  },
  dark: {
    R4: '#3D4248',
    R3: '#174A2A',
    R2: '#14524E',
    R1: '#262A63',
    CM: '#55205E',
    M: '#5E4422',
    IM: '#684018',
    GM: '#663030',
    SGM: '#451010',
  },
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getChallengeRatingBackgroundColor = (title: string, mode: 'light' | 'dark') =>
  CHALLENGES_RATING_BACKGROUND_COLORS[mode][title] ?? CHALLENGES_RATING_BACKGROUND_COLORS[mode].R4;

const getAxisMinRating = (ratings: number[]) =>
  Math.max(AXIS_MIN_RATING, Math.floor((Math.min(...ratings) - 100) / 100) * 100);

const getAxisMaxRating = (ratings: number[]) => {
  const maxRating = Math.max(AXIS_MIN_RATING, ...ratings);
  let maxLevelIndex = 0;
  CHALLENGES_RATING_LEVELS.forEach((level, index) => {
    if (maxRating >= level.min) {
      maxLevelIndex = index;
    }
  });
  const nextLevel = CHALLENGES_RATING_LEVELS[maxLevelIndex + 1];

  return nextLevel?.min ?? Math.ceil((maxRating + 100) / 100) * 100;
};

const getDateAxisConfig = (minTime: number, maxTime: number) => {
  const years = diffDateTime(maxTime, minTime, 'year', true);
  const months = Math.max(1, diffDateTime(maxTime, minTime, 'month'));

  if (years > 3) {
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
  const years = Math.max(1, Math.ceil(diffDateTime(maxTime, minTime, 'year', true)));

  return {
    interval: YEAR_MS,
    splitNumber: years,
    format: 'YYYY',
  };
};

const isHistoryEntry = (
  change: ChallengeRatingChartChange,
): change is ChallengeRatingHistoryEntry => 'ratingAfter' in change;

const normalizeChange = (change: ChallengeRatingChartChange) => {
  if (isHistoryEntry(change)) {
    return {
      challengeId: change.challengeId,
      date: change.finishedAt,
      rating: change.ratingAfter,
      delta: change.delta,
      opponentUsername: change.opponentUsername,
      opponentRating: change.opponentRating,
      result: change.result,
      userScore: change.userScore,
      opponentScore: change.opponentScore,
    };
  }

  return {
    date: change.date,
    rating: change.value,
  };
};

const ChallengeRatingChangesChart = ({
  username,
  height = 360,
  history,
  rankBandOpacity = 1,
  markerSize = 10,
  lineWidth = 3,
  smooth = true,
  monochrome = false,
  tooltipTrigger = 'item',
}: ChallengeRatingChangesChartProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const colorScheme = (mode === 'system' ? systemMode : mode) ?? 'light';
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: fetchedChanges, isLoading } = useChallengeRatingChanges(
    history ? undefined : username,
  );
  const changes = history ?? fetchedChanges;

  const numberFormatter = useMemo(
    () =>
      createNumberFormatter(
        {
          maximumFractionDigits: 0,
          useGrouping: false,
        },
        normalizeSupportedLocale(i18n.language),
      ),
    [i18n.language],
  );
  const deltaFormatter = useMemo(
    () =>
      createNumberFormatter(
        { maximumFractionDigits: 1, signDisplay: 'exceptZero' },
        normalizeSupportedLocale(i18n.language),
      ),
    [i18n.language],
  );

  const chartData = useMemo(
    () =>
      [...(changes ?? [])]
        .map(normalizeChange)
        .filter(
          (change) =>
            change.date &&
            change.rating !== undefined &&
            change.rating !== null &&
            Number.isFinite(Number(change.rating)),
        )
        .sort((a, b) => getDateTimeValue(a.date) - getDateTimeValue(b.date)),
    [changes],
  );

  const option = useMemo(() => {
    if (!chartData.length) {
      return null;
    }

    const ratings = chartData.map((change) => Number(change.rating));
    const axisMinRating = getAxisMinRating(ratings);
    const axisMaxRating = getAxisMaxRating(ratings);
    const palette = theme.colorSchemes[colorScheme]?.palette ?? theme.palette;
    const axisLabelColor = palette.text.secondary;
    const axisTextColor = palette.text.secondary;
    const textColor = palette.text.primary;
    const dividerColor = palette.divider;
    const paperColor = palette.background.paper;
    const shadowColor = palette.common.black;
    const primaryColor = palette.primary.main;
    const times = chartData.map((change) => getDateTimeValue(change.date));
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const sameTime = minTime === maxTime;
    const dateAxisConfig = isDownSm
      ? getYearDateAxisConfig(minTime, maxTime)
      : getDateAxisConfig(minTime, maxTime);

    const ratingRanges = CHALLENGES_RATING_LEVELS.map((level, index) => {
      const nextLevel = CHALLENGES_RATING_LEVELS[index + 1];
      const rangeTo = nextLevel?.min ?? axisMaxRating;

      return {
        level,
        from: Math.max(level.min, axisMinRating),
        to: Math.min(rangeTo, axisMaxRating),
        visualTo: rangeTo,
      };
    }).filter(({ from, to }) => from < to);

    const points: ChallengeRatingChartPoint[] = chartData.map((change) => {
      const rating = Number(change.rating);
      const level = getChallengesRatingLevelByRating(rating);

      return {
        value: [getDateTimeValue(change.date), rating],
        challengeId: change.challengeId,
        finishedAt: change.date,
        delta: change.delta,
        opponentUsername: change.opponentUsername,
        opponentRating: change.opponentRating,
        result: change.result,
        userScore: change.userScore,
        opponentScore: change.opponentScore,
        rankTitle: level?.title,
        color: level?.color ?? primaryColor,
      };
    });

    return {
      grid: {
        left: 0,
        right: monochrome ? 4 : 0,
        top: 8,
        bottom: monochrome ? 0 : 24,
        containLabel: true,
      },
      tooltip: {
        trigger: tooltipTrigger,
        confine: true,
        enterable: true,
        triggerOn: monochrome ? 'mousemove|click' : 'click',
        ...(monochrome && {
          axisPointer: {
            type: 'line',
            lineStyle: { color: dividerColor, type: 'dashed' },
          },
        }),
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
          const point = (Array.isArray(params) ? params[0]?.data : params?.data) as
            | ChallengeRatingChartPoint
            | undefined;
          if (!point) return '';

          const rating = point.value?.[1] ?? 0;
          const delta = point.delta ?? 0;
          const deltaColor =
            delta > 0 ? palette.success.main : delta < 0 ? palette.error.main : axisLabelColor;
          const score =
            point.userScore !== undefined && point.opponentScore !== undefined
              ? `${point.userScore}:${point.opponentScore}`
              : null;

          return `
            <div style="min-width:220px; color:${textColor};">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px;">
                <div style="font-weight:800; font-size:13px;">${escapeHtml(
                  point.challengeId
                    ? t('challenges.ratingChangesTooltip.challenge', {
                        id: point.challengeId,
                        defaultValue: 'Challenge #{{id}}',
                      })
                    : t('challenges.title'),
                )}</div>
                <div style="border-radius:999px;background:${alpha(
                  point.color,
                  0.14,
                )};color:${point.color};padding:2px 8px;font-size:11px;font-weight:900;">${escapeHtml(
                  point.rankTitle,
                )}</div>
              </div>
              <div style="display:grid;grid-template-columns:1fr auto;gap:5px 16px;font-size:12px;">
                <span style="color:${axisLabelColor};">${escapeHtml(
                  t('challenges.ratingChangesTooltip.date', { defaultValue: 'Date' }),
                )}</span>
                <strong>${formatDateTime(point.finishedAt, 'compactDateNoComma')}</strong>
                <span style="color:${axisLabelColor};">${escapeHtml(
                  t('challenges.ratingChangesTooltip.rating', { defaultValue: 'Rating' }),
                )}</span>
                <strong style="color:${point.color};">${numberFormatter.format(rating)}</strong>
                ${
                  point.delta !== undefined
                    ? `<span style="color:${axisLabelColor};">${escapeHtml(
                        t('challenges.ratingChangesTooltip.delta', { defaultValue: 'Delta' }),
                      )}</span>
                      <strong style="color:${deltaColor};">${deltaFormatter.format(point.delta)}</strong>`
                    : ''
                }
                ${
                  point.opponentUsername
                    ? `<span style="color:${axisLabelColor};">${escapeHtml(
                        t('challenges.ratingChangesTooltip.opponent', {
                          defaultValue: 'Opponent',
                        }),
                      )}</span>
                      <strong>${escapeHtml(point.opponentUsername)}${
                        point.opponentRating !== undefined
                          ? ` (${numberFormatter.format(point.opponentRating)})`
                          : ''
                      }</strong>`
                    : ''
                }
                ${
                  score
                    ? `<span style="color:${axisLabelColor};">${escapeHtml(
                        t('challenges.ratingChangesTooltip.score', { defaultValue: 'Score' }),
                      )}</span>
                      <strong>${escapeHtml(score)}</strong>`
                    : ''
                }
              </div>
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
          color: monochrome ? primaryColor : level.color,
        })),
        outOfRange: {
          color: primaryColor,
        },
      },
      xAxis: {
        type: 'time',
        min: monochrome && sameTime ? minTime - DAY_MS / 2 : minTime,
        max: monochrome && sameTime ? maxTime + DAY_MS / 2 : maxTime,
        boundaryGap: false,
        ...(!monochrome && {
          interval: dateAxisConfig.interval,
          minInterval: dateAxisConfig.interval,
          maxInterval: dateAxisConfig.interval,
        }),
        splitNumber: monochrome ? (isDownSm ? 3 : 5) : dateAxisConfig.splitNumber,
        axisLabel: {
          color: axisTextColor,
          hideOverlap: true,
          formatter: (value: number | string) =>
            formatDateTimePattern(
              Number(value),
              monochrome
                ? maxTime - minTime < 3 * MONTH_MS
                  ? 'DD MMM'
                  : 'MMM YYYY'
                : dateAxisConfig.format,
            ),
          ...(monochrome && { fontFamily: theme.typography.fontFamily, fontSize: 12 }),
        },
        axisLine: { lineStyle: { color: dividerColor } },
        axisTick: { show: false },
        splitLine: {
          ...(monochrome && { show: false }),
          lineStyle: { color: dividerColor, opacity: 0.4 },
        },
      },
      yAxis: {
        type: 'value',
        min: axisMinRating,
        max: axisMaxRating,
        minInterval: 1,
        axisLabel: {
          color: axisTextColor,
          formatter: (value: number | string) => String(Math.round(Number(value))),
          ...(monochrome && { fontFamily: theme.typography.fontFamily, fontSize: 12 }),
        },
        axisLine: { lineStyle: { color: dividerColor } },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: dividerColor,
            opacity: monochrome ? 1 : 0.35,
            ...(monochrome && { type: 'dashed' }),
          },
        },
      },
      series: [
        {
          type: 'line',
          clip: false,
          smooth,
          showSymbol: markerSize > 0 || sameTime,
          ...(monochrome && { symbol: 'circle' }),
          symbolSize: markerSize || 6,
          data: points,
          lineStyle: { width: lineWidth, ...(monochrome && { color: primaryColor }) },
          itemStyle: {
            borderWidth: markerSize > 2 ? 2 : 0,
            borderColor: paperColor,
            ...(monochrome && { color: primaryColor }),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: monochrome ? 2 : 3,
              shadowBlur: monochrome ? 0 : 10,
              shadowColor: alpha(shadowColor, 0.35),
            },
          },
          markArea: {
            silent: true,
            itemStyle: { opacity: rankBandOpacity },
            data: (rankBandOpacity > 0 ? ratingRanges : []).map(({ level, from, to }) => [
              {
                yAxis: from,
                itemStyle: {
                  color: getChallengeRatingBackgroundColor(level.title, colorScheme),
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
            data: (rankBandOpacity > 0 ? CHALLENGES_RATING_LEVELS : [])
              .filter((level) => level.min >= axisMinRating && level.min <= axisMaxRating)
              .map((level) => ({
                yAxis: level.min,
                lineStyle: { color: alpha(level.color, 0.1) },
              })),
          },
        },
      ],
    } satisfies EChartsCoreOption;
  }, [
    chartData,
    colorScheme,
    deltaFormatter,
    isDownSm,
    lineWidth,
    markerSize,
    monochrome,
    numberFormatter,
    rankBandOpacity,
    smooth,
    t,
    theme,
    tooltipTrigger,
  ]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={height} />;
  }

  if (!option) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('challenges.noChanges')}
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

export default ChallengeRatingChangesChart;
