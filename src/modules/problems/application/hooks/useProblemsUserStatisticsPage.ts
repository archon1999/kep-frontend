import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import {
  useProblemsUserStatistics,
  useProblemsUserStatisticsActivity,
  useProblemsUserStatisticsHeatmap,
} from 'modules/problems/application/queries';
import type {
  ProblemsUserStatisticsActivity,
  ProblemsUserStatisticsHeatmap,
} from 'modules/problems/domain/entities/problem.entity';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { getCurrentYear } from 'shared/lib/dateTime';
import { numberParam, stringParam } from 'shared/lib/queryParams';

export const DEFAULT_ACTIVITY_DAYS = 7;

const DEFAULT_HEATMAP_FILTER = 'recent';

const HEATMAP_START_YEAR = 2021;

const ACTIVITY_DAY_OPTIONS = [3, 7, 14, 30] as const;

const buildHeatmapFilterOptions = (
  currentYear: number,
  t: (key: string, params?: any) => string,
) => [
  {
    value: DEFAULT_HEATMAP_FILTER,
    label: t('problems.statisticsPage.heatmap.last365Days', {
      defaultValue: 'Last 365 days',
    }),
  },
  ...Array.from(
    { length: Math.max(0, currentYear - HEATMAP_START_YEAR + 1) },
    (_, index) => currentYear - index,
  ).map((year) => ({
    value: String(year),
    label: String(year),
  })),
];

export const useProblemsUserStatisticsPage = () => {
  const { t } = useTranslation();

  const { currentUser } = useAuth();

  const { state, setField } = useRouteQueryState<{
    selectedHeatmap?: string;
    selectedDays?: number;
  }>({
    defaults: {
      selectedHeatmap: DEFAULT_HEATMAP_FILTER,
      selectedDays: DEFAULT_ACTIVITY_DAYS,
    },
    schema: {
      selectedHeatmap: {
        ...stringParam(),
        param: 'heatmap',
      },
      selectedDays: {
        ...numberParam({ min: 1 }),
        param: 'days',
      },
    },
  });

  const username = currentUser?.username;

  const heatmapFilterOptions = useMemo(() => buildHeatmapFilterOptions(getCurrentYear(), t), [t]);

  const selectedHeatmapFilter = heatmapFilterOptions.some(
    (option) => option.value === state.selectedHeatmap,
  )
    ? (state.selectedHeatmap ?? DEFAULT_HEATMAP_FILTER)
    : DEFAULT_HEATMAP_FILTER;

  const selectedHeatmapYear =
    selectedHeatmapFilter === DEFAULT_HEATMAP_FILTER ? undefined : Number(selectedHeatmapFilter);

  const { data: statistics, isLoading, error, mutate } = useProblemsUserStatistics(username);

  const {
    data: activityResponse,
    isLoading: activityLoading,
    error: activityError,
    mutate: retryActivity,
  } = useProblemsUserStatisticsActivity(username, state.selectedDays ?? DEFAULT_ACTIVITY_DAYS);

  const {
    data: heatmapResponse,
    isLoading: heatmapLoading,
    error: heatmapError,
    mutate: retryHeatmap,
  } = useProblemsUserStatisticsHeatmap(username, selectedHeatmapYear);

  const defaultActivityData = useMemo<ProblemsUserStatisticsActivity | undefined>(
    () =>
      statistics
        ? {
            lastDays: statistics.lastDays,
            meta: {
              lastDays: statistics.meta?.lastDays,
              allowedLastDays: statistics.meta?.allowedLastDays?.length
                ? statistics.meta.allowedLastDays
                : [...ACTIVITY_DAY_OPTIONS],
            },
          }
        : undefined,
    [statistics],
  );

  const defaultHeatmapData = useMemo<ProblemsUserStatisticsHeatmap | undefined>(
    () =>
      statistics
        ? {
            heatmap: statistics.heatmap,
            meta: {
              heatmapRange: statistics.meta?.heatmapRange,
            },
          }
        : undefined,
    [statistics],
  );

  const activityStatistics =
    activityResponse ??
    (state.selectedDays === DEFAULT_ACTIVITY_DAYS ? defaultActivityData : undefined);

  const heatmapStatistics =
    heatmapResponse ??
    (selectedHeatmapFilter === DEFAULT_HEATMAP_FILTER ? defaultHeatmapData : undefined);

  const availableDays = activityStatistics?.meta?.allowedLastDays?.length
    ? activityStatistics.meta.allowedLastDays
    : [...ACTIVITY_DAY_OPTIONS];
  return {
    state,
    setField,
    statistics,
    isLoading,
    error,
    mutate,
    activityLoading,
    activityError,
    retryActivity,
    heatmapLoading,
    heatmapError,
    retryHeatmap,
    selectedHeatmapFilter,
    activityStatistics,
    heatmapStatistics,
    availableDays,
    heatmapFilterOptions,
  };
};
