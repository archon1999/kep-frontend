import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import type { ContestStandingsPageModel } from 'modules/contests/application/hooks/useContestStandingsPage';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import {
  contestantMatchesUsername,
  getStandingsRowId,
  normalizeUsername,
} from 'modules/contests/domain/utils/standings';
import { formatContestPoints, isAcmStyle } from 'modules/contests/ui/shared/utils/contestType';
import { getDataGridNoRowsOverlaySlotProps } from 'shared/components/common/DataGridNoRowsOverlay';
import DataGridListPagination from 'shared/components/pagination/DataGridListPagination';
import { useContestStandingsColumns } from './useContestStandingsColumns';

type Props = Pick<
  ContestStandingsPageModel,
  | 'contest'
  | 'contestId'
  | 'contestProblems'
  | 'contestants'
  | 'total'
  | 'isLoading'
  | 'paginationModel'
  | 'onPaginationModelChange'
  | 'currentUsername'
  | 'participantTarget'
  | 'participantUsername'
  | 'standingsPage'
  | 'activeFiltersCount'
> & { onContestantClick: (contestant: ContestantEntity) => void };
const ContestStandingsTable = ({
  contest,
  contestId,
  contestProblems,
  contestants,
  total,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  currentUsername,
  participantTarget,
  participantUsername,
  standingsPage,
  activeFiltersCount,
  onContestantClick,
}: Props) => {
  const { t } = useTranslation();
  const dataGridApiRef = useGridApiRef();
  const focusedParticipantRef = useRef<string | null>(null);
  const isCompactLayout = useMediaQuery('(max-width:600px)');
  const columns = useContestStandingsColumns({
    contest,
    contestId,
    contestProblems,
    isCompactLayout,
  });
  const acmScoreGroupRowClasses = useMemo(() => {
    const rowClasses = new Map<string, string>();

    if (!isAcmStyle(contest?.type)) {
      return rowClasses;
    }

    let lastPoints: string | null = null;
    let groupIndex = -1;

    contestants.forEach((contestant) => {
      if (contestant.rowType === 'upsolve') {
        return;
      }

      const points = formatContestPoints(contestant.points);
      if (points !== lastPoints) {
        groupIndex += 1;
        lastPoints = points;
      }

      if (groupIndex % 2 === 1) {
        rowClasses.set(getStandingsRowId(contestant), 'MuiDataGrid-row--scoreGroupMuted');
      }
    });

    return rowClasses;
  }, [contest?.type, contestants]);

  useEffect(() => {
    if (!participantTarget || isLoading) {
      return;
    }

    const focusKey = `${contestId ?? ''}-${participantTarget.rowId}-${standingsPage ?? ''}`;
    if (focusedParticipantRef.current === focusKey) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const api = dataGridApiRef.current;
      if (!api) {
        return;
      }

      api.scrollToIndexes({ rowIndex: participantTarget.rowIndex });
      api.setCellFocus(participantTarget.rowId, 'username');

      focusedParticipantRef.current = focusKey;
      const rowElement = api.getRowElement(participantTarget.rowId);

      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [contestId, dataGridApiRef, isLoading, participantTarget, standingsPage]);

  return (
    <DataGrid
      className="kep-data-grid-section"
      slots={{ pagination: DataGridListPagination }}
      apiRef={dataGridApiRef}
      autoHeight
      rowHeight={isCompactLayout ? 42 : 72}
      columnHeaderHeight={isCompactLayout ? 38 : undefined}
      disableColumnMenu
      disableColumnFilter
      disableRowSelectionOnClick
      rows={contestants}
      columns={columns}
      columnVisibilityModel={
        isCompactLayout
          ? {
              delta: false,
              performance: false,
            }
          : undefined
      }
      localeText={{ noRowsLabel: t('common.dataGrid.noRows.contestStandings') }}
      slotProps={getDataGridNoRowsOverlaySlotProps({
        filtered: Boolean(activeFiltersCount || participantUsername),
      })}
      loading={isLoading}
      rowCount={total}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 20, 50, 100]}
      onRowClick={({ row }) => {
        if (row.rowType === 'upsolve' || !row.id) {
          return;
        }

        onContestantClick(row);
      }}
      getRowId={getStandingsRowId}
      getRowClassName={({ row }) =>
        [
          row.username === currentUsername ? 'MuiDataGrid-row--current' : '',
          contestantMatchesUsername(row, normalizeUsername(currentUsername))
            ? 'MuiDataGrid-row--currentUser'
            : '',
          participantTarget?.rowId === getStandingsRowId(row)
            ? 'MuiDataGrid-row--participantTarget'
            : '',
          acmScoreGroupRowClasses.get(getStandingsRowId(row)) ?? '',
          row.rowType !== 'upsolve' && row.id ? 'MuiDataGrid-row--clickable' : '',
        ]
          .filter(Boolean)
          .join(' ')
      }
      sx={(theme) => ({
        minWidth: 0,
        '& .MuiDataGrid-cell': {
          px: isCompactLayout ? 0.5 : undefined,
          fontSize: isCompactLayout ? '0.75rem' : undefined,
          lineHeight: isCompactLayout ? 1.2 : undefined,
        },
        '& .MuiDataGrid-columnHeader': {
          px: isCompactLayout ? 0.5 : undefined,
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontSize: isCompactLayout ? '0.75rem' : undefined,
        },
        '& .MuiDataGrid-columnHeader .MuiTypography-subtitle2': {
          fontSize: isCompactLayout ? '0.75rem' : undefined,
          lineHeight: isCompactLayout ? 1.1 : undefined,
        },
        '& .MuiDataGrid-columnHeader .MuiTypography-caption': {
          fontSize: isCompactLayout ? '0.62rem' : undefined,
          lineHeight: isCompactLayout ? 1 : undefined,
        },
        '& .MuiDataGrid-cell .MuiTypography-body2, & .MuiDataGrid-cell .MuiTypography-subtitle2': {
          fontSize: isCompactLayout ? '0.7rem' : undefined,
          lineHeight: isCompactLayout ? 1.1 : undefined,
        },
        '& .MuiDataGrid-cell .MuiTypography-caption': {
          fontSize: isCompactLayout ? '0.65rem' : undefined,
        },
        '& .MuiDataGrid-cell .MuiTypography-overline': {
          fontSize: isCompactLayout ? '0.66rem' : undefined,
          lineHeight: isCompactLayout ? 1.05 : undefined,
          letterSpacing: 0,
        },
        '& .MuiDataGrid-cell .contest-problem-result': {
          gap: isCompactLayout ? 0 : undefined,
        },
        '& .MuiDataGrid-cell .contest-problem-result-best': {
          borderRadius: isCompactLayout ? 1 : undefined,
          px: isCompactLayout ? 0.5 : undefined,
          py: isCompactLayout ? 0.25 : undefined,
        },
        '& .MuiDataGrid-row--scoreGroupMuted': {
          bgcolor: 'background.elevation1',
        },
        '& .MuiDataGrid-row:hover': {
          bgcolor: 'primary.lighter',
        },
        '& .MuiDataGrid-row--clickable': {
          cursor: 'pointer',
        },
        '& .MuiDataGrid-row--participantTarget': {
          bgcolor: 'warning.lighter',
          outline: '2px solid',
          outlineColor: 'warning.main',
          outlineOffset: -2,
          animation: 'participantTargetPulse 1.6s ease-in-out 2',
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          ...theme.applyStyles('dark', {
            bgcolor: 'rgb(var(--aurora-palette-warning-mainChannel) / 0.16)',
          }),
        },
        '@keyframes participantTargetPulse': {
          '0%, 100%': {
            boxShadow: 'inset 0 0 0 0 rgb(var(--aurora-palette-warning-mainChannel) / 0)',
          },
          '50%': {
            boxShadow: 'inset 0 0 0 999px rgb(var(--aurora-palette-warning-mainChannel) / 0.12)',
          },
        },
      })}
    />
  );
};
export default ContestStandingsTable;
