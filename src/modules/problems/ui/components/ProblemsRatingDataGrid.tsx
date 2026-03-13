import { Stack, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { difficultyColorByKey, difficultyOptions } from '../../config/difficulty';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';

export type ProblemsRatingDataGridLabels = {
  rank: string;
  user: string;
  rating: string;
  solved: string;
  difficulties: Record<(typeof difficultyOptions)[number]['key'], string>;
  emptyValue: string;
};

interface ProblemsRatingDataGridProps {
  rows: ProblemsRatingRow[];
  rowCount: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  labels: ProblemsRatingDataGridLabels;
}

const ProblemsRatingDataGrid = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  labels,
}: ProblemsRatingDataGridProps) => {
  const theme = useTheme();

  const renderDifficultyCell = (key: (typeof difficultyOptions)[number]['key']) => {
    const colorKey = difficultyColorByKey[key];
    const color = theme.palette[colorKey]?.main ?? theme.palette.primary.main;

    return ({ row }: { row: GridValidRowModel }) => {
      const value = (row as ProblemsRatingRow)[key];

      return (
        <Typography variant="body2" fontWeight={400} color={color}>
          {value ?? labels.emptyValue}
        </Typography>
      );
    };
  };

  const difficultyColumns: GridColDef<GridValidRowModel>[] = difficultyOptions.map((option) => ({
    field: option.key,
    headerName: labels.difficulties[option.key],
    sortable: true,
    headerAlign: 'right',
    align: 'right',
    renderCell: renderDifficultyCell(option.key),
  }));

  const columns: GridColDef<GridValidRowModel>[] = [
    {
      field: 'rowIndex',
      headerName: labels.rank,
      width: 90,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="subtitle2" fontWeight={800} color="primary">
          #{(row as ProblemsRatingRow).rowIndex}
        </Typography>
      ),
    },
    {
      field: 'user',
      headerName: labels.user,
      flex: 1.4,
      minWidth: 160,
      sortable: false,
      renderHeader: (params) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            {params.colDef.headerName}
          </Typography>
        </Stack>
      ),
      renderCell: ({ row }) => {
        const ratingRow = row as ProblemsRatingRow;
        return (
          <UserPopover username={ratingRow.user.username}>
            <Stack direction="row" spacing={1}>
              <ContestsRatingChip title={ratingRow.user.ratingTitle} />
              <Typography fontWeight={500} noWrap>
                {ratingRow.user.username}
              </Typography>
            </Stack>
          </UserPopover>
        );
      },
    },
    ...difficultyColumns,
    {
      field: 'solved',
      headerName: labels.solved,
      minWidth: 130,
      flex: 0.5,
      sortable: true,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} color="success.main" sx={{ textAlign: 'right', width: '100%' }}>
          {(row as ProblemsRatingRow).solved ?? labels.emptyValue}
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: labels.rating,
      minWidth: 140,
      flex: 0.5,
      sortable: true,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} color="secondary.main" sx={{ textAlign: 'right', width: '100%' }}>
          {(row as ProblemsRatingRow).rating ?? labels.emptyValue}
        </Typography>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rowHeight={76}
      rows={rows}
      sortingOrder={['desc', 'asc', null]}
      rowCount={rowCount}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 20, 50]}
      paginationMode="server"
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      sortingMode="server"
      columns={columns}
      disableRowSelectionOnClick
      getRowId={(row) => `${(row as ProblemsRatingRow).user.username}-${(row as ProblemsRatingRow).rowIndex}`}
      disableColumnMenu
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
        },
        '& .MuiDataGrid-cell': {
          outline: 'none',
        },
        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
          py: 1,
        },
      }}
    />
  );
};

export default ProblemsRatingDataGrid;
