import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useProjectsList, useUserProjectAttempts } from 'modules/projects/application/queries';
import { FilterDrawerLayout, useFilterDrawer } from 'shared/components/common/FilterDrawer';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam, stringParam } from 'shared/lib/queryParams';
import ProjectCard from './components/ProjectCard';
import ProjectsFilterDrawer from './components/ProjectsFilterDrawer';
import ProjectsPagination from './components/ProjectsPagination';
import ProjectsToolbar from './components/ProjectsToolbar';
import {
  PROJECT_CATEGORY_ORDER,
  PROJECT_PAGE_SIZE,
  PROJECT_SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  ProjectListFilters,
  buildProjectProgressLookup,
  filterAndSortProjects,
  getProjectCategory,
} from './project-listing';

const defaultFilters = {
  search: '',
  category: 'all' as ProjectListFilters['category'],
  level: 0,
  status: 'all' as ProjectListFilters['status'],
  sort: 'default' as ProjectListFilters['sort'],
  page: 1,
};
const filterSchema = {
  search: stringParam(),
  category: enumParam(['all', ...PROJECT_CATEGORY_ORDER]),
  level: numberParam({ min: 0 }),
  status: enumParam(PROJECT_STATUS_OPTIONS),
  sort: enumParam(PROJECT_SORT_OPTIONS),
  page: numberParam({ min: 1 }),
};

const ProjectsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const filterDrawer = useFilterDrawer();
  const [showAll, setShowAll] = useState(false);
  const { data: projects, isLoading, error, mutate } = useProjectsList(currentUser?.username);
  const {
    data: attempts,
    isLoading: isLoadingAttempts,
    error: attemptsError,
    mutate: mutateAttempts,
  } = useUserProjectAttempts(currentUser?.username);
  const { state, setField, patchState } = useRouteQueryState({
    defaults: defaultFilters,
    schema: filterSchema,
    pageResetKeys: ['search', 'category', 'level', 'status', 'sort'],
  });
  const visibleProjects = (projects ?? []).filter(
    (project) => currentUser?.isSuperuser || !project.inThePipeline,
  );
  const progressLookup = buildProjectProgressLookup(visibleProjects, attempts);
  const activeFilters: ProjectListFilters = {
    ...state,
    status: currentUser ? state.status : 'all',
  };
  const filteredProjects = filterAndSortProjects(visibleProjects, activeFilters, progressLookup);
  const waitingForProgress = Boolean(currentUser) && state.status !== 'all' && !attempts;
  const isLoadingResults = isLoading || (waitingForProgress && isLoadingAttempts);
  const showProgress = Boolean(currentUser) && Boolean(attempts);
  const page = showAll
    ? 1
    : Math.min(state.page, Math.max(1, Math.ceil(filteredProjects.length / PROJECT_PAGE_SIZE)));
  const pagedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice((page - 1) * PROJECT_PAGE_SIZE, page * PROJECT_PAGE_SIZE);
  const levels = Array.from(
    new Map(visibleProjects.map((project) => [project.level, project.levelTitle])),
  )
    .sort(([left], [right]) => left - right)
    .map(([value, label]) => ({ value, label }));

  return (
    <FilterDrawerLayout
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
      <Paper sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3, md: 5 }, pt: 3 }}>
        <Container maxWidth={false} disableGutters sx={{ maxWidth: 820 }}>
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
            <Stack
              direction="column"
              gap={1}
              mb={3}
              aria-label={t('projects.loading')}
              aria-busy="true"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={132} sx={{ borderRadius: 6 }} />
              ))}
            </Stack>
          ) : !error && !waitingForProgress ? (
            filteredProjects.length ? (
              <>
                <Stack direction="column" gap={1} mb={3}>
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
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {t(visibleProjects.length ? 'projects.noResults' : 'projects.emptyTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(visibleProjects.length ? 'projects.noResultsHint' : 'projects.emptySubtitle')}
                </Typography>
              </Box>
            )
          ) : null}
        </Container>
      </Paper>
    </FilterDrawerLayout>
  );
};

export default ProjectsListPage;
