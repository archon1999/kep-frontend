import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Chip, Link, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { interactiveContentSx } from 'app/theme/styles/content';
import { contentEntranceStyles } from 'app/theme/styles/transitions';
import {
  ProjectCategoryKey,
  ProjectProgressSummary,
  stripProjectDescription,
} from 'modules/projects/application/project-listing';
import { Project } from 'modules/projects/domain/entities/project.entity';
import ProjectTechnologyLogo from 'modules/projects/ui/shared/components/ProjectTechnologyLogo';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import ProjectProgress from './ProjectProgress';

interface ProjectCardProps {
  project: Project;
  category: ProjectCategoryKey;
  progress?: ProjectProgressSummary;
  showTrackedProgress?: boolean;
  onPurchased?: (project: Project) => void;
}

const projectRowSx = {
  ...contentEntranceStyles,
  ...interactiveContentSx,
  px: 'var(--kep-content-inset)',
  py: 3,
  borderBottom: '1px solid var(--kep-line)',
};

export const ProjectCardSkeleton = () => (
  <Box sx={projectRowSx}>
    <Stack direction="row" gap={2} alignItems="center" mb={2}>
      <Skeleton variant="rectangular" width={44} height={44} />
      <Stack sx={{ flex: 1 }}>
        <Skeleton width="55%" height={30} />
        <Skeleton width="30%" height={24} />
      </Stack>
    </Stack>
    <Skeleton width="90%" height={22} />
    <Skeleton width="65%" height={22} />
    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
      <Skeleton width={110} height={24} />
      <Skeleton width={130} height={42} />
    </Stack>
  </Box>
);

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
    <Box component="article" sx={projectRowSx}>
      <Stack direction="row" gap={2} alignItems="center" mb={2}>
        <Avatar
          variant="square"
          src={project.logo}
          alt=""
          sx={{
            width: 44,
            height: 44,
            bgcolor: 'transparent',
            flexShrink: 0,
            '& img': { objectFit: 'contain' },
          }}
        >
          {project.title.charAt(0)}
        </Avatar>
        <Stack gap={0.75} sx={{ minWidth: 0, flex: 1 }}>
          <Typography component="h2" variant="h6" sx={{ overflowWrap: 'anywhere' }}>
            {isPurchased ? (
              <Link component={RouterLink} to={projectUrl} color="inherit" underline="none">
                <ScrambleText mixed>{project.title}</ScrambleText>
              </Link>
            ) : (
              <MixedText>{project.title}</MixedText>
            )}
          </Typography>
          <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
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
              aria-label={`${t('projects.level')}: ${project.levelTitle}`}
            />
            {project.tasks.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {t('projects.taskSummary', { count: project.tasks.length })}
              </Typography>
            )}
          </Stack>
        </Stack>
        <PatternArtwork
          kind="hackathon"
          sx={{ width: 92, display: { xs: 'none', sm: 'block' }, opacity: 0.55 }}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 920 }}>
        {description || t('projects.cardFallback')}
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mt={2.5}
      >
        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" gap={0.75} title={technologies.join(', ')}>
            {technologies.slice(0, 3).map((technology) => (
              <ProjectTechnologyLogo key={technology} technology={technology} size={22} />
            ))}
            {technologies.length > 3 && (
              <Typography variant="caption">+{technologies.length - 3}</Typography>
            )}
          </Stack>
          {project.kepcoins !== undefined && (
            <KepcoinValue
              value={project.kepcoins}
              textVariant="metric"
              iconSize={18}
              title={t('projects.kepcoinReward')}
            />
          )}
          {showTrackedProgress && currentUser && progress && (
            <ProjectProgress progress={progress} />
          )}
        </Stack>
        {isPurchased ? (
          <Button
            component={RouterLink}
            to={projectUrl}
            variant="contained"
            endIcon={<IconifyIcon icon="material-symbols:arrow-forward" />}
          >
            {t('projects.view')}
          </Button>
        ) : (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <KepcoinValue
              value={project.purchaseKepcoinValue}
              iconSize={18}
              textVariant="metric"
              title={t('projects.purchase')}
            />
            <KepcoinSpendConfirm
              value={project.purchaseKepcoinValue}
              purchaseUrl={`/api/projects/${project.slug}/purchase/`}
              onSuccess={handlePurchaseSuccess}
            >
              <Button
                variant="outlined"
                startIcon={<IconifyIcon icon="material-symbols:lock-open-outline" />}
              >
                {t('projects.purchase')}
              </Button>
            </KepcoinSpendConfirm>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ProjectCard;
