import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import { useChallengesRating } from 'modules/challenges/application/queries.ts';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ChallengesRatingPageTable, {
  ChallengesRatingPageRow,
} from './ChallengesRatingPageTable.tsx';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    initialPageSize: 10,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state, setField } = useRouteQueryState({
    defaults: {
      ordering: '-rating',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });

  const sortModel = useMemo<GridSortModel>(() => {
    const ordering = state.ordering || '-rating';
    const isDescending = ordering.startsWith('-');
    const field = isDescending ? ordering.slice(1) : ordering;

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const ordering = state.ordering || '-rating';
  const { data: ratingPage, isLoading } = useChallengesRating({ page, pageSize, ordering });

  const rows: ChallengesRatingPageRow[] = (ratingPage?.data ?? []).map(
    (row: ChallengeRatingRow, index) => ({
      id: row.username,
      ...row,
      rowIndex: (page - 1) * pageSize + index + 1,
      record: t('challenges.record', {
        wins: row.wins ?? 0,
        draws: row.draws ?? 0,
        losses: row.losses ?? 0,
      }),
    }),
  );

  return (
    <Stack direction="column">
      <PageHeader
        title={t('challenges.ratingTitle')}
        breadcrumb={[
          { label: t('challenges.title'), url: resources.Challenges },
          { label: t('problems.rating.ordering.rating'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <ChallengesRatingPageTable
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          paginationModel={paginationModel}
          sortModel={sortModel}
          loading={isLoading}
          onPaginationModelChange={onPaginationModelChange}
          onSortModelChange={(model) => {
            const currentSort = model[0];

            if (!currentSort) {
              setField('ordering', '-rating');
              return;
            }

            const prefix = currentSort.sort === 'asc' ? '' : '-';
            setField('ordering', `${prefix}${currentSort.field}`);
          }}
        />
      </Box>
    </Stack>
  );
};

export default ChallengesRatingPage;
