import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useContestUserStatistics } from 'modules/contests/application/queries';
import {
  ContestUserStatisticsContestDeltaEntry,
  ContestUserStatisticsContestRankEntry,
} from 'modules/contests/domain/entities/contest-user-statistics.entity';
import type { KepIconName } from 'shared/config/icons';
import { createNumberFormatter } from 'shared/lib/numberFormat';

export const useContestsUserStatisticsPage = () => {
  const { t, i18n } = useTranslation();

  const { currentUser } = useAuth();

  const username = currentUser?.username;

  const { data: statistics, isLoading, error, mutate } = useContestUserStatistics(username);

  const numberFormatter = useMemo(
    () =>
      createNumberFormatter(
        {
          maximumFractionDigits: 2,
        },
        i18n.language,
      ),
    [i18n.language],
  );

  const contestRankCards = useMemo<
    {
      icon: KepIconName;
      label: string;
      entry: ContestUserStatisticsContestRankEntry | null | undefined;
      valueColor?: string;
    }[]
  >(
    () =>
      [
        {
          icon: 'contest' as KepIconName,
          label: t('contests.statistics.bestRank'),
          entry: statistics?.contestRanks?.best,
        },
        {
          icon: 'contest' as KepIconName,
          label: t('contests.statistics.toughestRank'),
          entry: statistics?.contestRanks?.worst,
        },
      ].map(({ entry, ...rest }) => ({
        ...rest,
        entry,
        valueColor: undefined as string | undefined,
      })),
    [statistics?.contestRanks, t],
  );

  const formatRankCard = (card: {
    icon: KepIconName;
    label: string;
    entry: ContestUserStatisticsContestRankEntry | null | undefined;
    valueColor?: string;
  }) => ({
    ...card,
    value: card.entry ? `#${card.entry.rank}` : undefined,
    contestTitle: card.entry?.contestTitle,
    contestLink: card.entry?.contestId
      ? getResourceById(resources.Contest, card.entry.contestId)
      : undefined,
    subtitle: card.entry
      ? t('contests.statistics.participants', {
          total: numberFormatter.format(card.entry.participantsCount),
        })
      : undefined,
  });

  const formatDeltaCard = (card: {
    icon: KepIconName;
    label: string;
    entry: ContestUserStatisticsContestDeltaEntry | null | undefined;
    valueColor?: string;
  }) => ({
    ...card,
    value:
      card.entry?.delta != null
        ? `${card.entry.delta > 0 ? '+' : ''}${card.entry.delta}`
        : undefined,
    contestTitle: card.entry?.contestTitle,
    contestLink: card.entry?.contestId
      ? getResourceById(resources.Contest, card.entry.contestId)
      : undefined,
    subtitle: card.entry
      ? t('contests.statistics.participants', {
          total: numberFormatter.format(card.entry.participantsCount),
        })
      : undefined,
  });

  const contestRankCardsFormatted = contestRankCards.map(formatRankCard);
  return {
    statistics,
    isLoading,
    error,
    mutate,
    username,
    contestRankCardsFormatted,
    numberFormatter,
    formatDeltaCard,
  };
};
