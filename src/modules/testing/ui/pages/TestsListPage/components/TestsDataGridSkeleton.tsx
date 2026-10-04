import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridFooterContainer } from '@mui/x-data-grid';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';

interface TestsDataGridSkeletonProps {
  showChapter?: boolean;
}

const rows = Array.from({ length: 8 }, (_, id) => ({ id }));

const GridSkeletonFooter = () => (
  <GridFooterContainer sx={{ minHeight: 64, px: { xs: 2, sm: 3 }, py: 1.5 }}>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={2}
      sx={{ width: 1, flexWrap: 'wrap' }}
    >
      <Skeleton width={120} height={20} sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Skeleton variant="rounded" width={46} height={32} />
      <Skeleton width={84} height={20} sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Stack direction="row" gap={1}>
        <Skeleton variant="rounded" width={32} height={32} />
        <Skeleton variant="rounded" width={32} height={32} />
      </Stack>
    </Stack>
  </GridFooterContainer>
);

const TestsDataGridSkeleton = ({ showChapter = false }: TestsDataGridSkeletonProps) => {
  const { t } = useTranslation();
  const { up } = useBreakpoints();
  const desktop = up('md');
  const showIcon = up('sm');
  const getRowHeight = useCallback(() => 'auto' as const, []);
  const getEstimatedRowHeight = useCallback(() => (desktop ? 72 : 112), [desktop]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'title',
        headerName: t('tests.testName'),
        flex: 1,
        minWidth: desktop ? 220 : 0,
        sortable: false,
        renderCell: () => (
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            sx={{ width: 1, minWidth: 0, minHeight: desktop ? 48 : 88 }}
          >
            {showIcon && (
              <Skeleton variant="rounded" width={40} height={40} sx={{ flexShrink: 0 }} />
            )}
            <Stack gap={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Skeleton width="75%" height={24} />
              {showChapter && <Skeleton width="45%" height={18} />}
              {!desktop && (
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Skeleton width={64} height={18} />
                  <Skeleton width={54} height={18} />
                  <Skeleton variant="rounded" width={64} height={24} />
                </Stack>
              )}
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'questionsCount',
        headerName: t('tests.questions'),
        width: 108,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: () => <Skeleton width={24} height={20} />,
      },
      {
        field: 'duration',
        headerName: t('tests.durationLabel'),
        width: 112,
        sortable: false,
        renderCell: () => <Skeleton width={56} height={20} />,
      },
      {
        field: 'difficulty',
        headerName: t('tests.difficulty'),
        width: 116,
        sortable: false,
        renderCell: () => <Skeleton variant="rounded" width={64} height={24} />,
      },
      {
        field: 'userBestResult',
        headerName: t('tests.resultsColumns.score'),
        width: 104,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        renderCell: () => <Skeleton width={38} height={20} />,
      },
      {
        field: 'details',
        headerName: '',
        width: 52,
        minWidth: 52,
        maxWidth: 52,
        sortable: false,
        align: 'center',
        cellClassName: 'tests-details-cell',
        renderCell: () => <Skeleton variant="circular" width={22} height={22} />,
      },
    ],
    [desktop, showIcon, showChapter, t],
  );

  return (
    <DataGrid
      autoHeight
      aria-hidden="true"
      rows={rows}
      columns={columns}
      getRowHeight={getRowHeight}
      getEstimatedRowHeight={getEstimatedRowHeight}
      columnVisibilityModel={{
        questionsCount: desktop,
        duration: desktop,
        difficulty: desktop,
        userBestResult: desktop,
      }}
      slots={{ footer: GridSkeletonFooter }}
      disableColumnFilter
      disableColumnMenu
      disableRowSelectionOnClick
      sx={{
        minWidth: 0,
        pointerEvents: 'none',
        '& .MuiDataGrid-cell': { py: 1.5 },
        '& .MuiDataGrid-row .MuiDataGrid-cell.tests-details-cell': { px: 1 },
      }}
    />
  );
};

export default TestsDataGridSkeleton;
