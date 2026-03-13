import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ProjectAttempt, ProjectAttemptLog } from 'modules/projects/domain/entities/project.entity';
import { projectsQueries } from 'modules/projects/application/queries';
import { useAuth } from 'app/providers/AuthProvider';

interface HackathonAttemptsTableProps {
  attempts: ProjectAttempt[] | undefined;
  isLoading?: boolean;
  onRerun?: () => void;
}

const HackathonAttemptsTable = ({ attempts, isLoading, onRerun }: HackathonAttemptsTableProps) => {
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
              <Box component="pre" sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2, overflow: 'auto' }}>
                <Typography component="div" variant="body2" dangerouslySetInnerHTML={{ __html: log.log }} />
              </Box>
            ) : null}

            {log.tasks?.map((task) => (
              <Box key={`${task.taskNumber}-${task.taskTitle}`} sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
                  {task.done === true && <IconifyIcon icon="material-symbols:check-circle-outline" color="success.main" />}
                  {task.done === false && <IconifyIcon icon="material-symbols:cancel-outline" color="error.main" />}
                  <Typography fontWeight={700}>
                    {task.taskNumber}. {task.taskTitle}
                  </Typography>
                </Stack>
                {task.log ? (
                  <Box component="pre" sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: '0 0 12px 12px', overflow: 'auto' }}>
                    <Typography component="div" variant="body2" dangerouslySetInnerHTML={{ __html: task.log }} />
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
            <TableCell>{t('projects.user')}</TableCell>
            <TableCell>{t('projects.project')}</TableCell>
            <TableCell>{t('projects.technology')}</TableCell>
            <TableCell>{t('projects.verdict')}</TableCell>
            <TableCell>{t('projects.timeMemory')}</TableCell>
            <TableCell>{t('projects.submitted')}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(attempts ?? []).map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell>{attempt.id}</TableCell>
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
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {attempt.username}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={700} color="primary" noWrap>
                  {attempt.projectTitle}
                </Typography>
              </TableCell>
              <TableCell>{attempt.technology}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={700} color={attempt.verdict === 1 ? 'success.main' : 'error.main'}>
                  {attempt.verdictTitle}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} color="text.secondary" alignItems="center">
                  <IconifyIcon icon="mdi:clock-outline" />
                  <Typography variant="body2">{attempt.time ?? 0} ms</Typography>
                </Stack>
                <Stack direction="row" spacing={1} color="text.secondary" alignItems="center">
                  <IconifyIcon icon="mdi:database-outline" />
                  <Typography variant="body2">{attempt.memory ?? 0} kb</Typography>
                </Stack>
              </TableCell>
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
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => handleOpenLog(attempt.id)}>
                    {t('projects.log')}
                  </Button>
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
          ))}

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

export default HackathonAttemptsTable;
