import { useTranslation } from 'react-i18next';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProjectsList, useUserProjectAttempts } from '../../application/queries';
import ProjectCard from '../components/ProjectCard.tsx';
import {
  buildProjectProgressLookup,
  getProjectCategory,
  PROJECT_CATEGORY_META,
  PROJECT_CATEGORY_ORDER,
} from '../lib/project-listing';

const ProjectsListPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { data: projects, isLoading } = useProjectsList();
  const { data: attempts } = useUserProjectAttempts(currentUser?.username);

  const showEmptyState = !isLoading && (!projects || projects.length === 0);
  const progressLookup = buildProjectProgressLookup(projects ?? [], attempts);
  const sections = PROJECT_CATEGORY_ORDER.map((category) => ({
    category,
    meta: PROJECT_CATEGORY_META[category],
    projects: (projects ?? []).filter((project) => getProjectCategory(project) === category),
  })).filter((section) => section.projects.length > 0);

  const totalProjects = projects?.length ?? 0;
  const startedProjects = (projects ?? []).filter(
    (project) => (progressLookup[project.id]?.attemptCount ?? 0) > 0,
  ).length;
  const completedProjects = (projects ?? []).filter(
    (project) => progressLookup[project.id]?.completed,
  ).length;
  const rewardPool = (projects ?? []).reduce(
    (sum, project) => sum + Number(project.kepcoins ?? 0),
    0,
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 6,
            p: { xs: 3, md: 4 },
            border: `1px solid ${alpha('#ff8a00', 0.18)}`,
            background: `
              radial-gradient(circle at top right, ${alpha('#ff8a00', 0.18)} 0%, transparent 26%),
              radial-gradient(circle at bottom left, ${alpha('#00a7b5', 0.16)} 0%, transparent 28%),
              linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha('#f7f0e3', 0.7)} 100%)
            `,
          }}
        >
          <Stack spacing={3} sx={{ position: 'relative' }}>
            <Stack spacing={1}>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{ letterSpacing: '-0.04em', maxWidth: 760 }}
              >
                {t('projects.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('projects.subtitle')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<IconifyIcon icon="mdi:shape-outline" width={18} />}
                label={t('projects.stats.available', { count: totalProjects })}
                sx={{ px: 0.75, py: 2.25, borderRadius: 999, bgcolor: alpha('#ff8a00', 0.12), fontWeight: 800 }}
              />
              <Chip
                icon={<IconifyIcon icon="mdi:chart-timeline-variant" width={18} />}
                label={t('projects.stats.started', { count: startedProjects })}
                sx={{ px: 0.75, py: 2.25, borderRadius: 999, bgcolor: alpha('#00a7b5', 0.12), fontWeight: 800 }}
              />
              <Chip
                icon={<IconifyIcon icon="mdi:check-decagram" width={18} />}
                label={t('projects.stats.completed', { count: completedProjects })}
                sx={{ px: 0.75, py: 2.25, borderRadius: 999, bgcolor: alpha('#2f9e44', 0.12), fontWeight: 800 }}
              />
              <Chip
                icon={<IconifyIcon icon="mdi:star-four-points-circle" width={18} />}
                label={t('projects.stats.rewardPool', { count: rewardPool })}
                sx={{ px: 0.75, py: 2.25, borderRadius: 999, bgcolor: alpha('#d9480f', 0.12), fontWeight: 800 }}
              />
            </Stack>

            {!currentUser ? (
              <Typography variant="body2" color="text.secondary">
                {t('projects.progressGuestHint')}
              </Typography>
            ) : null}
          </Stack>
        </Box>

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 4,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('projects.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('projects.emptySubtitle')}
            </Typography>
          </Box>
        ) : isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid size={{ xs: 12, md: 6, xl: 4 }} key={idx}>
                <Skeleton variant="rounded" height={420} sx={{ borderRadius: 5 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={4}>
            {sections.map((section) => (
              <Stack key={section.category} spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha(section.meta.accent, 0.14),
                        color: section.meta.accent,
                      }}
                    >
                      <IconifyIcon icon={section.meta.icon} width={26} />
                    </Box>

                    <Box>
                      <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.03em' }}>
                        {t(section.meta.labelKey)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(section.meta.subtitleKey)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={t('projects.projectsCount', { count: section.projects.length })}
                    sx={{
                      borderRadius: 999,
                      bgcolor: alpha(section.meta.accent, 0.1),
                      color: section.meta.accent,
                      fontWeight: 800,
                    }}
                  />
                </Stack>

                <Grid container spacing={3}>
                  {section.projects.map((project) => (
                    <Grid size={{ xs: 12, md: 6, xl: 4 }} key={project.id}>
                      <ProjectCard
                        project={project}
                        category={section.category}
                        progress={progressLookup[project.id]}
                        showTrackedProgress={Boolean(currentUser)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ProjectsListPage;
