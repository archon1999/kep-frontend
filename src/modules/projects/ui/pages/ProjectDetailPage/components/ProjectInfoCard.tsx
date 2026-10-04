import { useTranslation } from 'react-i18next';
import { Chip, Stack } from '@mui/material';
import { Project } from 'modules/projects/domain/entities/project.entity';
import { resolveProjectFileAccept } from 'modules/projects/ui/shared/lib/upload';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';

const ProjectInfoCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
      <Chip
        variant="soft"
        color="neutral"
        size="small"
        label={
          <KepcoinValue value={project.kepcoins ?? project.purchaseKepcoinValue} iconSize={16} />
        }
        aria-label={t('projects.kepcoinReward')}
      />
      <Chip
        variant="soft"
        color="neutral"
        size="small"
        label={t('projects.taskSummary', { count: project.tasks.length })}
        icon={<IconifyIcon icon="mdi:format-list-checks" />}
      />
      <Chip
        variant="soft"
        color="neutral"
        size="small"
        label={resolveProjectFileAccept(project.fileAccept)}
        aria-label={t('projects.fileType')}
      />
    </Stack>
  );
};

export default ProjectInfoCard;
