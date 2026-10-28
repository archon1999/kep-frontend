import { useState } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import {
  PROJECT_CATEGORY_ORDER,
  PROJECT_PAGE_SIZE,
  PROJECT_SORT_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  ProjectListFilters,
  buildProjectProgressLookup,
  filterAndSortProjects,
} from 'modules/projects/application/project-listing';
import { useProjectsList, useUserProjectAttempts } from 'modules/projects/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam, stringParam } from 'shared/lib/queryParams';

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

export const useProjectsListPage = () => {
  const { currentUser } = useAuth();

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
  return {
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
  };
};
