import { useMemo } from 'react';
import { ProblemsListParams } from 'modules/problems/domain/contracts/problems.repository.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import {
  booleanFlagParam,
  enumParam,
  numberArrayParam,
  numberParam,
  stringParam,
} from 'shared/lib/queryParams';
import {
  type ProblemsListQueryState,
  buildAdvisorFilterPatch,
  buildProblemsListFilter,
  buildProblemsListPatch,
  problemsListQueryDefaults,
} from '../problems-list-filters';

export const useProblemsListFilters = () => {
  const {
    state: routeState,
    setField: setRouteField,
    patchState: patchRouteState,
  } = useRouteQueryState<ProblemsListQueryState>({
    defaults: problemsListQueryDefaults,
    schema: {
      activeTab: {
        ...enumParam(['lastContest', 'attempts', 'mostViewed'] as const),
        param: 'tab',
      },
      search: {
        ...stringParam(),
        param: 'search',
      },
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
      pageSize: {
        ...numberParam({ min: 1 }),
        param: 'pageSize',
      },
      tags: {
        ...numberArrayParam({ min: 1 }),
        param: 'tags',
      },
      groups: {
        ...numberArrayParam({ min: 1 }),
        param: 'groups',
      },
      favorites: {
        ...booleanFlagParam(),
        param: 'favorites',
      },
      category: {
        ...stringParam(),
        param: 'category',
      },
      lang: {
        ...stringParam(),
        param: 'lang',
      },
      exclusive_lang: {
        ...stringParam(),
        param: 'exclusive_lang',
      },
      competitive_langs_only: {
        ...stringParam(),
        param: 'competitive_langs_only',
      },
      difficulty: {
        ...stringParam(),
        param: 'difficulty',
      },
      status: {
        ...numberParam(),
        param: 'status',
      },
      problem_rating_min: {
        ...stringParam(),
        param: 'problem_rating_min',
      },
      problem_rating_max: {
        ...stringParam(),
        param: 'problem_rating_max',
      },
      has_solution: {
        ...stringParam(),
        param: 'has_solution',
      },
      has_checker: {
        ...stringParam(),
        param: 'has_checker',
      },
      partial_solvable: {
        ...stringParam(),
        param: 'partial_solvable',
      },
    },
    historyByKey: {
      activeTab: 'push',
      page: 'push',
      pageSize: 'push',
    },
    pageResetKeys: [
      'search',
      'ordering',
      'tags',
      'groups',
      'favorites',
      'category',
      'lang',
      'exclusive_lang',
      'competitive_langs_only',
      'difficulty',
      'status',
      'problem_rating_min',
      'problem_rating_max',
      'has_solution',
      'has_checker',
      'partial_solvable',
    ],
  });
  const filter = useMemo(() => buildProblemsListFilter(routeState), [routeState]);

  const handleFilterPatch = (patch: Partial<ProblemsListParams>) =>
    patchRouteState(buildProblemsListPatch(patch));
  const handleFilterChange = <K extends keyof ProblemsListParams>(
    key: K,
    value: ProblemsListParams[K],
  ) => handleFilterPatch({ [key]: value });
  return {
    filter,
    activeTab: routeState.activeTab,
    handleFilterChange,
    handleFilterPatch,
    handlePageChange: (page: number) => setRouteField('page', page),
    handleTabChange: (tab: string) => {
      if (tab === 'lastContest' || tab === 'attempts' || tab === 'mostViewed')
        setRouteField('activeTab', tab);
    },
    handleAdvisorApply: (patch: Partial<ProblemsListParams>) =>
      patchRouteState(buildAdvisorFilterPatch(patch), { resetPages: false }),
  };
};
