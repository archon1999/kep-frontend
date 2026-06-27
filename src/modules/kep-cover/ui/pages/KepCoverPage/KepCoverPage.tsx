import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { formatDateTime } from 'shared/lib/dateTime';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { kepCoverQueries, useKepCoverEntries, useKepCoverSummary } from 'modules/kep-cover/application/queries';
import KepCoverEntryCard from './components/KepCoverEntryCard';

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

const KepCoverPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { data: summary, isLoading: isSummaryLoading, mutate: mutateSummary } = useKepCoverSummary();
  const {
    data: entriesPage,
    isLoading: isEntriesLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate: mutateEntries,
  } = useKepCoverEntries(12);
  const [votingEntryId, setVotingEntryId] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useDocumentTitle('pageTitles.kepCover', {
    contestTitle: summary?.title || t('kepCover.fallbackTitle'),
  });

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

  if (isSummaryLoading && !summary) {
    return (
      <Stack spacing={3} sx={responsivePagePaddingSx}>
        <Skeleton variant="rounded" height={240} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    );
  }

  if (!summary || summary.status === 'empty' || !summary.id) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={1.5}>
            <Typography variant="h4" fontWeight={800}>
              {t('kepCover.empty.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('kepCover.empty.subtitle')}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <Paper
        sx={(theme) => ({
          overflow: 'hidden',
          position: 'relative',
          p: { xs: 3, md: 5 },
          background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.16)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.1)})`,
        })}
      >
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at top left, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.22)}, transparent 38%), radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)}, transparent 35%)`,
            pointerEvents: 'none',
          })}
        />

        <Stack spacing={2} sx={{ position: 'relative' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label={t(`kepCover.status.${summary.status}`)}
                  color={summary.status === 'active' ? 'warning' : 'default'}
                />
                <Typography variant="body2" color="text.secondary">
                  {summary.status === 'active'
                    ? t('kepCover.hero.endsAt', {
                        date: formatDateTime(summary.endTime, 'compactDateTime'),
                      })
                    : t('kepCover.hero.finishedAt', {
                        date: formatDateTime(summary.endTime, 'compactDateTime'),
                      })}
                </Typography>
              </Stack>

              <Typography variant="h3" fontWeight={900}>
                {summary.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('kepCover.hero.subtitle')}
              </Typography>
            </Stack>

            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                {t('kepCover.hero.entries', { count: summary.totalEntries })}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {currentUser
                  ? t('kepCover.hero.remainingVotes', {
                      count: summary.remainingVotes,
                      total: summary.maxVoteCount,
                    })
                  : t('kepCover.hero.signInToVote')}
              </Typography>
            </Stack>
          </Stack>

          {!summary.isVotingOpen ? <Alert color="info">{t('kepCover.hero.readOnly')}</Alert> : null}
        </Stack>
      </Paper>

      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={800}>
          {t('kepCover.topEntries')}
        </Typography>
        {summary.topEntries.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {summary.topEntries.map((entry, index) => (
              <KepCoverEntryCard
                key={`top-${entry.id}`}
                entry={entry}
                rank={index + 1}
                isVotingOpen={summary.isVotingOpen}
                canVote={summary.canVote || entry.isLiked}
                isVoting={votingEntryId === entry.id}
                onVote={handleVote}
                loginRequired={!currentUser}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('kepCover.empty.entries')}
          </Typography>
        )}
      </Stack>

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={800}>
            {t('kepCover.allEntries')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('kepCover.hero.entries', { count: summary.totalEntries })}
          </Typography>
        </Stack>

        {isEntriesLoading && !entriesPage ? (
          <Box
            sx={{
              gap: 2,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={320} />
            ))}
          </Box>
        ) : entries.length > 0 ? (
          <>
            <Stack spacing={2}>
              {entries.map((entry, index) => (
                <KepCoverEntryCard
                  key={entry.id}
                  entry={entry}
                  rank={index + 1}
                  isVotingOpen={summary.isVotingOpen}
                  canVote={summary.canVote || entry.isLiked}
                  isVoting={votingEntryId === entry.id}
                  onVote={handleVote}
                  loginRequired={!currentUser}
                />
              ))}
            </Stack>

            <Box ref={sentinelRef} sx={{ height: 1 }} />

            {hasMore ? (
              <Button loading={isLoadingMore} onClick={loadMore} variant="outlined">
                {t('kepCover.loadMore')}
              </Button>
            ) : null}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('kepCover.empty.entries')}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default KepCoverPage;
