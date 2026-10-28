import type { ProblemsListParams } from '../domain/contracts/problems.repository';

const initialFilter: ProblemsListParams = {
  ordering: 'id',
  page: 1,
  pageSize: 20,
  tags: [],
  groups: [],
};

export type ProblemsListQueryState = {
  activeTab: 'lastContest' | 'attempts' | 'mostViewed';
  search: string;
  ordering: string;
  page: number;
  pageSize: number;
  tags: number[];
  groups: number[];
  favorites: boolean;
  category: string;
  lang: string;
  exclusive_lang: string;
  competitive_langs_only: string;
  difficulty: string;
  status?: number;
  problem_rating_min: string;
  problem_rating_max: string;
  has_solution: string;
  has_checker: string;
  partial_solvable: string;
};

export const problemsListQueryDefaults: ProblemsListQueryState = {
  activeTab: 'lastContest',
  search: '',
  ordering: initialFilter.ordering ?? 'id',
  page: initialFilter.page ?? 1,
  pageSize: initialFilter.pageSize ?? 20,
  tags: [],
  groups: [],
  favorites: false,
  category: '',
  lang: '',
  exclusive_lang: '',
  competitive_langs_only: '',
  difficulty: '',
  status: undefined,
  problem_rating_min: '',
  problem_rating_max: '',
  has_solution: '',
  has_checker: '',
  partial_solvable: '',
};

export const buildProblemsListFilter = (state: ProblemsListQueryState): ProblemsListParams => ({
  ordering: state.ordering || initialFilter.ordering,
  page: state.page,
  pageSize: state.pageSize,
  tags: state.tags,
  groups: state.groups,
  search: state.search || undefined,
  favorites: state.favorites || undefined,
  category: state.category || undefined,
  lang: state.lang || undefined,
  exclusive_lang: state.exclusive_lang || undefined,
  competitive_langs_only: state.competitive_langs_only || undefined,
  difficulty: state.difficulty || undefined,
  status: state.status,
  problem_rating_min: state.problem_rating_min || undefined,
  problem_rating_max: state.problem_rating_max || undefined,
  has_solution: state.has_solution || undefined,
  has_checker: state.has_checker || undefined,
  partial_solvable: state.partial_solvable || undefined,
});

const normalizeProblemsListValue = <K extends keyof ProblemsListParams>(
  key: K,
  value: ProblemsListParams[K],
): ProblemsListQueryState[keyof ProblemsListQueryState] => {
  if (key === 'tags') {
    return Array.isArray(value) ? [...value] : [];
  }

  if (key === 'groups') {
    return Array.isArray(value) ? [...value] : [];
  }

  if (key === 'favorites') {
    return Boolean(value);
  }

  if (key === 'status') {
    return typeof value === 'number' ? value : undefined;
  }

  if (
    key === 'search' ||
    key === 'ordering' ||
    key === 'category' ||
    key === 'lang' ||
    key === 'exclusive_lang' ||
    key === 'competitive_langs_only' ||
    key === 'difficulty' ||
    key === 'problem_rating_min' ||
    key === 'problem_rating_max' ||
    key === 'has_solution' ||
    key === 'has_checker' ||
    key === 'partial_solvable'
  ) {
    return value == null ? '' : String(value);
  }

  return value as ProblemsListQueryState[keyof ProblemsListQueryState];
};

const advisorManagedFilterKeys = [
  'category',
  'tags',
  'groups',
  'lang',
  'exclusive_lang',
  'competitive_langs_only',
  'difficulty',
  'status',
  'ordering',
  'problem_rating_min',
  'problem_rating_max',
  'has_solution',
  'has_checker',
  'partial_solvable',
] as const;

export const buildProblemsListPatch = (
  patch: Partial<ProblemsListParams>,
): Partial<ProblemsListQueryState> => {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    next[key] = normalizeProblemsListValue(key as keyof ProblemsListParams, value);
  }
  return next as Partial<ProblemsListQueryState>;
};

export const buildAdvisorFilterPatch = (
  patch: Partial<ProblemsListParams>,
): Partial<ProblemsListQueryState> => {
  const defaults = Object.fromEntries(
    advisorManagedFilterKeys.map((key) => [key, problemsListQueryDefaults[key]]),
  );
  return {
    ...defaults,
    ...buildProblemsListPatch(patch),
    page: 1,
    tags: patch.tags ?? [],
    groups: patch.groups ?? [],
  };
};
