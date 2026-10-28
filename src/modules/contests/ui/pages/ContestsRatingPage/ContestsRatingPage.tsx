import { useTranslation } from 'react-i18next';
import { LinearProgress, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useContestsRatingPage } from 'modules/contests/application/hooks/useContestsRatingPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ContestsRatingPageTable from './ContestsRatingPageTable.tsx';

const ContestsRatingPage = () => {
  const {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    ratingPage,
    isLoading,
    sortModel,
    rows,
    handleSortModelChange,
  } = useContestsRatingPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader title={t('contests.rating.title')} backTo={resources.Contests} />

      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {isLoading ? <LinearProgress /> : null}

        <ContestsRatingPageTable
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          currentUsername={currentUser?.username}
        />
      </Stack>
    </FramedPage>
  );
};

export default ContestsRatingPage;
