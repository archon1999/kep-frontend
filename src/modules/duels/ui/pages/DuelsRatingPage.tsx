import { useMemo, useState } from 'react';
import { Avatar, Box, Card, CardContent, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils.ts';
import { useDuelsRating } from '../../application/queries.ts';

const orderingFieldMap: Record<string, string> = {
  duels: 'duels',
  wins: 'wins',
  draws: 'draws',
  losses: 'losses',
};

const DuelsRatingPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({ initialPageSize: 12 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'wins', sort: 'desc' }]);

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];
    if (!currentSort) return '-wins';

    const orderingField = orderingFieldMap[currentSort.field] ?? 'wins';
    const prefix = currentSort.sort === 'asc' ? '' : '-';
    return `${prefix}${orderingField}`;
  }, [sortModel]);

  const { data: ratingPage, isLoading } = useDuelsRating({ page, pageSize, ordering });

  type RatingRow = GridValidRowModel & {
    username: string;
    avatar?: string;
    contestsRating?: number;
    contestsRatingTitle?: string;
    duels: number;
    wins: number;
    draws: number;
    losses: number;
    rowIndex: number;
  };

  const rows: RatingRow[] =
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

  const summary = useMemo(() => {
    const pageDuels = rows.reduce((sum, row) => sum + row.duels, 0);
    const pageWins = rows.reduce((sum, row) => sum + row.wins, 0);
    const ratedUsers = rows.filter((row) => typeof row.contestsRating === 'number');
    const averageContestRating = ratedUsers.length
      ? Math.round(
          ratedUsers.reduce((sum, row) => sum + (row.contestsRating ?? 0), 0) / ratedUsers.length,
        )
      : 0;

    return {
      rankedPlayers: ratingPage?.total ?? 0,
      pageDuels,
      pageWins,
      averageContestRating,
    };
  }, [ratingPage?.total, rows]);

  const columns: GridColDef<RatingRow>[] = useMemo(
    () => [
      {
        field: 'rowIndex',
        headerName: t('duels.table.place'),
        width: 88,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: ({ value }) => (
          <Typography variant="subtitle1" fontWeight={900}>
            #{value}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('duels.table.username'),
        flex: 1.2,
        minWidth: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <UserPopover username={row.username} avatar={row.avatar}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={row.avatar} alt={row.username} sx={{ width: 42, height: 42 }} />
              <Stack spacing={0.15} sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={800} noWrap>
                  {row.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {t('duels.record', {
                    wins: row.wins,
                    draws: row.draws,
                    losses: row.losses,
                  })}
                </Typography>
              </Stack>
            </Stack>
          </UserPopover>
        ),
      },
      {
        field: 'contestsRating',
        headerName: t('duels.table.contestsRating'),
        flex: 1,
        minWidth: 200,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <ContestsRatingChip title={row.contestsRatingTitle} imgSize={26} />
            <Stack spacing={0.1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={800}>
                {row.contestsRating ?? '—'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
                noWrap
              >
                {row.contestsRatingTitle ?? '—'}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'duels',
        headerName: t('duels.table.duels'),
        flex: 0.6,
        minWidth: 110,
        sortable: true,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ value }) => (
          <Typography variant="subtitle2" fontWeight={800}>
            {value ?? 0}
          </Typography>
        ),
      },
      {
        field: 'wins',
        headerName: t('duels.table.wins'),
        flex: 0.5,
        minWidth: 92,
        sortable: true,
      },
      {
        field: 'draws',
        headerName: t('duels.table.draws'),
        flex: 0.5,
        minWidth: 92,
        sortable: true,
      },
      {
        field: 'losses',
        headerName: t('duels.table.losses'),
        flex: 0.5,
        minWidth: 100,
        sortable: true,
      },
    ],
    [t],
  );

  const summaryCards = [
    {
      label: t('duels.ratingTitle'),
      value: summary.rankedPlayers,
      icon: 'mdi:account-group-outline',
      color: theme.vars.palette.primary.mainChannel,
    },
    {
      label: t('duels.table.duels'),
      value: summary.pageDuels,
      icon: 'mdi:sword-cross',
      color: theme.vars.palette.success.mainChannel,
    },
    {
      label: t('duels.table.contestsRating'),
      value: summary.averageContestRating || '—',
      icon: 'mdi:podium-gold',
      color: theme.vars.palette.warning.mainChannel,
    },
  ];

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
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {summaryCards.map((item) => (
              <Grid key={item.label} size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: cssVarRgba(item.color, 0.2),
                    background: `linear-gradient(145deg, ${cssVarRgba(item.color, 0.12)}, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.96)})`,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.6}>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={900}>
                          {item.value}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: cssVarRgba(item.color, 0.14),
                        }}
                      >
                        <IconifyIcon icon={item.icon} sx={{ fontSize: 22, color: cssVarRgba(item.color, 1) }} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14),
            }}
          >
            {isLoading ? <LinearProgress /> : null}
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              loading={isLoading}
              rows={rows}
              columns={columns}
              rowCount={ratingPage?.total ?? rows.length}
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              paginationMode="server"
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={(model) =>
                setSortModel(model.length ? [model[0]] : [{ field: 'wins', sort: 'desc' }])
              }
              pageSizeOptions={[12]}
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              getRowHeight={() => 78}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.default',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 800,
                },
                '& .MuiDataGrid-cell': {
                  py: 1.5,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
};

export default DuelsRatingPage;
