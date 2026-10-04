import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { projectsQueries, useProjectAttemptLog } from 'modules/projects/application/queries';
import { Project, ProjectAttempt } from 'modules/projects/domain/entities/project.entity';
import { canViewAttemptLog } from 'modules/projects/ui/shared/lib/attemptPermissions';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { getDataGridNoRowsOverlaySlotProps } from 'shared/components/common/DataGridNoRowsOverlay';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';
import { toast } from 'sonner';
import ProjectAttemptScore from './ProjectAttemptScore';
import ProjectTechnologyLogo from './ProjectTechnologyLogo';

interface ProjectAttemptsTableProps {
  project: Project;
  attempts: ProjectAttempt[] | undefined;
  isLoading?: boolean;
  scoreMode?: 'kepcoin' | 'hackathon';
  onRerun?: () => void;
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationChange: (model: GridPaginationModel) => void;
}

const ProjectAttemptsTable = ({
  project,
  attempts,
  isLoading,
  scoreMode = 'kepcoin',
  onRerun,
  total,
  paginationModel,
  onPaginationChange,
}: ProjectAttemptsTableProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const stableRowCount = useStableGridRowCount(total, Boolean(isLoading));
  const rows = attempts ?? [];
  const [logAttemptId, setLogAttemptId] = useState<number | null>(null);
  const {
    data: log,
    isLoading: isFetchingLog,
    error: logError,
  } = useProjectAttemptLog(logAttemptId, currentUser?.username);
  const [rerunningId, setRerunningId] = useState<number | null>(null);

  const handleCloseLog = () => {
    setLogAttemptId(null);
  };

  const handleOpenLog = (attemptId: number) => {
    setLogAttemptId(attemptId);
  };

  const handleRerun = async (attemptId: number) => {
    setRerunningId(attemptId);
    try {
      await projectsQueries.attemptsRepository.rerun(attemptId);
      onRerun?.();
    } catch {
      toast.error(t('projects.rerunError'));
    } finally {
      setRerunningId(null);
    }
  };

  const renderId = (row: ProjectAttempt) =>
    canViewAttemptLog(currentUser, row.username) ? (
      <Button
        color="primary"
        size="small"
        aria-label={t('projects.log') + ' #' + row.id}
        disabled={isFetchingLog}
        onClick={() => handleOpenLog(row.id)}
        sx={{ fontWeight: 700, textTransform: 'none', minWidth: 0, p: 0 }}
      >
        #{row.id}
      </Button>
    ) : (
      <Typography variant="body2" color="text.secondary" fontWeight={700}>
        #{row.id}
      </Typography>
    );

  const renderStatus = (row: ProjectAttempt, mobile = false) => (
    <Tooltip title={row.verdictTitle}>
      <Chip
        variant={mobile ? 'soft' : 'outlined'}
        size={mobile ? 'small' : 'medium'}
        color={
          row.verdict === 1
            ? 'success'
            : row.verdict === -2
              ? 'warning'
              : row.verdict === -1
                ? 'secondary'
                : 'error'
        }
        label={
          row.verdictTitle + (row.verdict === -1 && row.taskNumber ? ' #' + row.taskNumber : '')
        }
        sx={{ fontWeight: 700, maxWidth: 1 }}
      />
    </Tooltip>
  );

  const renderScore = (row: ProjectAttempt, compact = false) => {
    const earned = scoreMode === 'hackathon' ? row.hackathonPoints : row.kepcoins;
    const possible =
      scoreMode === 'hackathon'
        ? row.hackathonProjectPoints
        : (project.kepcoins ?? row.projectKepcoins);
    return (
      <ProjectAttemptScore
        earned={row.verdict === 1 ? earned : undefined}
        possible={possible}
        compact={compact}
      />
    );
  };

  const renderLog = (row: ProjectAttempt) =>
    canViewAttemptLog(currentUser, row.username) ? (
      <Tooltip title={t('projects.viewLog')}>
        <IconButton
          size="small"
          color="primary"
          aria-label={`${t('projects.viewLog')} #${row.id}`}
          disabled={isFetchingLog}
          sx={{ width: 32, height: 32 }}
          onClick={(event) => {
            event.stopPropagation();
            void handleOpenLog(row.id);
          }}
        >
          <IconifyIcon icon="mdi:file-document-outline" sx={{ pointerEvents: 'none' }} />
        </IconButton>
      </Tooltip>
    ) : null;

  const renderRerun = (row: ProjectAttempt) =>
    currentUser?.isSuperuser ? (
      <Tooltip title={t('projects.rerun')}>
        <IconButton
          size="small"
          color="primary"
          aria-label={t('projects.rerun')}
          loading={rerunningId === row.id}
          disabled={rerunningId !== null}
          sx={{ width: 32, height: 32 }}
          onClick={(event) => {
            event.stopPropagation();
            void handleRerun(row.id);
          }}
        >
          <IconifyIcon icon="mdi:refresh" sx={{ pointerEvents: 'none' }} />
        </IconButton>
      </Tooltip>
    ) : null;

  const renderActions = (row: ProjectAttempt) => (
    <Stack direction="row" alignItems="center">
      {renderLog(row)}
      {renderRerun(row)}
    </Stack>
  );

  const columns: GridColDef<ProjectAttempt>[] = [
    {
      field: 'id',
      headerName: t('projects.id'),
      minWidth: 90,
      flex: 0.4,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => renderId(row),
    },
    {
      field: 'created',
      headerName: t('projects.submitted'),
      minWidth: 150,
      flex: 0.8,
      sortable: false,
      renderCell: ({ row }) => (
        <Chip label={formatDateTime(row.created, 'compactDateTimeNoComma', '--')} />
      ),
    },
    {
      field: 'technology',
      headerName: t('projects.technology'),
      minWidth: 80,
      flex: 0.5,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => <ProjectTechnologyLogo technology={row.technology} />,
    },
    {
      field: 'username',
      headerName: t('projects.user'),
      minWidth: 110,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <UserPopover username={row.username}>
          <Typography noWrap sx={{ color: 'primary.main', fontWeight: 500 }}>
            {row.username}
          </Typography>
        </UserPopover>
      ),
    },
    {
      field: 'verdictTitle',
      headerName: t('projects.verdict'),
      minWidth: 130,
      flex: 0.8,
      sortable: false,
      renderCell: ({ row }) => renderStatus(row),
    },
    {
      field: 'score',
      headerName: t('projects.score'),
      minWidth: 88,
      flex: 0.5,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => renderScore(row),
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
  ];
  if (currentUser?.isSuperuser || rows.some((row) => canViewAttemptLog(currentUser, row.username)))
    columns.push({
      field: 'actions',
      headerName: '',
      width: currentUser?.isSuperuser ? 80 : 40,
      cellClassName: 'project-attempt-actions',
      sortable: false,
      renderCell: ({ row }) => renderActions(row),
    });

  const renderLogDialog = () => (
    <Dialog open={logAttemptId !== null} onClose={handleCloseLog} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconifyIcon icon="mdi:file-document-outline" />
          {t('projects.attemptLog')}
        </Stack>
        <IconButton aria-label={t('common.close')} onClick={handleCloseLog} size="small">
          <IconifyIcon icon="mdi:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isFetchingLog ? (
          <Typography variant="body2">{t('projects.loadingLog')}</Typography>
        ) : logError ? (
          <Alert severity="error">{t('projects.logLoadError')}</Alert>
        ) : log ? (
          <Stack direction="column" spacing={2}>
            {log.log ? (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  m: 0,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                  overflow: 'auto',
                }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  dangerouslySetInnerHTML={createSafeHtml(log.log)}
                />
              </Box>
            ) : null}

            {log.tasks?.map((task) => (
              <Box
                key={`${task.taskNumber}-${task.taskTitle}`}
                sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
                  {task.done === true && (
                    <IconifyIcon
                      icon="material-symbols:check-circle-outline"
                      color="success.main"
                    />
                  )}
                  {task.done === false && (
                    <IconifyIcon icon="material-symbols:cancel-outline" color="error.main" />
                  )}
                  <Typography fontWeight={700}>
                    {task.taskNumber}. {task.taskTitle}
                  </Typography>
                </Stack>
                <Divider />
                {task.log ? (
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      m: 0,
                      bgcolor: 'background.neutral',
                      borderRadius: '0 0 8px 8px',
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      dangerouslySetInnerHTML={createSafeHtml(task.log)}
                    />
                  </Box>
                ) : null}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('projects.noLog')}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {isPhone ? (
        <Stack direction="column" spacing={0.75} sx={{ mb: 2 }}>
          {isLoading && !rows.length ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={100} sx={{ borderRadius: 2.5 }} />
            ))
          ) : !rows.length ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              {t('projects.noAttempts')}
            </Typography>
          ) : (
            rows.map((row) => (
              <Box
                key={row.id}
                component="article"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2.5,
                  bgcolor: alpha(
                    theme.palette.text.primary,
                    theme.palette.mode === 'dark' ? 0.08 : 0.035,
                  ),
                }}
              >
                <Stack direction="column" spacing={0.75}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} minWidth={0}>
                      {renderId(row)}
                      <UserPopover username={row.username}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          sx={{ minWidth: 0, maxWidth: 112, cursor: 'pointer' }}
                        >
                          {row.username}
                        </Typography>
                      </UserPopover>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flexShrink: 0, fontSize: 11.5, whiteSpace: 'nowrap' }}
                    >
                      {formatDateTime(row.created, 'compactDateTimeNoComma', '--')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    {renderStatus(row, true)}
                    {renderActions(row)}
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ProjectTechnologyLogo technology={row.technology} size={24} />
                      {renderScore(row, true)}
                    </Stack>
                    <Stack direction="row" spacing={1.25} flexShrink={0}>
                      <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
                        {row.time ?? '—'} {t('problems.attempts.ms')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
                        {row.memory ?? '—'} {t('problems.attempts.kb')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            ))
          )}
          {stableRowCount > paginationModel.pageSize && (
            <Pagination
              count={Math.ceil(stableRowCount / paginationModel.pageSize)}
              page={paginationModel.page + 1}
              onChange={(_, page) => onPaginationChange({ ...paginationModel, page: page - 1 })}
              color="primary"
              shape="rounded"
              size="small"
              siblingCount={0}
              sx={{ display: 'flex', justifyContent: 'center', pt: 1.5 }}
            />
          )}
        </Stack>
      ) : (
        <DataGrid
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          localeText={{ noRowsLabel: t('projects.noAttempts') }}
          slotProps={getDataGridNoRowsOverlaySlotProps({
            description: t('projects.noAttemptsHint'),
          })}
          loading={isLoading}
          rowCount={stableRowCount}
          pageSizeOptions={[10, 20, 50]}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          sortingMode="server"
          disableColumnFilter
          sx={{
            mb: 2,
            '& .MuiDataGrid-row .MuiDataGrid-cell.project-attempt-actions': {
              px: 0,
              justifyContent: 'center',
            },
            '& .MuiDataGrid-row--hovered': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
          getRowId={(row) => row.id}
        />
      )}
      {renderLogDialog()}
    </>
  );
};

export default ProjectAttemptsTable;
