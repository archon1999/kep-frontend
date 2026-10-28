import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { getRankColor } from 'app/theme/colors/medals';
import type { ProjectsRating } from 'modules/projects/domain/entities/projects-rating.types';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import { RouteDataGridListPagination } from 'shared/components/pagination/DataGridListPagination';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { createNumberFormatter } from 'shared/lib/numberFormat';

interface Props {
  rows: ProjectsRating[];
  total: number;
  loading: boolean;
  currentUsername?: string;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

const ProjectsRatingTable = ({ rows, total, loading, currentUsername, ...pagination }: Props) => {
  const { t } = useTranslation();
  const { down } = useBreakpoints();
  const compact = down('md');
  const formatter = createNumberFormatter({ maximumFractionDigits: 0 });
  const rowCount = useStableGridRowCount(total, loading);
  const columns: GridColDef<ProjectsRating>[] = [
    {
      field: 'rank',
      headerName: t('projects.rating.place'),
      width: compact ? 50 : 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography variant="metric" color={getRankColor(row.rank)} sx={{ fontSize: 20 }}>
          {row.rank === null ? '—' : String(row.rank).padStart(2, '0')}
        </Typography>
      ),
    },
    {
      field: 'username',
      headerName: t('projects.user'),
      flex: 1.4,
      minWidth: compact ? 140 : 240,
      renderCell: ({ row }) => (
        <UserPopover
          username={row.username}
          avatar={row.avatar}
          fullName={[row.firstName, row.lastName].filter(Boolean).join(' ')}
          sx={{ minWidth: 0, maxWidth: '100%' }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              src={row.avatar}
              alt=""
              sx={{ width: 32, height: 32, display: { xs: 'none', sm: 'flex' } }}
            />
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {row.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {compact
                  ? t('projects.rating.completedCount', { count: row.completedProjects })
                  : [row.firstName, row.lastName].filter(Boolean).join(' ')}
              </Typography>
            </Stack>
          </Stack>
        </UserPopover>
      ),
    },
    {
      field: 'rating',
      headerName: t('projects.rating.points'),
      width: compact ? 98 : 160,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography variant="metric" color="primary.main" sx={{ fontSize: compact ? 22 : 26 }}>
          {formatter.format(row.rating)}
        </Typography>
      ),
    },
    {
      field: 'completedProjects',
      headerName: t('projects.rating.completed'),
      flex: 1,
      minWidth: 175,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Typography variant="metric" sx={{ fontSize: 22 }}>
          {formatter.format(row.completedProjects)}
        </Typography>
      ),
    },
    {
      field: 'passedTasks',
      headerName: t('projects.rating.passedTasks'),
      flex: 1,
      minWidth: 165,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Typography variant="metric" sx={{ fontSize: 22 }}>
          {formatter.format(row.passedTasks)}
        </Typography>
      ),
    },
  ];

  return (
    <DataGrid
      className="kep-data-grid-section"
      autoHeight
      rows={rows}
      columns={columns.map((column) => ({ ...column, sortable: false }))}
      getRowId={(row) => row.username}
      getRowClassName={({ row }) =>
        row.username === currentUsername ? 'MuiDataGrid-row--currentUser' : ''
      }
      loading={loading}
      rowCount={rowCount}
      paginationMode="server"
      {...pagination}
      pageSizeOptions={[10, 20, 50]}
      columnVisibilityModel={{ completedProjects: !compact, passedTasks: !compact }}
      rowHeight={76}
      disableRowSelectionOnClick
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      slots={{ pagination: RouteDataGridListPagination }}
      localeText={{ noRowsLabel: t('projects.rating.emptyTitle') }}
      sx={{ border: 0, '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' } }}
    />
  );
};

export default ProjectsRatingTable;
