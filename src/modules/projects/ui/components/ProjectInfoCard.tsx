import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { Project } from '../../domain/entities/project.entity';

interface ProjectInfoCardProps {
  project: Project;
}

const ProjectInfoCard = ({ project }: ProjectInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight={800}>
            {t('projects.info')}
          </Typography>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {t('projects.level')}
              </Typography>
            </Stack>
            <Chip label={project.levelTitle} color="success" size="small" />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {t('projects.kepcoinReward')}
            </Typography>
            <KepcoinValue value={project.kepcoins ?? project.purchaseKepcoinValue} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" spacing={0.75}>
            <Typography variant="body2" fontWeight={700}>
              {t('projects.technologies')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.75}>
              {project.availableTechnologies.map((technology) => (
                <Chip
                  key={technology.technology}
                  label={technology.technology}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoCard;
