import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, LinearProgress, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useProblemsRatingPage } from 'modules/problems/application/hooks/useProblemsRatingPage';
import { difficultyOptions } from 'modules/problems/config/difficulty';
import ProblemsRatingDataGrid from 'modules/problems/ui/shared/components/ProblemsRatingDataGrid';
import KepIcon from 'shared/components/base/KepIcon';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProblemsRatingPagePeriodRatings from './ProblemsRatingPagePeriodRatings.tsx';

const ProblemsRatingPage = () => {
  const {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    isValidating,
    sortModel,
    rows,
    rowCount,
    handleSortModelChange,
  } = useProblemsRatingPage();

  const { t } = useTranslation();

  const labels = useMemo(
    () => ({
      rank: t('problems.rating.columns.rank'),
      user: t('problems.rating.columns.user'),
      rating: t('problems.rating.columns.rating'),
      solved: t('problems.rating.columns.solved'),
      difficulties: Object.fromEntries(
        difficultyOptions.map((option) => [option.key, t(option.label)]),
      ) as Record<(typeof difficultyOptions)[number]['key'], string>,
      emptyValue: t('problems.rating.emptyValue'),
    }),
    [t],
  );

  return (
    <FramedPage>
      <PageHeader
        title={t('problems.rating.title')}
        backTo={resources.Problems}
        actionComponent={
          <Button
            component={RouterLink}
            to={resources.ProblemsRatingHistory}
            variant="text"
            startIcon={<KepIcon name="ranking" fontSize={18} />}
          >
            {t('problems.ratingHistory.title')}
          </Button>
        }
      />

      {isLoading || isValidating ? <LinearProgress /> : null}
      <Stack direction="column" spacing={2} sx={{ minWidth: 0 }}>
        <ProblemsRatingDataGrid
          rows={rows}
          rowCount={rowCount}
          loading={isLoading || isValidating}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          labels={labels}
          currentUsername={currentUser?.username}
        />

        <ProblemsRatingPagePeriodRatings />
      </Stack>
    </FramedPage>
  );
};

export default ProblemsRatingPage;
