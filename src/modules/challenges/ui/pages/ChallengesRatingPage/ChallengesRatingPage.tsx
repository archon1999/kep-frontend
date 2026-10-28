import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useChallengesRatingPage } from 'modules/challenges/application/hooks/useChallengesRatingPage';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import ChallengesRatingPageTable, {
  ChallengesRatingPageRow,
} from './ChallengesRatingPageTable.tsx';

const ChallengesRatingPage = () => {
  const {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    handleSortModelChange,
    ratingPage,
    isLoading,
    error,
    retry,
    sortModel,
  } = useChallengesRatingPage();

  const { t } = useTranslation();

  const rows: ChallengesRatingPageRow[] = useMemo(
    () =>
      mergePinnedRows(ratingPage?.data ?? [], ratingPage?.pinnedRows, (row) => row.username).map(
        (row: ChallengeRatingRow) => ({
          id: row.username,
          ...row,
          record: t('challenges.record', {
            wins: row.wins ?? 0,
            draws: row.draws ?? 0,
            losses: row.losses ?? 0,
          }),
        }),
      ),
    [ratingPage?.data, ratingPage?.pinnedRows, t],
  );

  return (
    <FramedPage>
      <PageHeader
        title={t('challenges.ratingTitle')}
        subtitle={t('challenges.ratingSubtitle')}
        backTo={resources.Challenges}
      />

      {error && (
        <Alert
          severity="error"
          sx={{ m: 'var(--kep-content-inset)' }}
          action={
            <Button onClick={retry} color="inherit">
              {t('common.retry')}
            </Button>
          }
        >
          {t('common.loadFailed')}
        </Alert>
      )}
      <Box sx={{ minWidth: 0 }}>
        <ChallengesRatingPageTable
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          paginationModel={paginationModel}
          sortModel={sortModel}
          loading={isLoading}
          onPaginationModelChange={onPaginationModelChange}
          currentUsername={currentUser?.username}
          onSortModelChange={handleSortModelChange}
        />
      </Box>
    </FramedPage>
  );
};

export default ChallengesRatingPage;
