import useRouteQueryState from '../../../../shared/hooks/useRouteQueryState.ts';
import {
  booleanFlagParam,
  enumParam,
  numberParam,
  stringParam,
} from '../../../../shared/lib/queryParams.ts';

export const useProblemWorkspaceRoute = () => {
  const { state, setField, patchState } = useRouteQueryState({
    defaults: {
      activeTab: 'description' as 'description' | 'code' | 'attempts' | 'stats' | 'solvers',
      attemptsLang: '',
      attemptsVerdict: '',
      allAttempts: false,
      attemptsPage: 1,
      attemptsPageSize: 10,
    },
    schema: {
      activeTab: {
        ...enumParam(['description', 'code', 'attempts', 'stats', 'solvers'] as const),
        param: 'tab',
      },
      attemptsLang: stringParam(),
      attemptsVerdict: stringParam(),
      allAttempts: booleanFlagParam(),
      attemptsPage: numberParam({ min: 1 }),
      attemptsPageSize: numberParam({ min: 1 }),
    },
    historyByKey: { activeTab: 'push', attemptsPage: 'push', attemptsPageSize: 'push' },
  });
  return {
    activeTab: state.activeTab,
    handleTabChange: (tab: typeof state.activeTab) => setField('activeTab', tab),
    myAttemptsOnly: !state.allAttempts,
    handleToggleMyAttempts: () => patchState({ allAttempts: !state.allAttempts, attemptsPage: 1 }),
    attemptsLangFilter: state.attemptsLang,
    attemptsVerdictFilter: state.attemptsVerdict,
    handleAttemptsLangFilterChange: (value: string) =>
      patchState({ attemptsLang: value, attemptsPage: 1 }),
    handleAttemptsVerdictFilterChange: (value: string) =>
      patchState({ attemptsVerdict: value, attemptsPage: 1 }),
    attemptsPagination: { page: state.attemptsPage - 1, pageSize: state.attemptsPageSize },
    onAttemptsPaginationChange: (model: { page: number; pageSize: number }) =>
      patchState({ attemptsPage: model.page + 1, attemptsPageSize: model.pageSize }),
  };
};
