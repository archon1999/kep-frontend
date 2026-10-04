import { useTranslation } from 'react-i18next';
import { Chip, LinearProgress, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ProjectProgressSummary } from '../project-listing';

const ProjectProgress = ({ progress }: { progress: ProjectProgressSummary }) => {
  const { t } = useTranslation();
  const percent = Math.min(100, Math.max(0, progress.progressPercent));

  if (progress.completed) {
    return (
      <Chip
        variant="soft"
        color="success"
        size="small"
        icon={<IconifyIcon icon="material-symbols:check-circle-outline" />}
        label={t('projects.progressCompleted')}
      />
    );
  }
  if (progress.attemptCount === 0) {
    return (
      <Chip variant="soft" color="neutral" size="small" label={t('projects.status.notStarted')} />
    );
  }

  return (
    <Stack direction="row" gap={1} alignItems="center" sx={{ flexShrink: 0 }}>
      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label={t('projects.progressTitle')}
        aria-valuetext={`${percent}%`}
        sx={{ width: 64 }}
      />
      <Typography variant="caption" fontWeight={700} color="primary.main">
        {percent}%
      </Typography>
    </Stack>
  );
};

export default ProjectProgress;
