import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useHackathonAttemptLog, useRerunHackathonAttempt } from 'modules/hackathons/application';
import { formatHackathonDateTime } from 'modules/hackathons/ui/shared';
import type {
  ProjectAttempt,
  ProjectAttemptLog,
} from 'modules/projects/domain/entities/project.entity';
import { canViewAttemptLog } from 'modules/projects/ui/shared/lib/attemptPermissions';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { createSafeHtml } from 'shared/lib/safeHtml';
import { toast } from 'sonner';

interface HackathonAttemptsTableProps {
  attempts: ProjectAttempt[];
  onRerun?: () => void;
}

const HackathonAttemptsTable = ({ attempts, onRerun }: HackathonAttemptsTableProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { trigger: fetchHackathonAttemptLog } = useHackathonAttemptLog();
  const { trigger: rerunHackathonAttempt, isMutating: isRerunning } = useRerunHackathonAttempt();
  const [log, setLog] = useState<ProjectAttemptLog | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isFetchingLog, setIsFetchingLog] = useState(false);
  const [logError, setLogError] = useState(false);
  const [rerunningId, setRerunningId] = useState<number | null>(null);
  const hasActions =
    currentUser?.isSuperuser ||
    attempts.some((attempt) => canViewAttemptLog(currentUser, attempt.username));

  const handleCloseLog = () => {
    setLog(null);
    setIsLogOpen(false);
  };

  const handleOpenLog = async (attemptId: number) => {
    setLog(null);
    setLogError(false);
    setIsLogOpen(true);
    setIsFetchingLog(true);

    try {
      setLog((await fetchHackathonAttemptLog(attemptId)) ?? null);
    } catch {
      setLogError(true);
    } finally {
      setIsFetchingLog(false);
    }
  };

  const handleRerun = async (attemptId: number) => {
    setRerunningId(attemptId);
    try {
      await rerunHackathonAttempt(attemptId);
      onRerun?.();
    } catch {
      toast.error(t('projects.rerunError'));
    } finally {
      setRerunningId(null);
    }
  };

  const renderLogText = (content: string) => (
    <Box
      component="pre"
      sx={{
        p: 2,
        m: 0,
        bgcolor: 'background.elevation1',
        overflow: 'auto',
        borderRadius: 1,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      }}
    >
      <Typography
        component="div"
        variant="body2"
        sx={{ fontFamily: 'inherit' }}
        dangerouslySetInnerHTML={createSafeHtml(content)}
      />
    </Box>
  );

  return (
    <>
      <TableContainer
        role="region"
        aria-label={t('hackathons.attempts')}
        tabIndex={0}
        sx={{ borderRadius: 0, overflowX: 'auto' }}
      >
        <Table
          size="small"
          aria-label={t('hackathons.attempts')}
          sx={{
            minWidth: 1120,
            '& tbody td, & tbody th': { py: 1.75 },
            '& tbody tr:last-child td, & tbody tr:last-child th': { borderBottom: 0 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{t('projects.id')}</TableCell>
              <TableCell>{t('projects.user')}</TableCell>
              <TableCell>{t('projects.project')}</TableCell>
              <TableCell>{t('projects.technology')}</TableCell>
              <TableCell>{t('projects.verdict')}</TableCell>
              <TableCell align="right">{t('projects.score')}</TableCell>
              <TableCell align="right">{t('projects.timeMemory')}</TableCell>
              <TableCell>{t('projects.submitted')}</TableCell>
              {hasActions ? <TableCell align="right">{t('projects.actions')}</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {attempts.map((attempt) => (
              <TableRow key={attempt.id} hover>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>#{attempt.id}</TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                      src={attempt.userAvatar}
                      alt=""
                      sx={{ width: 32, height: 32, fontSize: 13 }}
                    >
                      {attempt.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.primary" fontWeight={600} noWrap>
                      {attempt.username}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {attempt.projectTitle}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{attempt.technology}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="soft"
                    color={
                      attempt.verdict === 1
                        ? 'success'
                        : attempt.verdict === -2
                          ? 'warning'
                          : attempt.verdict === -1
                            ? 'secondary'
                            : 'error'
                    }
                    label={
                      attempt.verdictTitle +
                      (attempt.verdict === -1 && attempt.taskNumber
                        ? ' #' + attempt.taskNumber
                        : '')
                    }
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                >
                  {attempt.verdict === 1 && attempt.hackathonPoints !== undefined ? (
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {attempt.hackathonPoints}
                      {attempt.hackathonProjectPoints !== undefined ? (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}
                          / {attempt.hackathonProjectPoints}
                        </Typography>
                      ) : null}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                >
                  <Typography variant="body2">
                    {attempt.time ?? 0} {t('problems.attempts.ms')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {attempt.memory ?? 0} {t('problems.attempts.kb')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatHackathonDateTime(attempt.created)}
                  </Typography>
                </TableCell>
                {hasActions ? (
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {canViewAttemptLog(currentUser, attempt.username) ? (
                        <Tooltip title={t('projects.viewLog')}>
                          <span>
                            <IconButton
                              size="small"
                              aria-label={t('projects.viewLog') + ' #' + attempt.id}
                              disabled={isFetchingLog}
                              onClick={() => {
                                void handleOpenLog(attempt.id);
                              }}
                            >
                              <IconifyIcon icon="mdi:file-document-outline" sx={{ fontSize: 20 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null}
                      {currentUser?.isSuperuser ? (
                        <Tooltip title={t('projects.rerun')}>
                          <span>
                            <IconButton
                              size="small"
                              aria-label={t('projects.rerun') + ' #' + attempt.id}
                              loading={rerunningId === attempt.id}
                              disabled={isRerunning}
                              onClick={() => {
                                void handleRerun(attempt.id);
                              }}
                            >
                              <IconifyIcon icon="mdi:refresh" sx={{ fontSize: 20 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null}
                    </Stack>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isLogOpen}
        onClose={handleCloseLog}
        fullWidth
        maxWidth="md"
        aria-labelledby="hackathon-attempt-log-title"
      >
        <DialogTitle
          id="hackathon-attempt-log-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          {t('projects.attemptLog')}
          <IconButton aria-label={t('common.close')} onClick={handleCloseLog} size="small">
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isFetchingLog ? (
            <Typography variant="body2" role="status">
              {t('projects.loadingLog')}
            </Typography>
          ) : logError ? (
            <Alert severity="error">{t('projects.logLoadError')}</Alert>
          ) : log && (log.log || log.tasks?.length) ? (
            <Stack direction="column" spacing={2}>
              {log.log ? renderLogText(log.log) : null}
              {log.tasks?.map((task) => (
                <Box
                  key={`${task.taskNumber}-${task.taskTitle}`}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2,
                    '&:last-child': { borderBottom: 0, pb: 0 },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                    sx={{ mb: task.log ? 1.5 : 0 }}
                  >
                    {task.done === true ? (
                      <IconifyIcon
                        icon="material-symbols:check-circle-outline"
                        color="success.main"
                      />
                    ) : null}
                    {task.done === false ? (
                      <IconifyIcon icon="material-symbols:cancel-outline" color="error.main" />
                    ) : null}
                    <Typography variant="subtitle2" fontWeight={600}>
                      {task.taskNumber}. {task.taskTitle}
                    </Typography>
                  </Stack>
                  {task.log ? renderLogText(task.log) : null}
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
    </>
  );
};

export default HackathonAttemptsTable;
