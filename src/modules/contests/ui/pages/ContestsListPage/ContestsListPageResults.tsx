import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Stack } from '@mui/material';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import EmptyState from 'shared/components/common/EmptyState';
import { RouteListPagination } from 'shared/components/sections/common/FramedListPage';
import ContestListCard from './components/ContestListCard';
import ContestListCardSkeleton from './components/ContestListCardSkeleton';

interface ContestsListPageResultsProps {
  contests: ContestListItem[];
  isLoading: boolean;
  hasError: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
  page?: number;
  pagesCount?: number;
  skeletonCount: number;
  onPageChange: (value: number) => void;
}

const ContestsListPageResults = ({
  contests,
  isLoading,
  hasError,
  hasActiveFilters,
  onClearFilters,
  onRetry,
  page = 1,
  pagesCount = 0,
  skeletonCount,
  onPageChange,
}: ContestsListPageResultsProps) => {
  const { t } = useTranslation();

  if (hasError) {
    return (
      <Box role="alert">
        <EmptyState
          kind="error"
          title={t('common.loadFailed')}
          action={
            <Button variant="outlined" onClick={onRetry}>
              {t('common.retry')}
            </Button>
          }
        />
      </Box>
    );
  }

  if (!isLoading && contests.length === 0) {
    return (
      <EmptyState
        kind={hasActiveFilters ? 'search' : 'competitions'}
        title={t(hasActiveFilters ? 'contests.filteredEmptyTitle' : 'contests.emptyTitle')}
        description={t(
          hasActiveFilters ? 'contests.filteredEmptySubtitle' : 'contests.emptySubtitle',
        )}
        action={
          hasActiveFilters ? (
            <Button variant="outlined" onClick={onClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          ) : undefined
        }
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      />
    );
  }

  return (
    <Stack direction="column" spacing={0}>
      <Grid container spacing={0}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <Grid size={{ xs: 12 }} key={idx}>
                <ContestListCardSkeleton />
              </Grid>
            ))
          : contests.map((contest) => (
              <Grid size={{ xs: 12 }} key={contest.id}>
                <ContestListCard contest={contest} />
              </Grid>
            ))}
      </Grid>

      <RouteListPagination count={pagesCount} page={page} onChange={onPageChange} />
    </Stack>
  );
};

export default ContestsListPageResults;
