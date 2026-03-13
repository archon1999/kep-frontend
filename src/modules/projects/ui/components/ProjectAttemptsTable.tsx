import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { projectsQueries } from '../../application/queries';
import { Project, ProjectAttempt, ProjectAttemptLog } from '../../domain/entities/project.entity';

interface ProjectAttemptsTableProps {
  project: Project;
  attempts: ProjectAttempt[] | undefined;
  isLoading?: boolean;
  onRerun?: () => void;
}

const ProjectAttemptsTable = ({
  project,
  attempts,
  isLoading,
  onRerun,
}: ProjectAttemptsTableProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [log, setLog] = useState<ProjectAttemptLog | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isFetchingLog, setIsFetchingLog] = useState(false);

  const handleCloseLog = () => {
    setLog(null);
    setIsLogOpen(false);
  };

  const handleOpenLog = async (attemptId: number) => {
    setIsFetchingLog(true);
    try {
      const logData = await projectsQueries.attemptsRepository.getLog(attemptId);
      setLog(logData);
      setIsLogOpen(true);
    } finally {
      setIsFetchingLog(false);
    }
  };

  const handleRerun = async (attemptId: number) => {
    await projectsQueries.attemptsRepository.rerun(attemptId);
    onRerun?.();
  };

  const renderVerdict = (attempt: ProjectAttempt) => {
    const isAccepted = attempt.verdict === 1;
    const isRunning = attempt.verdict === -2;
    const isPending = attempt.verdict === -1;

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          component="span"
          variant="body2"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 2,
            bgcolor: isAccepted
              ? 'success.light'
              : isRunning
                ? 'info.light'
                : isPending
                  ? 'warning.light'
                  : 'error.light',
            color: isAccepted
              ? 'success.dark'
              : isRunning
                ? 'info.dark'
                : isPending
                  ? 'warning.dark'
                  : 'error.dark',
            fontWeight: 700,
          }}
        >
          {attempt.verdictTitle}
          {isPending && attempt.taskNumber ? ` #${attempt.taskNumber}` : ''}
          {isAccepted && attempt.kepcoins !== undefined && (
            <>
              {' '}
              {attempt.kepcoins}
              {project.kepcoins ? ` / ${project.kepcoins}` : ''}
            </>
          )}
        </Typography>
      </Stack>
    );
  };

  const renderLogDialog = () => (
    <Dialog open={isLogOpen} onClose={handleCloseLog} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconifyIcon icon="mdi:file-document-outline" />
        {t('projects.attemptLog')}
      </DialogTitle>
      <DialogContent dividers>
        {isFetchingLog ? (
          <Typography variant="body2">{t('projects.loadingLog')}</Typography>
        ) : log ? (
          <Stack direction="row" spacing={2}>
            {log.log ? (
              <Box
                component="pre"
                sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2, overflow: 'auto' }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  dangerouslySetInnerHTML={{ __html: log.log }}
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
                      bgcolor: 'background.neutral',
                      borderRadius: '0 0 12px 12px',
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: task.log }}
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('projects.id')}</TableCell>
            <TableCell>{t('projects.submitted')}</TableCell>
            <TableCell>{t('projects.technology')}</TableCell>
            <TableCell>{t('projects.user')}</TableCell>
            <TableCell>{t('projects.project')}</TableCell>
            <TableCell>{t('projects.verdict')}</TableCell>
            <TableCell>{t('projects.timeMemory')}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(attempts ?? []).map((attempt) => {
            const isOwner = !!currentUser?.username && attempt.username === currentUser.username;
            return (
              <TableRow key={attempt.id} selected={isOwner}>
                <TableCell>{attempt.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.25}>
                    <Typography variant="body2" fontWeight={600}>
                      {attempt.created ? new Date(attempt.created).toLocaleDateString() : '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attempt.created ? new Date(attempt.created).toLocaleTimeString() : ''}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{attempt.technology}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {attempt.userAvatar ? (
                      <Box
                        component="img"
                        src={attempt.userAvatar}
                        alt={attempt.username}
                        sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : null}
                    <Typography variant="body2" fontWeight={600}>
                      {attempt.username}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary" fontWeight={700}>
                    {attempt.projectTitle}
                  </Typography>
                </TableCell>
                <TableCell>{renderVerdict(attempt)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} color="text.secondary">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:clock-outline" />
                      <Typography variant="body2">{attempt.time ?? 0} ms</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:database-outline" />
                      <Typography variant="body2">{attempt.memory ?? 0} kb</Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {(isOwner || currentUser?.isSuperuser) && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenLog(attempt.id)}
                      >
                        {t('projects.log')}
                      </Button>
                    )}
                    {currentUser?.isSuperuser && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<IconifyIcon icon="mdi:refresh" />}
                        onClick={() => handleRerun(attempt.id)}
                      >
                        {t('projects.rerun')}
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}

          {!isLoading && (!attempts || attempts.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="text.secondary">
                  {t('projects.noAttempts')}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {renderLogDialog()}
    </>
  );
};

export default ProjectAttemptsTable;
