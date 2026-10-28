import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  kepCoverQueries,
  useKepCoverEntries,
  useKepCoverSummary,
} from 'modules/kep-cover/application/queries';
import { toast } from 'sonner';

const extractErrorMessage = (error: unknown) => {
  const payload = (error as { data?: unknown })?.data;

  if (typeof payload === 'string') return payload;
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    typeof (payload as { detail?: unknown }).detail === 'string'
  ) {
    return (payload as { detail: string }).detail;
  }
  if (Array.isArray(payload)) return payload.join(' ');
  if (payload && typeof payload === 'object') {
    const values = Object.values(payload).flat();
    return values.find((item) => typeof item === 'string') as string | undefined;
  }
  return undefined;
};

export const useKepCoverPage = () => {
  const { t } = useTranslation();

  const { currentUser } = useAuth();

  const {
    data: summary,
    error: summaryError,
    isLoading: isSummaryLoading,
    mutate: mutateSummary,
  } = useKepCoverSummary();

  const {
    data: entriesPage,
    error: entriesError,
    isLoading: isEntriesLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate: mutateEntries,
  } = useKepCoverEntries(12);

  const [votingEntryId, setVotingEntryId] = useState<number | null>(null);

  useDocumentTitle('pageTitles.kepCover', {
    contestTitle: summary?.title || t('kepCover.fallbackTitle'),
  });

  const entries = entriesPage?.data ?? [];

  const handleVote = async (entryId: number) => {
    setVotingEntryId(entryId);
    try {
      await kepCoverQueries.repository.vote(entryId);
      await Promise.all([mutateSummary(), mutateEntries()]);
    } catch (error) {
      toast.error(extractErrorMessage(error) || t('kepCover.messages.voteError'));
    } finally {
      setVotingEntryId(null);
    }
  };
  return {
    currentUser,
    summary,
    summaryError,
    isSummaryLoading,
    mutateSummary,
    entriesPage,
    entriesError,
    isEntriesLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutateEntries,
    handleVote,
    entries,
    votingEntryId,
  };
};
