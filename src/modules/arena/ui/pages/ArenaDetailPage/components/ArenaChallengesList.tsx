import { useTranslation } from 'react-i18next';
import { Box, Paper, Skeleton, Stack } from '@mui/material';
import { mapArenaChallengeToChallenge } from 'modules/arena/application/arena-challenge-preview';
import { PageResult } from 'modules/arena/domain/contracts/arena.repository';
import { ArenaChallenge } from 'modules/arena/domain/entities/arena-challenge.entity';
import ChallengeCard from 'modules/challenges/ui/shared/components/ChallengeCard';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

interface ChallengesListProps {
  data?: PageResult<ArenaChallenge>;
  loading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  titleKey?: string;
  emptyKey?: string;
  currentUsername?: string;
  showPagination?: boolean;
}
const ArenaChallengesList = ({
  data,
  loading,
  page,
  onPageChange,
  titleKey = 'arena.challenges',
  emptyKey = 'arena.noChallenges',
  currentUsername,
  showPagination = true,
}: ChallengesListProps) => {
  const { t } = useTranslation();
  const challenges = data?.data?.map(mapArenaChallengeToChallenge) ?? [];
  return (
    <Paper component="section" variant="section">
      <SectionHeader
        title={t(titleKey)}
        action={<PatternArtwork kind="battles" sx={{ width: 64 }} />}
      />
      <Box sx={{ px: 'var(--kep-content-inset)' }}>
        {loading ? (
          Array.from({ length: 10 }, (_, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              gap={2}
              sx={{ height: 72, borderBottom: 1, borderColor: 'divider' }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="70%" sx={{ ml: 'auto' }} />
                <Skeleton width="45%" sx={{ ml: 'auto' }} />
              </Box>
              <Skeleton width={60} height={32} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="70%" />
                <Skeleton width="45%" />
              </Box>
              <Skeleton variant="circular" width={32} height={32} />
            </Stack>
          ))
        ) : challenges.length ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              currentUsername={currentUsername}
            />
          ))
        ) : (
          <EmptyState compact kind="battles" title={t(emptyKey)} />
        )}
      </Box>
      {showPagination && Boolean(data?.pagesCount && data.pagesCount > 1) && (
        <ListPagination count={data!.pagesCount} page={page} onChange={onPageChange} />
      )}
    </Paper>
  );
};
export default ArenaChallengesList;
