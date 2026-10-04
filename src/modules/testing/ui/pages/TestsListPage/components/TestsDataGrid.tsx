import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Chip, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { getDataGridNoRowsOverlaySlotProps } from 'shared/components/common/DataGridNoRowsOverlay';

interface TestsDataGridProps {
  tests: Test[];
  showChapter?: boolean;
  isFiltered?: boolean;
  completion?: Record<number, boolean>;
}

const getQuestionCount = (test: Test) => test.questionsCount ?? test.questions?.length ?? 0;

const getDurationSeconds = (duration: string) => {
  const parts = duration.split(':').map(Number);
  return parts.length === 3 && parts.every(Number.isFinite)
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : 0;
};

const TestsDataGrid = ({
  tests,
  showChapter = false,
  isFiltered = false,
  completion,
}: TestsDataGridProps) => {
  const { t } = useTranslation();
  const { up } = useBreakpoints();
  const desktop = up('md');
  const showIcon = up('sm');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    setPaginationModel((previous) => ({ ...previous, page: 0 }));
    setSortModel([]);
  }, [tests]);

  const getRowHeight = useCallback(() => 'auto' as const, []);
  const getEstimatedRowHeight = useCallback(() => (desktop ? 72 : 112), [desktop]);

  const columns = useMemo<GridColDef<Test>[]>(() => {
    const formatDuration = (test: Test) => {
      const seconds = getDurationSeconds(test.duration);
      return seconds > 0
        ? seconds % 60 === 0
          ? t('tests.durationMinutes', { count: seconds / 60 })
          : t('tests.durationSeconds', { count: seconds })
        : test.duration || '—';
    };

    const renderDifficulty = (test: Test) => (
      <Chip
        size="small"
        variant="soft"
        color={
          test.difficulty === 1
            ? 'success'
            : test.difficulty === 2
              ? 'warning'
              : test.difficulty === 3
                ? 'error'
                : 'neutral'
        }
        label={test.difficultyTitle || t('tests.difficulty')}
        sx={{ height: 24, fontWeight: 500 }}
      />
    );

    const renderScore = (test: Test, compact = false) => {
      const questionCount = getQuestionCount(test);
      const result = test.userBestResult ?? 0;
      const perfect = questionCount > 0 && result === questionCount;
      if (result <= 0 && !completion?.[test.id]) {
        return compact ? null : (
          <Tooltip title={t('tests.noScore')}>
            <Typography variant="body2" color="text.disabled">
              —
            </Typography>
          </Tooltip>
        );
      }

      return (
        <Stack direction="row" spacing={0.5} alignItems="center">
          {perfect && (
            <IconifyIcon
              icon="material-symbols:check-rounded"
              fontSize={14}
              sx={{ color: 'success.main' }}
            />
          )}
          <Typography
            variant={compact ? 'caption' : 'body2'}
            fontWeight={500}
            color="text.primary"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {result}
            <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>
              /{questionCount}
            </Box>
          </Typography>
        </Stack>
      );
    };

    return [
      {
        field: 'title',
        headerName: t('tests.testName'),
        flex: 1,
        minWidth: desktop ? 220 : 0,
        renderCell: ({ row, tabIndex }) => (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: 1, minWidth: 0, whiteSpace: 'normal' }}
          >
            {showIcon && (
              <Avatar
                src={showChapter ? row.chapter.icon : undefined}
                alt=""
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  bgcolor: 'background.elevation1',
                  color: 'text.secondary',
                  '& img': { objectFit: 'contain', width: 28, height: 28 },
                }}
              >
                <IconifyIcon icon="material-symbols:assignment-outline-rounded" fontSize={20} />
              </Avatar>
            )}
            <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Link
                component={RouterLink}
                to={getResourceById(resources.Test, row.id)}
                tabIndex={tabIndex}
                color="text.primary"
                underline="hover"
                variant="body1"
                data-test-title
                sx={{ fontWeight: 500, lineHeight: 1.5, overflowWrap: 'anywhere' }}
              >
                {row.title}
              </Link>
              {showChapter && (
                <Typography variant="caption" color="text.secondary">
                  {row.chapter.title}
                </Typography>
              )}
              {!desktop && (
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Typography variant="caption" color="text.secondary">
                    {t('tests.questionsCount', { count: getQuestionCount(row) })}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconifyIcon
                      icon="material-symbols:schedule-rounded"
                      fontSize={14}
                      sx={{ color: 'text.secondary' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(row)}
                    </Typography>
                  </Stack>
                  {renderDifficulty(row)}
                  {renderScore(row, true)}
                </Stack>
              )}
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'questionsCount',
        headerName: t('tests.questions'),
        type: 'number',
        width: 108,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (_value, row) => getQuestionCount(row),
      },
      {
        field: 'duration',
        headerName: t('tests.durationLabel'),
        width: 112,
        type: 'number',
        headerAlign: 'left',
        align: 'left',
        valueGetter: (_value, row) => getDurationSeconds(row.duration),
        renderCell: ({ row }) => formatDuration(row),
      },
      {
        field: 'difficulty',
        headerName: t('tests.difficulty'),
        width: 116,
        type: 'number',
        headerAlign: 'left',
        align: 'left',
        renderCell: ({ row }) => renderDifficulty(row),
      },
      {
        field: 'userBestResult',
        headerName: t('tests.resultsColumns.score'),
        width: 104,
        type: 'number',
        align: 'right',
        headerAlign: 'right',
        valueGetter: (_value, row) => row.userBestResult ?? 0,
        renderCell: ({ row }) => renderScore(row),
      },
      {
        field: 'details',
        headerName: '',
        description: t('tests.viewDetails'),
        width: 52,
        minWidth: 52,
        maxWidth: 52,
        sortable: false,
        filterable: false,
        align: 'center',
        cellClassName: 'tests-details-cell',
        renderCell: ({ row, tabIndex }) => (
          <IconButton
            component={RouterLink}
            to={getResourceById(resources.Test, row.id)}
            tabIndex={tabIndex}
            aria-label={t('tests.viewTest', { title: row.title })}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <IconifyIcon icon="material-symbols:chevron-right-rounded" fontSize={22} />
          </IconButton>
        ),
      },
    ];
  }, [desktop, showIcon, showChapter, completion, t]);

  return (
    <DataGrid
      autoHeight
      rows={tests}
      columns={columns}
      getRowHeight={getRowHeight}
      getEstimatedRowHeight={getEstimatedRowHeight}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 20, 50]}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      sortingOrder={['asc', 'desc', null]}
      columnVisibilityModel={{
        questionsCount: desktop,
        duration: desktop,
        difficulty: desktop,
        userBestResult: desktop,
      }}
      disableColumnFilter
      disableRowSelectionOnClick
      localeText={{ noRowsLabel: t(isFiltered ? 'tests.noMatches' : 'tests.emptyTitle') }}
      slotProps={getDataGridNoRowsOverlaySlotProps({
        filtered: isFiltered,
        description: t('tests.emptySubtitle'),
        filteredDescription: t('tests.noMatchesSubtitle'),
      })}
      aria-label={t('tests.title')}
      sx={{
        minWidth: 0,
        '& .MuiDataGrid-cell': { py: 1.5 },
        '& .MuiDataGrid-row .MuiDataGrid-cell.tests-details-cell': { px: 1 },
      }}
    />
  );
};

export default TestsDataGrid;
