import { useMemo } from 'react';
import { TFunction } from 'i18next';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';
import { ArenaStatistics } from '../../domain/entities/arena-statistics.entity.ts';

export const useArenaInsights = (arena: Arena | undefined, stats: ArenaStatistics | undefined, t: TFunction) =>
  useMemo(() => {
    const isUpcoming = arena?.status === ArenaStatus.NotStarted;

    const summaryItems = isUpcoming
      ? [
          {
            key: 'participants',
            label: t('arena.insights.participants'),
            value: stats?.participants ?? 0,
            icon: 'mdi:account-group-outline',
          },
          {
            key: 'averageRating',
            label: t('arena.averageRating'),
            value: stats?.averageRating ?? 0,
            icon: 'mdi:chart-line',
          },
        ]
      : [
          {
            key: 'participants',
            label: t('arena.insights.participants'),
            value: stats?.participants ?? 0,
            icon: 'mdi:account-group-outline',
          },
          {
            key: 'challenges',
            label: t('arena.totalChallenges'),
            value: stats?.challenges ?? 0,
            icon: 'mdi:sword-cross',
          },
          {
            key: 'averageRating',
            label: t('arena.averageRating'),
            value: stats?.averageRating ?? 0,
            icon: 'mdi:chart-line',
          },
        ];

    const leaders = isUpcoming
      ? []
      : [
          {
            key: 'longestWinStreak',
            label: t('arena.insights.longestWinStreak'),
            value: stats?.longestWinStreak ?? null,
            icon: 'mdi:fire',
          },
          {
            key: 'highestPerformance',
            label: t('arena.insights.highestPerformance'),
            value: stats?.highestPerformance ?? null,
            icon: 'mdi:trending-up',
          },
          {
            key: 'highestWinRate',
            label: t('arena.insights.highestWinRate'),
            value: stats?.highestWinRate ?? null,
            icon: 'mdi:percent',
          },
        ];

    return {
      summaryItems,
      leaders,
      showLeaders: !isUpcoming,
    };
  }, [arena?.status, stats, t]);
