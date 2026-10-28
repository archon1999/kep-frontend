import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useKepCoverPage } from 'modules/kep-cover/application/hooks/useKepCoverPage';
import EmptyState from 'shared/components/common/EmptyState';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { formatDateTime } from 'shared/lib/dateTime';
import KepCoverEntryCard from './components/KepCoverEntryCard';

const KepCoverPage = () => {
  const {
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
  } = useKepCoverPage();

  const { t } = useTranslation();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoadingMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore, entriesPage?.data.length]);

  const renderEntry = (entry: (typeof entries)[number], index: number, prefix: string) => (
    <KepCoverEntryCard
      key={prefix + entry.id}
      entry={entry}
      rank={index + 1}
      isVotingOpen={Boolean(summary?.isVotingOpen)}
      canVote={Boolean(summary?.canVote || entry.isLiked)}
      isVoting={votingEntryId === entry.id}
      onVote={handleVote}
      loginRequired={!currentUser}
    />
  );
  if (isSummaryLoading && !summary)
    return (
      <FramedPage>
        <Stack spacing={3} sx={{ p: 'var(--kep-content-inset)' }}>
          <Skeleton variant="rectangular" height={160} />
          <Skeleton variant="rectangular" height={320} />
        </Stack>
      </FramedPage>
    );
  if (summaryError)
    return (
      <FramedPage>
        <EmptyState
          kind="error"
          title={t('common.loadFailed')}
          action={<Button onClick={() => void mutateSummary()}>{t('common.retry')}</Button>}
        />
      </FramedPage>
    );
  if (!summary || summary.status === 'empty' || !summary.id)
    return (
      <FramedPage>
        <PageHeader variant="detail" title={t('kepCover.fallbackTitle')} />
        <EmptyState title={t('kepCover.empty.title')} description={t('kepCover.empty.subtitle')} />
      </FramedPage>
    );

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={summary.title}
        subtitle={t('kepCover.hero.subtitle')}
        actionComponent={
          <Stack gap={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Chip
              variant="outlined"
              label={t(`kepCover.status.${summary.status}`)}
              color={summary.status === 'active' ? 'warning' : 'neutral'}
            />
            <Typography variant="body2" color="text.secondary">
              {t(
                summary.status === 'active' ? 'kepCover.hero.endsAt' : 'kepCover.hero.finishedAt',
                { date: formatDateTime(summary.endTime, 'compactDateTime') },
              )}
            </Typography>
          </Stack>
        }
      />
      <Stack gap={4} sx={{ p: 'var(--kep-content-inset)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
          <Typography variant="body2">
            {t('kepCover.hero.entries', { count: summary.totalEntries })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser
              ? t('kepCover.hero.remainingVotes', {
                  count: summary.remainingVotes,
                  total: summary.maxVoteCount,
                })
              : t('kepCover.hero.signInToVote')}
          </Typography>
        </Stack>
        {!summary.isVotingOpen && <Alert color="info">{t('kepCover.hero.readOnly')}</Alert>}
        <Stack gap={2}>
          <Typography component="h2" variant="h5">
            {t('kepCover.topEntries')}
          </Typography>
          {summary.topEntries.length ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {summary.topEntries.map((entry, index) => renderEntry(entry, index, 'top-'))}
            </Box>
          ) : (
            <EmptyState
              compact
              title={t(
                summary.totalEntries ? 'kepCover.empty.topEntries' : 'kepCover.empty.entries',
              )}
            />
          )}
        </Stack>
        <Stack gap={2}>
          <Typography component="h2" variant="h5">
            {t('kepCover.allEntries')}
          </Typography>
          {entriesError ? (
            <Alert
              severity="error"
              action={<Button onClick={() => void mutateEntries()}>{t('common.retry')}</Button>}
            >
              {t('common.loadFailed')}
            </Alert>
          ) : isEntriesLoading && !entriesPage ? (
            <Skeleton variant="rectangular" height={320} />
          ) : entries.length ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {entries.map((entry, index) => renderEntry(entry, index, 'all-'))}
            </Box>
          ) : (
            <EmptyState compact title={t('kepCover.empty.entries')} />
          )}
          <Box ref={sentinelRef} sx={{ height: 1 }} />
          {hasMore && (
            <Button
              loading={isLoadingMore}
              onClick={loadMore}
              variant="outlined"
              sx={{ alignSelf: 'center' }}
            >
              {t('kepCover.loadMore')}
            </Button>
          )}
        </Stack>
      </Stack>
    </FramedPage>
  );
};
export default KepCoverPage;
