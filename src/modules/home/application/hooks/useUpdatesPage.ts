import { useMemo } from 'react';
import { useSystemUpdates } from 'modules/home/application/queries';
import type { HomeSystemUpdate } from 'modules/home/domain/entities/home.entity';
import { formatDateTime, formatMachineDateTime } from 'shared/lib/dateTime';

export type UpdateGroup = {
  date: string;
  dateLabel: string;
  items: HomeSystemUpdate[];
};

const groupUpdatesByDate = (updates: HomeSystemUpdate[]): UpdateGroup[] => {
  const groups = new Map<string, HomeSystemUpdate[]>();

  updates.forEach((update) => {
    const date = formatMachineDateTime(update.date, 'isoDate');
    groups.set(date, [...(groups.get(date) ?? []), update]);
  });

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    dateLabel: formatDateTime(date, 'fullDate'),
    items,
  }));
};

export const useUpdatesPage = () => {
  const { data, isLoading, isLoadingMore, hasMore, loadMore, mutate } = useSystemUpdates();

  const updates = data?.data ?? [];

  const groups = useMemo(() => groupUpdatesByDate(updates), [updates]);
  return { isLoading, isLoadingMore, hasMore, loadMore, mutate, groups };
};
