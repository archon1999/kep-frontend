import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Chip, IconButton, Paper, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict, { VerdictKey } from 'shared/components/problems/AttemptVerdict';
import { wsService } from 'shared/services/websocket';
import AttemptDetailDialog from './AttemptDetailDialog.tsx';
import { problemsQueries } from '../../application/queries';
import { AttemptListItem } from '../../domain/entities/problem.entity';

interface ProblemsAttemptsTableProps {
  attempts: AttemptListItem[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationChange: (model: GridPaginationModel) => void;
  isLoading?: boolean;
  onRerun?: () => void;
  showProblemColumn?: boolean;
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
  getProblemLink,
}: ProblemsAttemptsTableProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<AttemptListItem[]>(attempts ?? []);
  const [lastUpdatedAttempt, setLastUpdatedAttempt] = useState<AttemptListItem | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptListItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const trackedIdsRef = useRef<number[]>([]);

  useEffect(() => {
    setRows(attempts ?? []);

    if (selectedAttempt) {
      const freshAttempt = (attempts ?? []).find((item) => item.id === selectedAttempt.id);
      if (freshAttempt) {
        setSelectedAttempt((prev) => (prev ? { ...prev, ...freshAttempt } : prev));
      }
    }
  }, [attempts, selectedAttempt?.id]);

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
      let updatedAttempt: AttemptListItem | any = null;

      setRows((prev) => {
        const index = prev.findIndex((attempt) => attempt.id === payload.id);
        if (index === -1) return prev;

        const nextAttempt: AttemptListItem = {
          ...prev[index],
          verdict: payload.verdict,
          verdictTitle: payload.verdictTitle,
          testCaseNumber: payload.testCaseNumber,
          time: payload.time ?? undefined,
          memory: payload.memory ?? undefined,
          balls: payload.balls ?? undefined,
        };

        updatedAttempt = nextAttempt;

        const nextAttempts = [...prev];
        nextAttempts[index] = nextAttempt;
        return nextAttempts;
      });

      if (updatedAttempt) {
        if (currentUser?.username && updatedAttempt.user?.username === currentUser.username) {
          setLastUpdatedAttempt(updatedAttempt);
        }

        setSelectedAttempt((prev) =>
          prev && prev.id === updatedAttempt?.id ? { ...prev, ...updatedAttempt } : prev,
        );
      }
    });

    return unsubscribe;
  }, [currentUser?.username]);

  const handleOpenDetail = useCallback((attempt: AttemptListItem) => {
    setSelectedAttempt(attempt);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedAttempt(null);
  }, []);

  const handleAttemptUpdated = useCallback(
    (attemptId: number, changes: Partial<AttemptListItem>) => {
      setRows((prev) => prev.map((item) => (item.id === attemptId ? { ...item, ...changes } : item)));
      setSelectedAttempt((prev) => (prev && prev.id === attemptId ? { ...prev, ...changes } : prev));
      onRerun?.();
    },
    [onRerun],
  );

  const formatDateTime = useCallback((value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, []);

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
        renderCell: ({ row }) => (
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
        ),
      },
      {
        field: 'created',
        headerName: t('problems.attempts.columns.submitted'),
        minWidth: 150,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => <Chip label={formatDateTime(row.created)}></Chip>,
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
        to={
          getProblemLink?.(row) ??
          getResourceById(resources.Problem, row.problemId)
        }
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
          <AttemptVerdict
            verdict={row.verdict as VerdictKey | undefined}
            title={row.verdictTitle || t('problems.attempts.unknownVerdict')}
            testCaseNumber={row.testCaseNumber}
          />
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
    showProblemColumn,
    t,
    formatDateTime,
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
          '& .MuiDataGrid-row--hovered': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
        }}
        getRowId={(row) => row.id}
      />

      {lastUpdatedAttempt && (
        <Paper
          elevation={8}
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
    </>
  );
};

export default ProblemsAttemptsTable;
