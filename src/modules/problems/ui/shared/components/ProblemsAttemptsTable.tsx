import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { formatCalendarDateTime } from 'shared/lib/dateTime';
import { playSuccessSound } from 'shared/lib/soundSettings';
import { wsService } from 'shared/services/websocket';
import { problemsQueries } from 'modules/problems/application/queries';
import { AttemptListItem, Verdicts } from 'modules/problems/domain/entities/problem.entity';
import AttemptDetailDialog from './AttemptDetailDialog.tsx';
import AttemptProtocolDialog from './AttemptProtocolDialog.tsx';

interface ProblemsAttemptsTableProps {
  attempts: AttemptListItem[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationChange: (model: GridPaginationModel) => void;
  isLoading?: boolean;
  onRerun?: () => void;
  showProblemColumn?: boolean;
  showContestTimeSubmitted?: boolean;
  disableLockedAttemptDetails?: boolean;
  getProblemLink?: (attempt: AttemptListItem) => string;
}

interface AttemptUpdatePayload {
  id: number;
  verdict: number;
  verdictTitle: string;
  testCaseNumber?: number | null;
  time?: number | null;
  memory?: number | null;
  balls?: number | null;
}

const ProblemsAttemptsTable = ({
  attempts,
  total,
  paginationModel,
  onPaginationChange,
  isLoading,
  onRerun,
  showProblemColumn = true,
  showContestTimeSubmitted = false,
  disableLockedAttemptDetails = false,
  getProblemLink,
}: ProblemsAttemptsTableProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<AttemptListItem[]>(attempts ?? []);
  const [lastUpdatedAttempt, setLastUpdatedAttempt] = useState<AttemptListItem | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptListItem | null>(null);
  const [protocolAttempt, setProtocolAttempt] = useState<AttemptListItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const trackedIdsRef = useRef<number[]>([]);
  const rowsRef = useRef<AttemptListItem[]>(attempts ?? []);

  useEffect(() => {
    const nextRows = attempts ?? [];
    rowsRef.current = nextRows;
    setRows(nextRows);

    if (selectedAttempt) {
      const freshAttempt = (attempts ?? []).find((item) => item.id === selectedAttempt.id);
      if (freshAttempt) {
        setSelectedAttempt((prev) => (prev ? { ...prev, ...freshAttempt } : prev));
      }
    }

    if (protocolAttempt) {
      const freshProtocolAttempt = (attempts ?? []).find((item) => item.id === protocolAttempt.id);
      if (freshProtocolAttempt) {
        setProtocolAttempt((prev) => (prev ? { ...prev, ...freshProtocolAttempt } : prev));
      }
    }
  }, [attempts, selectedAttempt?.id, protocolAttempt?.id]);

  useEffect(() => {
    const newIds = (attempts ?? []).map((attempt) => attempt.id);
    const previousIds = trackedIdsRef.current;

    const added = newIds.filter((id) => !previousIds.includes(id));
    const removed = previousIds.filter((id) => !newIds.includes(id));

    added.forEach((id) => wsService.send('attempt-add', id));
    removed.forEach((id) => wsService.send('attempt-delete', id));

    trackedIdsRef.current = newIds;
    wsService.send('lang-change', i18n.language);
  }, [attempts, i18n.language]);

  useEffect(
    () => () => {
      trackedIdsRef.current.forEach((id) => wsService.send('attempt-delete', id));
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = wsService.on<AttemptUpdatePayload>('attempt-update', (payload) => {
      const currentAttempt = rowsRef.current.find((attempt) => attempt.id === payload.id);
      if (!currentAttempt) return;

      const updatedAttempt: AttemptListItem = {
        ...currentAttempt,
        verdict: payload.verdict,
        verdictTitle: payload.verdictTitle,
        testCaseNumber: payload.testCaseNumber,
        time: payload.time ?? undefined,
        memory: payload.memory ?? undefined,
        balls: payload.balls ?? undefined,
      };

      rowsRef.current = rowsRef.current.map((attempt) =>
        attempt.id === payload.id ? updatedAttempt : attempt,
      );
      setRows(rowsRef.current);

      const isAcceptedVerdict =
        payload.verdict === Verdicts.Accepted ||
        updatedAttempt.verdictTitle.toLowerCase() === 'accepted';

      if (isAcceptedVerdict && updatedAttempt.canView !== false) {
        playSuccessSound();
      }

      if (currentUser?.username && updatedAttempt.user?.username === currentUser.username) {
        setLastUpdatedAttempt(updatedAttempt);
      }

      setSelectedAttempt((prev) =>
        prev && prev.id === updatedAttempt.id ? { ...prev, ...updatedAttempt } : prev,
      );
    });

    return unsubscribe;
  }, [currentUser?.username]);

  const handleOpenDetail = useCallback((attempt: AttemptListItem) => {
    setSelectedAttempt(attempt);
    setIsDetailOpen(true);
  }, []);

  const handleOpenProtocol = useCallback((attempt: AttemptListItem) => {
    setProtocolAttempt(attempt);
    setIsProtocolOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedAttempt(null);
  }, []);

  const handleCloseProtocol = useCallback(() => {
    setIsProtocolOpen(false);
    setProtocolAttempt(null);
  }, []);

  const handleAttemptUpdated = useCallback(
    (attemptId: number, changes: Partial<AttemptListItem>) => {
      setRows((prev) =>
        prev.map((item) => (item.id === attemptId ? { ...item, ...changes } : item)),
      );
      setSelectedAttempt((prev) =>
        prev && prev.id === attemptId ? { ...prev, ...changes } : prev,
      );
      setProtocolAttempt((prev) =>
        prev && prev.id === attemptId ? { ...prev, ...changes } : prev,
      );
      onRerun?.();
    },
    [onRerun],
  );

  const formatDateTime = useCallback((value?: string) => {
    if (!value) return '--';
    return formatCalendarDateTime(value, value);
  }, []);

  const canOpenAttemptDetail = useCallback(
    (attempt: AttemptListItem) => !disableLockedAttemptDetails || attempt.canView !== false,
    [disableLockedAttemptDetails],
  );

  const handleRerun = useCallback(
    async (attemptId: number) => {
      await problemsQueries.problemsRepository.rerunAttempt(attemptId);
      onRerun?.();
    },
    [onRerun],
  );

  const columns: GridColDef<AttemptListItem>[] = useMemo(() => {
    const baseColumns: GridColDef<AttemptListItem>[] = [
      {
        field: 'id',
        headerName: t('problems.attempts.columns.id'),
        minWidth: 90,
        flex: 0.4,
        sortable: false,
        headerAlign: 'center',
        renderCell: ({ row }) =>
          canOpenAttemptDetail(row) ? (
            <Button
              color="primary"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                handleOpenDetail(row);
              }}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                minWidth: 0,
                p: 0,
              }}
            >
              #{row.id}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              #{row.id}
            </Typography>
          ),
      },
      {
        field: 'created',
        headerName: t('problems.attempts.columns.submitted'),
        minWidth: 150,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => (
          <Chip
            label={
              showContestTimeSubmitted && row.contestTime
                ? row.contestTime
                : formatDateTime(row.created)
            }
          />
        ),
      },
      {
        field: 'lang',
        headerName: t('problems.attempts.columns.lang'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => <AttemptLanguage lang={row.lang} langFull={row.langFull} />,
      },
      {
        field: 'user',
        headerName: t('problems.attempts.columns.user'),
        minWidth: 100,
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => (
          <UserPopover username={row.user.username}>
            <Typography sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 500 }}>
              {row.user.username}
            </Typography>
          </UserPopover>
        ),
      },
      {
        field: 'problemTitle',
        headerName: t('problems.attempts.columns.problem'),
        minWidth: 150,
        flex: 1.4,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography
            component={RouterLink}
            to={getProblemLink?.(row) ?? getResourceById(resources.Problem, row.problemId)}
            sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 500 }}
          >
            {row.contestProblemSymbol
              ? `${row.contestProblemSymbol}. ${row.problemTitle}`
              : `${row.problemId}. ${row.problemTitle}`}
          </Typography>
        ),
      },
      {
        field: 'verdictTitle',
        headerName: t('problems.attempts.columns.verdict'),
        minWidth: 100,
        flex: 0.6,
        sortable: false,
        renderCell: ({ row }) => (
          <Button
            color="inherit"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              handleOpenProtocol(row);
            }}
            sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
          >
            <AttemptVerdict
              verdict={row.verdict as VerdictKey | undefined}
              title={row.verdictTitle || t('problems.attempts.unknownVerdict')}
              testCaseNumber={row.testCaseNumber}
              balls={row.balls}
              showBalls={['grader', 'ioi'].includes(row.judgeSummary?.mode ?? '')}
            />
          </Button>
        ),
      },
      {
        field: 'time',
        headerName: t('problems.attempts.columns.time'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.time ?? '—'} {t('problems.attempts.ms')}
          </Typography>
        ),
      },
      {
        field: 'memory',
        headerName: t('problems.attempts.columns.memory'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.memory ?? '—'} {t('problems.attempts.kb')}
          </Typography>
        ),
      },
      {
        field: 'sourceCodeSize',
        headerName: t('problems.attempts.columns.size'),
        minWidth: 80,
        flex: 0.4,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.sourceCodeSize ?? '—'} B
          </Typography>
        ),
      },
    ];

    if (!showProblemColumn) {
      const problemColumnIndex = baseColumns.findIndex((column) => column.field === 'problemTitle');
      if (problemColumnIndex !== -1) {
        baseColumns.splice(problemColumnIndex, 1);
      }
    }

    if (currentUser?.isSuperuser) {
      baseColumns.push({
        field: 'actions',
        headerName: '',
        width: 40,
        sortable: false,
        renderCell: ({ row }) => (
          <Tooltip title={t('problems.attempts.rerun')}>
            <IconButton size="small" color="primary" onClick={() => handleRerun(row.id)}>
              <IconifyIcon icon="mdi:refresh" />
            </IconButton>
          </Tooltip>
        ),
      });
    }
    return baseColumns;
  }, [
    currentUser?.isSuperuser,
    showContestTimeSubmitted,
    showProblemColumn,
    t,
    formatDateTime,
    canOpenAttemptDetail,
    handleOpenDetail,
    handleRerun,
    getProblemLink,
  ]);

  return (
    <>
      <DataGrid
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        rows={rows}
        columns={columns}
        localeText={{ noRowsLabel: t('common.dataGrid.noRows.problemAttempts') }}
        loading={isLoading}
        rowCount={total}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        sortingMode="server"
        disableColumnFilter
        sx={{
          mb: 2,
          '& .MuiDataGrid-row--hovered': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
        getRowId={(row) => row.id}
      />

      {lastUpdatedAttempt && (
        <Paper
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: (muiTheme) => muiTheme.zIndex.tooltip,
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <AttemptVerdict
            verdict={lastUpdatedAttempt.verdict as VerdictKey | undefined}
            title={lastUpdatedAttempt.verdictTitle || t('problems.attempts.unknownVerdict')}
            testCaseNumber={lastUpdatedAttempt.testCaseNumber}
            balls={lastUpdatedAttempt.balls}
            showBalls={['grader', 'ioi'].includes(lastUpdatedAttempt.judgeSummary?.mode ?? '')}
            sx={{ fontWeight: 800 }}
          />
        </Paper>
      )}

      <AttemptDetailDialog
        open={isDetailOpen}
        attempt={selectedAttempt}
        onClose={handleCloseDetail}
        onAttemptUpdated={handleAttemptUpdated}
      />
      <AttemptProtocolDialog
        open={isProtocolOpen}
        attempt={protocolAttempt}
        onClose={handleCloseProtocol}
      />
    </>
  );
};

export default ProblemsAttemptsTable;
