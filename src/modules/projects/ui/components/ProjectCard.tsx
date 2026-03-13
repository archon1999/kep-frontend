import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { resources, getResourceByParams } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { projectsQueries } from '../../application/queries';
import { Project } from '../../domain/entities/project.entity';

interface ProjectCardProps {
  project: Project;
  onPurchased?: (project: Project) => void;
}

const ProjectCard = ({ project, onPurchased }: ProjectCardProps) => {
  const { t } = useTranslation();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(project.purchased);

  const handlePurchase = async () => {
    if (isPurchased) return;

    try {
      setIsPurchasing(true);
      const purchasedProject = await projectsQueries.projectsRepository.purchase(project.slug);
      setIsPurchased(true);
      onPurchased?.(purchasedProject);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card
      background={1}
      sx={{
        height: 1,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={700} flex={1}>
              {project.title}
            </Typography>
            {project.logo ? (
              <Box
                component="img"
                src={project.logo}
                alt={project.title}
                sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 1.5, bgcolor: 'background.neutral' }}
              />
            ) : null}
          </Stack>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {project.descriptionShort ? (
          <Typography variant="body2" color="text.secondary" component="div"
            dangerouslySetInnerHTML={{ __html: project.descriptionShort }}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepcoinValue value={project.kepcoins ?? project.purchaseKepcoinValue} />
            <Chip label={project.levelTitle} color="success" size="small" sx={{ fontWeight: 700 }} />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.5} justifyContent="flex-end">
            {project.availableTechnologies.map((technology) => (
              <Chip key={technology.technology} label={technology.technology} size="small" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        {isPurchased ? (
          <Button
            fullWidth
            variant="text"
            component={RouterLink}
            to={getResourceByParams(resources.Project, { id: project.slug, slug: project.slug })}
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          >
            {t('projects.view')}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            disabled={isPurchasing}
            startIcon={<IconifyIcon icon="mdi:cart-outline" />}
          >
            {t('projects.purchase')} <KepcoinValue value={project.purchaseKepcoinValue} sx={{ ml: 1 }} />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
