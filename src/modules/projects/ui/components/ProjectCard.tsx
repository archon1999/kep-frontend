import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { resources, getResourceByParams } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { projectsQueries } from '../../application/queries';
import { Project } from '../../domain/entities/project.entity';
import {
  getProjectTaskCount,
  PROJECT_CATEGORY_META,
  ProjectCategoryKey,
  ProjectProgressSummary,
  stripProjectDescription,
} from '../lib/project-listing';

interface ProjectCardProps {
  project: Project;
  category: ProjectCategoryKey;
  progress?: ProjectProgressSummary;
  showTrackedProgress?: boolean;
  onPurchased?: (project: Project) => void;
}

const ProjectCard = ({
  project,
  category,
  progress,
  showTrackedProgress = false,
  onPurchased,
}: ProjectCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(project.purchased);

  const categoryMeta = PROJECT_CATEGORY_META[category];
  const description = stripProjectDescription(project.descriptionShort);
  const totalKepcoins = Number(progress?.totalKepcoins ?? project.kepcoins ?? 0);
  const earnedKepcoins = Number(progress?.earnedKepcoins ?? 0);
  const progressPercent = Number(progress?.progressPercent ?? 0);
  const attemptCount = progress?.attemptCount ?? 0;
  const taskCount = getProjectTaskCount(project);
  const isCompleted = Boolean(progress?.completed);
  const displayTags = (project.tags ?? []).slice(0, 3);

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
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: 1,
        borderRadius: 5,
        border: `1px solid ${alpha(categoryMeta.accent, 0.18)}`,
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(categoryMeta.softAccent, 0.09)} 100%)`,
        boxShadow: `0 28px 80px -50px ${alpha(categoryMeta.accent, 0.55)}`,
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 36px 90px -44px ${alpha(categoryMeta.accent, 0.7)}`,
          borderColor: alpha(categoryMeta.accent, 0.35),
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at top right, ${alpha(categoryMeta.accent, 0.24)} 0%, transparent 28%),
            radial-gradient(circle at bottom left, ${alpha(categoryMeta.softAccent, 0.28)} 0%, transparent 24%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Stack sx={{ position: 'relative', height: 1, p: 3 }} spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip
            icon={<IconifyIcon icon={categoryMeta.icon} width={16} />}
            label={t(categoryMeta.labelKey)}
            size="small"
            sx={{
              bgcolor: alpha(categoryMeta.accent, 0.12),
              color: categoryMeta.accent,
              fontWeight: 800,
              borderRadius: 999,
            }}
          />
          <Chip
            label={project.levelTitle}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.06),
              fontWeight: 700,
              borderRadius: 999,
            }}
          />
          <Chip
            label={project.fileAccept.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{
              borderColor: alpha(categoryMeta.accent, 0.22),
              color: theme.palette.text.secondary,
              borderRadius: 999,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {project.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1.25,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 60,
              }}
            >
              {description || t('projects.cardFallback')}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 74,
              height: 74,
              borderRadius: 4,
              p: 1.25,
              bgcolor: alpha(theme.palette.common.white, 0.88),
              border: `1px solid ${alpha(categoryMeta.accent, 0.18)}`,
              boxShadow: `0 18px 30px -24px ${alpha(categoryMeta.accent, 0.7)}`,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {project.logo ? (
              <Box
                component="img"
                src={project.logo}
                alt={project.title}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <IconifyIcon icon={categoryMeta.icon} width={34} color={categoryMeta.accent} />
            )}
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Box
            sx={{
              flex: '1 1 160px',
              minWidth: 0,
              borderRadius: 3,
              px: 1.5,
              py: 1.25,
              bgcolor: alpha(categoryMeta.accent, 0.08),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('projects.rewardPool')}
            </Typography>
            <KepcoinValue
              value={project.kepcoins}
              iconSize={18}
              textVariant="subtitle2"
              fontWeight={900}
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box
            sx={{
              flex: '1 1 120px',
              minWidth: 0,
              borderRadius: 3,
              px: 1.5,
              py: 1.25,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('projects.taskCount')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={900} sx={{ mt: 0.5 }}>
              {taskCount}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: '1 1 120px',
              minWidth: 0,
              borderRadius: 3,
              px: 1.5,
              py: 1.25,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('projects.attemptsCount')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={900} sx={{ mt: 0.5 }}>
              {attemptCount}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.common.white, 0.55),
            border: `1px solid ${alpha(categoryMeta.accent, 0.12)}`,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {showTrackedProgress ? t('projects.progressTitle') : t('projects.progressPrompt')}
              </Typography>
              <Typography variant="subtitle2" fontWeight={900}>
                {showTrackedProgress
                  ? isCompleted
                    ? t('projects.progressCompleted')
                    : `${earnedKepcoins}/${totalKepcoins || project.kepcoins || 0} ${t('projects.progressRewardUnit')}`
                  : t('projects.progressHint')}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: 68,
                px: 1.25,
                py: 0.75,
                borderRadius: 999,
                textAlign: 'center',
                bgcolor: isCompleted
                  ? alpha(theme.palette.success.main, 0.12)
                  : alpha(categoryMeta.accent, 0.12),
                color: isCompleted ? theme.palette.success.main : categoryMeta.accent,
              }}
            >
              <Typography variant="subtitle2" fontWeight={900}>
                {showTrackedProgress ? `${progressPercent}%` : '--'}
              </Typography>
            </Box>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={showTrackedProgress ? progressPercent : 0}
            sx={{
              mt: 1.5,
              height: 10,
              borderRadius: 999,
              bgcolor: alpha(theme.palette.text.primary, 0.08),
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                background: `linear-gradient(90deg, ${categoryMeta.accent} 0%, ${categoryMeta.softAccent} 100%)`,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {project.availableTechnologies.map((technology) => (
            <Chip
              key={technology.technology}
              label={technology.technology}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 999,
                borderColor: alpha(categoryMeta.accent, 0.18),
                bgcolor: alpha(theme.palette.background.paper, 0.75),
              }}
            />
          ))}
          {displayTags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                borderRadius: 999,
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                color: 'text.secondary',
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ borderColor: alpha(categoryMeta.accent, 0.12) }} />

        {isPurchased ? (
          <Button
            fullWidth
            component={RouterLink}
            to={getResourceByParams(resources.Project, { id: project.slug, slug: project.slug })}
            endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
            sx={{
              py: 1.35,
              borderRadius: 999,
              fontWeight: 900,
              color: theme.palette.common.white,
              background: `linear-gradient(135deg, ${categoryMeta.accent} 0%, ${alpha(categoryMeta.accent, 0.72)} 100%)`,
              boxShadow: `0 18px 34px -20px ${alpha(categoryMeta.accent, 0.85)}`,
            }}
          >
            {t('projects.view')}
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={handlePurchase}
            disabled={isPurchasing}
            startIcon={<IconifyIcon icon="mdi:cart-plus" />}
            sx={{
              py: 1.35,
              borderRadius: 999,
              fontWeight: 900,
              color: theme.palette.text.primary,
              bgcolor: alpha(theme.palette.common.white, 0.88),
              border: `1px solid ${alpha(categoryMeta.accent, 0.2)}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 1),
              },
            }}
          >
            {t('projects.purchase')}
            <KepcoinValue value={project.purchaseKepcoinValue} iconSize={16} sx={{ ml: 1 }} />
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default ProjectCard;
