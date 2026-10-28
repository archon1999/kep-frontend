import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestStatistics } from 'modules/contests/application/queries';
import {
  ContestStatisticsBadgeEntry,
  ContestStatisticsBadges,
} from 'modules/contests/domain/entities/contest-statistics.entity';
import { createNumberFormatter, normalizeNumberLocale } from 'shared/lib/numberFormat';

export type BadgeKey = keyof ContestStatisticsBadges;

const badgeOrder: BadgeKey[] = ['sniper', 'grinder', 'optimizer', 'neverGiveUp'];

export const useContestStatisticsPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { t, i18n } = useTranslation();

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  const { data: statistics, isLoading, error: sectionError } = useContestStatistics(contestId);

  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStatistics' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const totalAttempts = statistics?.general?.attempts?.total;

  const totalAccepted = statistics?.general?.accepted?.total;

  const acceptanceRate = statistics?.general?.acceptanceRate;

  const resolvedLocale = useMemo(() => normalizeNumberLocale(i18n.language), [i18n.language]);

  const integerFormatter = useMemo(
    () =>
      createNumberFormatter(
        {
          maximumFractionDigits: 0,
        },
        resolvedLocale,
      ),
    [resolvedLocale],
  );

  const percentFormatter = useMemo(
    () =>
      createNumberFormatter(
        {
          maximumFractionDigits: 2,
        },
        resolvedLocale,
      ),
    [resolvedLocale],
  );

  const formatCount = useCallback(
    (value?: number | null) =>
      value !== undefined && value !== null ? integerFormatter.format(value) : undefined,
    [integerFormatter],
  );

  const formatPercent = useCallback(
    (value?: number | null) =>
      value !== undefined && value !== null ? `${percentFormatter.format(value)}%` : undefined,
    [percentFormatter],
  );

  const overviewCards = useMemo(
    () => [
      {
        key: 'participants',
        icon: 'users',
        label: t('contests.statisticsPage.participants'),
        value: formatCount(statistics?.general?.participants),
      },
      {
        key: 'attempts',
        icon: 'attempts',
        label: t('contests.statisticsPage.totalAttempts'),
        value: formatCount(totalAttempts),
      },
      {
        key: 'accepted',
        icon: 'verdict',
        label: t('contests.statisticsPage.totalAccepted'),
        value: formatCount(totalAccepted),
      },
      {
        key: 'acceptance',
        icon: 'statistics',
        label: t('contests.statisticsPage.acceptance'),
        value: formatPercent(acceptanceRate),
      },
    ],
    [
      acceptanceRate,
      formatCount,
      formatPercent,
      statistics?.general?.participants,
      t,
      totalAccepted,
      totalAttempts,
    ],
  );

  const firstSolves = useMemo(() => {
    const entries = Object.entries(statistics?.firstSolves ?? {});
    return entries
      .map(([problem, entry]) => ({ problem, entry }))
      .sort((a, b) => a.problem.localeCompare(b.problem));
  }, [statistics?.firstSolves]);

  const badges = useMemo(
    () =>
      badgeOrder
        .map((key) => {
          const badge = statistics?.badges?.[key];
          if (!badge) return null;
          return { key, badge };
        })
        .filter(Boolean) as { key: BadgeKey; badge: ContestStatisticsBadgeEntry }[],
    [statistics?.badges],
  );

  const badgeLabels: Record<BadgeKey, string> = {
    sniper: t('contests.statisticsPage.badgeLabels.sniper'),
    grinder: t('contests.statisticsPage.badgeLabels.grinder'),
    optimizer: t('contests.statisticsPage.badgeLabels.optimizer'),
    neverGiveUp: t('contests.statisticsPage.badgeLabels.neverGiveUp'),
  };

  const badgeIcons: Record<BadgeKey, string> = {
    sniper: 'contest',
    grinder: 'attempts',
    optimizer: 'statistics',
    neverGiveUp: 'question',
  };

  const renderBadgeDetails = (key: BadgeKey, badge: ContestStatisticsBadgeEntry) => {
    switch (key) {
      case 'sniper':
        return t('contests.statisticsPage.badgeDetails.sniper', {
          problem: badge.problem ?? '—',
          time: badge.time ?? '—',
        });
      case 'grinder':
        return t('contests.statisticsPage.badgeDetails.grinder', {
          attempts: formatCount(badge.attempts ?? 0) ?? '0',
        });
      case 'optimizer':
        return t('contests.statisticsPage.badgeDetails.optimizer', {
          solved: formatCount(badge.solvedProblems ?? 0) ?? '0',
          wrong: formatCount(badge.wrongAttempts ?? 0) ?? '0',
        });
      case 'neverGiveUp':
        return t('contests.statisticsPage.badgeDetails.neverGiveUp', {
          problem: badge.problem ?? '—',
          attempts: formatCount(badge.attempts ?? 0) ?? '0',
        });
      default:
        return '';
    }
  };
  return {
    contest,
    isContestLoading,
    contestError,
    statistics,
    isLoading,
    sectionError,
    contestId,
    totalAttempts,
    totalAccepted,
    overviewCards,
    firstSolves,
    badges,
    formatCount,
    badgeLabels,
    badgeIcons,
    renderBadgeDetails,
  };
};
