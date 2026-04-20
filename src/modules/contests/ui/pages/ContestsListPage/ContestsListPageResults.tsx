import { Box, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import ContestCard from 'modules/contests/ui/shared/components/ContestCard';

interface ContestsListPageResultsProps {
  contests: ContestListItem[];
  isLoading: boolean;
  showEmptyState: boolean;
  page?: number;
  pagesCount?: number;
  skeletonCount: number;
  onPageChange: (value: number) => void;
}

const ContestsListPageResults = ({
  contests,
  isLoading,
  showEmptyState,
  page = 1,
  pagesCount = 0,
  skeletonCount,
  onPageChange,
}: ContestsListPageResultsProps) => {
  const { t } = useTranslation();

  if (showEmptyState) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {t('contests.emptyTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('contests.emptySubtitle')}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack direction="column" spacing={3}>
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <Grid size={{ xs: 12 }} key={idx}>
                <Skeleton variant="rounded" height={400} />
              </Grid>
            ))
          : contests.map((contest) => (
              <Grid size={{ xs: 12 }} key={contest.id}>
                <ContestCard contest={contest} />
              </Grid>
            ))}
      </Grid>

      {pagesCount > 1 ? (
        <Stack direction="row" justifyContent="center">
          <Pagination
            count={pagesCount}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ContestsListPageResults;
