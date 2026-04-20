import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDuelsRating } from 'modules/duels/application/queries.ts';
import DuelsRatingPageTable, {
  DuelsRatingPageTableRow,
} from './DuelsRatingPageTable.tsx';

const DuelsRatingPage = () => {
  const { t } = useTranslation();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    initialPageSize: 12,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state } = useRouteQueryState({
    defaults: {
      ordering: '-wins',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });

  const ordering = state.ordering || '-wins';
  const { data: ratingPage, isLoading } = useDuelsRating({ page, pageSize, ordering });

  const rows: DuelsRatingPageTableRow[] =
    ratingPage?.data?.map((row, index) => ({
      id: `${row.user.username}-${index}`,
      username: row.user.username,
      avatar: row.user.avatar,
      contestsRating: row.user.contestsRating,
      contestsRatingTitle: row.user.contestsRatingTitle,
      duels: row.duels ?? 0,
      wins: row.wins ?? 0,
      draws: row.draws ?? 0,
      losses: row.losses ?? 0,
      rowIndex: row.rowIndex ?? (page - 1) * pageSize + index + 1,
    })) ?? [];

  return (
    <Stack direction="column">
      <PageHeader
        title={t('duels.ratingTitle')}
        breadcrumb={[
          { label: t('duels.title'), url: resources.Duels },
          { label: t('duels.ratingTitle'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <DuelsRatingPageTable
          rows={rows}
          total={ratingPage?.total ?? rows.length}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
        />
      </Box>
    </Stack>
  );
};

export default DuelsRatingPage;
