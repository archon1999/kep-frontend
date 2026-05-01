import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProjectsList, useUserProjectAttempts } from '../../application/queries';
import ProjectCard from '../components/ProjectCard.tsx';
import {
  PROJECT_CATEGORY_META,
  PROJECT_CATEGORY_ORDER,
  buildProjectProgressLookup,
  getProjectCategory,
} from '../lib/project-listing';

const projectCardGridSize = { xs: 12, lg: 6 };

const ProjectsListPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { data: projects, isLoading } = useProjectsList();
  const { data: attempts } = useUserProjectAttempts(currentUser?.username);
  const visibleProjects = (projects ?? []).filter(
    (project) => currentUser?.isSuperuser || !project.inThePipeline,
  );

  const showEmptyState = !isLoading && visibleProjects.length === 0;
  const progressLookup = buildProjectProgressLookup(visibleProjects, attempts);
  const sections = PROJECT_CATEGORY_ORDER.map((category) => ({
    category,
    meta: PROJECT_CATEGORY_META[category],
    projects: visibleProjects.filter((project) => getProjectCategory(project) === category),
  })).filter((section) => section.projects.length > 0);

  const totalProjects = visibleProjects.length;
  const startedProjects = visibleProjects.filter(
    (project) => (progressLookup[project.id]?.attemptCount ?? 0) > 0,
  ).length;
  const completedProjects = visibleProjects.filter(
    (project) => progressLookup[project.id]?.completed,
  ).length;
  const rewardPool = visibleProjects.reduce(
    (sum, project) => sum + Number(project.kepcoins ?? 0),
    0,
  );
  const projectsWithProgress = visibleProjects.filter((project) => progressLookup[project.id]);
  const averageProgress = projectsWithProgress.length
    ? Math.round(
        projectsWithProgress.reduce(
          (sum, project) => sum + (progressLookup[project.id]?.progressPercent ?? 0),
          0,
        ) / projectsWithProgress.length,
      )
    : 0;

  const headerStats = [
    {
      icon: 'mdi:shape-outline',
      value: totalProjects,
      label: t('projects.headerMetrics.available'),
      color: '#ff8a00',
    },
    {
      icon: 'mdi:chart-timeline-variant',
      value: startedProjects,
      label: t('projects.headerMetrics.started'),
      color: '#00a7b5',
    },
    {
      icon: 'mdi:check-decagram',
      value: completedProjects,
      label: t('projects.headerMetrics.completed'),
      color: '#2f9e44',
    },
    {
      image: kepcoinImage,
      value: rewardPool,
      label: t('projects.headerMetrics.rewardPool'),
      color: '#d9480f',
    },
  ];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            border: 'none',
            boxShadow: 'none',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.2 : 0.12)}, ${alpha(theme.palette.info.main, theme.palette.mode === 'dark' ? 0.12 : 0.08)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
            <Stack
              sx={{
                rowGap: 2.5,
                columnGap: { lg: 3, xl: 5 },
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { lg: 'center' },
              }}
            >
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
                  {t('projects.title')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 620 }}>
                  {t('projects.subtitle')}
                </Typography>
              </Box>

              <Stack
                sx={{
                  flex: 1,
                  gap: { xs: 2, md: 3 },
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', md: 'row' },
                  flexWrap: 'wrap',
                }}
              >
                {headerStats.map((stat) => (
                  <Stack
                    key={stat.label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: 150 }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        bgcolor: alpha(stat.color, theme.palette.mode === 'dark' ? 0.18 : 0.12),
                        color: stat.color,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {'image' in stat ? (
                        <Box
                          component="img"
                          src={stat.image}
                          alt={stat.label}
                          sx={{ width: 21, height: 21 }}
                        />
                      ) : (
                        <IconifyIcon icon={stat.icon} width={17} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={800}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                ))}

                <Chip
                  icon={<IconifyIcon icon="mdi:progress-check" width={18} />}
                  label={`${averageProgress}% ${t('projects.headerMetrics.averageProgress')}`}
                  sx={{
                    alignSelf: { xs: 'flex-start', md: 'center' },
                    borderRadius: 999,
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === 'dark' ? 0.18 : 0.1,
                    ),
                    color: 'primary.main',
                    fontWeight: 900,
                  }}
                />
              </Stack>
            </Stack>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              right: { xs: -28, md: 24 },
              bottom: { xs: -36, md: -20 },
              opacity: theme.palette.mode === 'dark' ? 0.06 : 0.08,
              pointerEvents: 'none',
            }}
          >
            <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
          </Box>
        </Card>

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
              <Grid size={projectCardGridSize} key={idx}>
                <Skeleton variant="rounded" height={260} sx={{ borderRadius: 5 }} />
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
                      <Typography variant="h5" fontWeight={900}>
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
                    <Grid size={projectCardGridSize} key={project.id}>
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
