import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useProjectsListPage } from 'modules/projects/application/hooks/useProjectsListPage';
import { getProjectCategory } from 'modules/projects/application/project-listing';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import { FilterDrawerLayout, useFilterDrawer } from 'shared/components/common/FilterDrawer';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProjectCard, { ProjectCardSkeleton } from './components/ProjectCard';
import ProjectsFilterDrawer from './components/ProjectsFilterDrawer';
import ProjectsPagination from './components/ProjectsPagination';
import ProjectsToolbar from './components/ProjectsToolbar';

const ProjectsListPage = () => {
  const {
    currentUser,
    error,
    mutate,
    attempts,
    attemptsError,
    mutateAttempts,
    setField,
    patchState,
    progressLookup,
    activeFilters,
    filteredProjects,
    page,
    pagedProjects,
    visibleProjects,
    waitingForProgress,
    isLoadingResults,
    showProgress,
    showAll,
    setShowAll,
    levels,
  } = useProjectsListPage();

  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();

  return (
    <FilterDrawerLayout
      anchorEl={filterDrawer.anchorEl}
      open={filterDrawer.open}
      drawer={
        <ProjectsFilterDrawer
          open={filterDrawer.open}
          filters={activeFilters}
          onChange={setField}
          onReset={() => patchState({ category: 'all', level: 0, status: 'all' })}
          onClose={filterDrawer.close}
          levels={levels}
          showProgressFilter={Boolean(currentUser)}
          progressFilterDisabled={!attempts}
        />
      }
    >
      <PageHeader
        title={t('projects.title')}
        variant="detail"
        actionComponent={
          <Button
            component={RouterLink}
            to={resources.ProjectsRating}
            variant="outlined"
            startIcon={<IconifyIcon icon="mdi:podium" />}
          >
            {t('projects.rating.leaderboard')}
          </Button>
        }
      />
      <Box>
        <ProjectsToolbar
          filters={activeFilters}
          onChange={setField}
          onReset={() => patchState({ search: '', category: 'all', level: 0, status: 'all' })}
          onToggleFilters={filterDrawer.toggle}
          filtersOpen={filterDrawer.open}
          levels={levels}
        />
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" onClick={() => void mutate()}>
                {t('projects.retry')}
              </Button>
            }
          >
            {t('projects.listLoadError')}
          </Alert>
        )}
        {attemptsError && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" onClick={() => void mutateAttempts()}>
                {t('projects.retry')}
              </Button>
            }
          >
            {t('projects.progressLoadError')}
          </Alert>
        )}
        {isLoadingResults ? (
          <Stack direction="column" gap={0} aria-label={t('projects.loading')} aria-busy="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </Stack>
        ) : !error && !waitingForProgress ? (
          filteredProjects.length ? (
            <>
              <Stack direction="column" gap={0}>
                {pagedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    category={getProjectCategory(project)}
                    progress={progressLookup[project.id]}
                    showTrackedProgress={showProgress}
                    onPurchased={() => void mutate()}
                  />
                ))}
              </Stack>
              <ProjectsPagination
                count={filteredProjects.length}
                page={page}
                showAll={showAll}
                onPageChange={(nextPage) => setField('page', nextPage)}
                onToggleShowAll={() => {
                  setShowAll((previous) => !previous);
                  setField('page', 1);
                }}
              />
            </>
          ) : (
            <EmptyState
              kind="search"
              title={t(visibleProjects.length ? 'projects.noResults' : 'projects.emptyTitle')}
              description={t(
                visibleProjects.length ? 'projects.noResultsHint' : 'projects.emptySubtitle',
              )}
            />
          )
        ) : null}
      </Box>
    </FilterDrawerLayout>
  );
};

export default ProjectsListPage;
