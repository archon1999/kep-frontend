import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { SxProps, Theme, alpha, useTheme } from '@mui/material/styles';
import { getResourceByParams, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { projectsQueries } from '../../application/queries';
import { Project } from '../../domain/entities/project.entity';
import {
  PROJECT_CATEGORY_META,
  ProjectCategoryKey,
  ProjectProgressSummary,
  getProjectTaskCount,
  stripProjectDescription,
} from '../lib/project-listing';

interface ProjectCardProps {
  project: Project;
  category: ProjectCategoryKey;
  progress?: ProjectProgressSummary;
  showTrackedProgress?: boolean;
  onPurchased?: (project: Project) => void;
}

const mergeSx = (base: SxProps<Theme>, extra?: SxProps<Theme>): SxProps<Theme> => {
  if (extra == null) {
    return base;
  }

  const baseEntries = Array.isArray(base) ? base : [base];
  const extraEntries = Array.isArray(extra) ? extra : [extra];

  return [...baseEntries, ...extraEntries] as SxProps<Theme>;
};

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
  const taskCount = getProjectTaskCount(project);
  const isCompleted = Boolean(progress?.completed);
  const projectUrl = getResourceByParams(resources.Project, {
    id: project.slug,
    slug: project.slug,
  });

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

  const renderLogo = () => (
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: 2,
        p: 0.75,
        bgcolor: alpha(theme.palette.background.paper, 0.9),
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
        <IconifyIcon icon={categoryMeta.icon} width={28} color={categoryMeta.accent} />
      )}
    </Box>
  );

  const renderActionButton = (sx?: SxProps<Theme>) => {
    const sharedSx: SxProps<Theme> = mergeSx(
      {
        py: 1,
        px: 2,
        borderRadius: 2,
        fontWeight: 900,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      },
      sx,
    );

    if (isPurchased) {
      return (
        <Button
          component={RouterLink}
          to={projectUrl}
          endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
          sx={mergeSx(
            {
              color: theme.palette.common.white,
              background: `linear-gradient(135deg, ${categoryMeta.accent} 0%, ${alpha(categoryMeta.accent, 0.72)} 100%)`,
              boxShadow: `0 18px 34px -20px ${alpha(categoryMeta.accent, 0.85)}`,
            },
            sharedSx,
          )}
        >
          {t('projects.view')}
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePurchase}
        disabled={isPurchasing}
        startIcon={<IconifyIcon icon="mdi:cart-plus" />}
        sx={mergeSx(
          {
            color: theme.palette.text.primary,
            bgcolor: alpha(theme.palette.background.paper, 0.88),
            border: `1px solid ${alpha(categoryMeta.accent, 0.2)}`,
            '&:hover': {
              bgcolor: theme.palette.background.paper,
            },
          },
          sharedSx,
        )}
      >
        {t('projects.purchase')}
        <KepcoinValue value={project.purchaseKepcoinValue} iconSize={16} sx={{ ml: 1 }} />
      </Button>
    );
  };

  const renderProgressStatus = () => (
    <Typography variant="subtitle2" fontWeight={900}>
      {showTrackedProgress
        ? isCompleted
          ? t('projects.progressCompleted')
          : `${earnedKepcoins}/${totalKepcoins || project.kepcoins || 0} ${t('projects.progressRewardUnit')}`
        : t('projects.progressHint')}
    </Typography>
  );

  const renderProgressPanel = () => (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.06)
            : alpha(theme.palette.background.paper, 0.72),
        border: `1px solid ${alpha(categoryMeta.accent, 0.12)}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Box minWidth={0}>
          <Typography variant="caption" color="text.secondary">
            {showTrackedProgress ? t('projects.progressTitle') : t('projects.progressPrompt')}
          </Typography>
          {renderProgressStatus()}
        </Box>

        <Box
          sx={{
            minWidth: 56,
            px: 1.25,
            py: 0.75,
            borderRadius: 2,
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
          height: 8,
          borderRadius: 999,
          bgcolor: alpha(theme.palette.text.primary, 0.08),
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            background: `linear-gradient(90deg, ${categoryMeta.accent} 0%, ${categoryMeta.softAccent} 100%)`,
          },
        }}
      />
    </Box>
  );

  const titleSx: SxProps<Theme> = {
    lineHeight: 1.08,
    overflowWrap: 'anywhere',
  };

  return (
    <Card
      sx={{
        height: 1,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        border: `1px solid ${alpha(categoryMeta.accent, 0.16)}`,
        background: alpha(theme.palette.background.paper, 0.98),
        boxShadow: 'none',
        transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          bgcolor: alpha(categoryMeta.accent, 0.04),
          borderColor: alpha(categoryMeta.accent, 0.28),
        },
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ height: 1 }}>
        {renderLogo()}

        <Stack spacing={1.5} flex={1} minWidth={0}>
          <Stack spacing={0.75}>
            <Typography variant="h6" fontWeight={900} sx={titleSx}>
              {project.title}
            </Typography>
            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                {t(categoryMeta.labelKey)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {project.levelTitle}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {taskCount} {t('projects.tasks').toLowerCase()}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || t('projects.cardFallback')}
          </Typography>

          <Box sx={{ mt: 'auto' }}>{renderProgressPanel()}</Box>
        </Stack>

        <Stack
          spacing={1.5}
          alignItems={{ xs: 'stretch', sm: 'flex-end' }}
          justifyContent="space-between"
          minWidth={{ sm: 150 }}
        >
          <Chip
            label={project.fileAccept.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2, borderColor: alpha(categoryMeta.accent, 0.24) }}
          />
          <KepcoinValue
            value={project.kepcoins}
            iconSize={18}
            textVariant="subtitle1"
            fontWeight={900}
          />
          {renderActionButton()}
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProjectCard;
