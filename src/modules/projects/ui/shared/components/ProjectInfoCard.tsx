import { useTranslation } from 'react-i18next';
import { Chip, Stack, Typography } from '@mui/material';
import { Project } from 'modules/projects/domain/entities/project.entity';
import { resolveProjectFileAccept } from 'modules/projects/domain/utils/project-upload';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';

const ProjectInfoCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
      <Chip
        variant="soft"
        color={
          project.level <= 1
            ? 'info'
            : project.level === 2
              ? 'primary'
              : project.level === 3
                ? 'warning'
                : 'error'
        }
        size="small"
        label={project.levelTitle}
        aria-label={t('projects.levelLabel', { level: project.levelTitle })}
      />
      <KepcoinValue
        value={project.kepcoins ?? project.purchaseKepcoinValue}
        iconSize={18}
        textVariant="metric"
        title={t('projects.kepcoinReward')}
      />
      <Stack direction="row" gap={0.75} alignItems="center">
        <IconifyIcon icon="mdi:format-list-checks" color="primary.main" />
        <Typography variant="body2" color="text.secondary">
          {t('projects.taskSummary', { count: project.tasks.length })}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" title={t('projects.fileType')}>
        {resolveProjectFileAccept(project.fileAccept)}
      </Typography>
    </Stack>
  );
};

export default ProjectInfoCard;
