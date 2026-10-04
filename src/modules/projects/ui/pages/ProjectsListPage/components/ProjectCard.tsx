import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import {
  ProjectCategoryKey,
  ProjectProgressSummary,
  stripProjectDescription,
} from '../project-listing';
import ProjectProgress from './ProjectProgress';

interface ProjectCardProps {
  project: Project;
  category: ProjectCategoryKey;
  progress?: ProjectProgressSummary;
  showTrackedProgress?: boolean;
  onPurchased?: (project: Project) => void;
}

const ProjectCard = ({
  project,
  progress,
  showTrackedProgress = false,
  onPurchased,
}: ProjectCardProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [purchasedProject, setPurchasedProject] = useState<{
    slug: string;
    username?: string;
  } | null>(null);

  const isPurchased =
    project.purchased ||
    (purchasedProject?.slug === project.slug &&
      purchasedProject.username === currentUser?.username);
  const description = stripProjectDescription(project.descriptionShort);
  const technologies = [
    ...new Set(
      project.availableTechnologies.map(({ technology }) => technology.trim()).filter(Boolean),
    ),
  ];
  const technologySummary = [
    technologies.slice(0, 2).join(', '),
    technologies.length > 2 ? `+${technologies.length - 2}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const projectUrl = getResourceByParams(resources.Project, {
    id: project.slug,
    slug: project.slug,
  });

  const handlePurchaseSuccess = () => {
    if (isPurchased) return;

    setPurchasedProject({ slug: project.slug, username: currentUser?.username });
    onPurchased?.({ ...project, purchased: true });
  };

  return (
    <Paper
      background={1}
      sx={{
        outline: 0,
        p: { xs: 2, sm: 3 },
        borderRadius: 6,
        '&:hover': { bgcolor: 'background.elevation2' },
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid size="auto">
          <Avatar
            variant="rounded"
            src={project.logo}
            alt={project.title}
            sx={{
              height: 54,
              width: 54,
              flex: '1 0 auto',
              borderRadius: 2.5,
              bgcolor: 'transparent',
            }}
          >
            {project.title.charAt(0)}
          </Avatar>
        </Grid>
        <Grid size={{ xs: 12, sm: 'grow' }} order={{ xs: 1, sm: 0 }}>
          <Stack direction="column" gap={2} flex={1}>
            <Stack direction="column" gap={0.5}>
              <Typography component="h2" variant="h6" lineHeight={1.5}>
                {isPurchased ? (
                  <Link component={RouterLink} to={projectUrl} color="inherit" underline="none">
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </Typography>
              <Stack direction="row" gap={{ xs: 1, sm: 2 }} flexWrap="wrap" alignItems="center">
                <Stack
                  direction="row"
                  gap={{ xs: 1, sm: 2 }}
                  flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                  alignItems="center"
                >
                  <Typography variant="subtitle2" fontWeight={600} title={technologies.join(', ')}>
                    {technologySummary}
                  </Typography>
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
                    label={project.levelTitle}
                    size="small"
                    aria-label={`${t('projects.level')}: ${project.levelTitle}`}
                  />
                </Stack>
                <KepcoinValue
                  value={project.kepcoins ?? 0}
                  textVariant="subtitle2"
                  fontWeight={500}
                  iconSize={16}
                  title={t('projects.kepcoinReward')}
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              gap={1.5}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                sx={{ flex: '1 1 200px' }}
              >
                {description || t('projects.cardFallback')}
              </Typography>
              {showTrackedProgress && currentUser && progress && (
                <ProjectProgress progress={progress} />
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid size="auto" flexGrow={{ xs: 1, sm: 0 }}>
          <Stack
            direction="row"
            gap={1}
            alignSelf="flex-start"
            justifyContent="flex-end"
            minWidth={0}
          >
            {isPurchased ? (
              <Button
                component={RouterLink}
                to={projectUrl}
                shape="square"
                color="neutral"
                aria-label={t('projects.view')}
                title={t('projects.view')}
              >
                <IconifyIcon icon="material-symbols:arrow-forward" sx={{ fontSize: 20 }} />
              </Button>
            ) : (
              <>
                <KepcoinSpendConfirm
                  value={project.purchaseKepcoinValue}
                  purchaseUrl={`/api/projects/${project.slug}/purchase/`}
                  onSuccess={handlePurchaseSuccess}
                >
                  <Button
                    shape="square"
                    color="neutral"
                    aria-label={t('projects.purchase')}
                    title={t('projects.purchase')}
                  >
                    <IconifyIcon
                      icon="material-symbols:shopping-cart-outline"
                      sx={{ fontSize: 20 }}
                    />
                  </Button>
                </KepcoinSpendConfirm>
                <KepcoinValue
                  value={project.purchaseKepcoinValue}
                  iconSize={16}
                  textVariant="caption"
                  fontWeight={500}
                  title={t('projects.purchase')}
                />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProjectCard;
