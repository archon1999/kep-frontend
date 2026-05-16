import { SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { TabContext, TabList } from '@mui/lab';
import { Box, Button, Grid, Stack, Tab } from '@mui/material';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { resources } from 'app/routes/resources.ts';
import {
  useLastContestProblems,
  useMostViewedProblems,
  useProblemCategories,
  useProblemLanguages,
  useProblemsList,
  useStudyPlans,
  useUserProblemsAttempts,
  useUserProblemsRating,
} from 'modules/problems/application/queries.ts';
import { difficultyOptions } from 'modules/problems/config/difficulty';
import {
  ProblemCategory,
  ProblemLanguageOption,
} from 'modules/problems/domain/entities/problem.entity.ts';
import { ProblemsListParams } from 'modules/problems/domain/ports/problems.repository.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import AppliedFilters from 'shared/components/common/AppliedFilters.tsx';
import FilterButton from 'shared/components/common/FilterButton.tsx';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import {
  booleanFlagParam,
  enumParam,
  numberArrayParam,
  numberParam,
  stringParam,
} from 'shared/lib/queryParams';
import ProblemDifficultiesCard from './components/ProblemDifficultiesCard.tsx';
import ProblemList from './components/ProblemList.tsx';
import ProblemStudyPlansShowcase from './components/ProblemStudyPlansShowcase.tsx';
import ProblemTabsCard from './components/ProblemTabsCard.tsx';
import ProblemsFilterDrawer, { problemStatusOptions } from './components/ProblemsFilterDrawer.tsx';
import ProblemStudyPlanAdvisorDialog from './dialogs/ProblemStudyPlanAdvisorDialog.tsx';

const orderingOptions = [
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderEasiest', value: 'problem_rating,-solved' },
  { label: 'problems.orderHardest', value: '-problem_rating,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;

const initialFilter: ProblemsListParams = {
  ordering: 'id',
  page: 1,
  pageSize: 20,
  tags: [],
};

type ProblemsListQueryState = {
  activeTab: 'lastContest' | 'attempts' | 'mostViewed';
  search: string;
  ordering: string;
  page: number;
  pageSize: number;
  tags: number[];
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

const problemsListQueryDefaults: ProblemsListQueryState = {
  activeTab: 'lastContest',
  search: '',
  ordering: initialFilter.ordering ?? 'id',
  page: initialFilter.page ?? 1,
  pageSize: initialFilter.pageSize ?? 20,
  tags: [],
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

const buildProblemsListFilter = (state: ProblemsListQueryState): ProblemsListParams => ({
  ordering: state.ordering || initialFilter.ordering,
  page: state.page,
  pageSize: state.pageSize,
  tags: state.tags,
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

const formatProblemRatingBand = (min?: string, max?: string) => {
  if (min && max) {
    return `${min}-${max}`;
  }
  if (min) {
    return `${min}+`;
  }
  if (max) {
    return `<= ${max}`;
  }
  return '';
};

const advisorManagedFilterKeys = [
  'category',
  'tags',
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

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
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
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const filterDrawer = useFilterDrawer();

  const { data: problemsPage, isLoading: isProblemsLoading } = useProblemsList(filter);
  const { data: languages } = useProblemLanguages();
  const { data: categories } = useProblemCategories();
  const { data: studyPlans } = useStudyPlans();
  const { data: mostViewed, isLoading: isMostViewedLoading } = useMostViewedProblems();
  const { data: lastContest, isLoading: isLastContestLoading } = useLastContestProblems();
  const { data: attempts, isLoading: isAttemptsLoading } = useUserProblemsAttempts(
    currentUser?.username ?? undefined,
    10,
  );
  const { data: rating, isLoading: isRatingLoading } = useUserProblemsRating(
    currentUser?.username ?? undefined,
  );
  const isSummaryLoading = isRatingLoading || rating === undefined;

  const problems = problemsPage?.data ?? [];
  const total = problemsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof ProblemsListParams>(
    key: K,
    value: ProblemsListParams[K],
  ) => {
    setRouteField(
      key as keyof ProblemsListQueryState,
      normalizeProblemsListValue(key, value) as never,
    );
  };

  const handleFilterPatch = (patch: Partial<ProblemsListParams>) => {
    patchRouteState(() => {
      const nextPatch: Partial<ProblemsListQueryState> = {};
      const mutablePatch = nextPatch as Record<
        keyof ProblemsListQueryState,
        ProblemsListQueryState[keyof ProblemsListQueryState] | undefined
      >;

      (
        Object.entries(patch) as Array<
          [keyof ProblemsListParams, ProblemsListParams[keyof ProblemsListParams]]
        >
      ).forEach(([key, value]) => {
        mutablePatch[key as keyof ProblemsListQueryState] = normalizeProblemsListValue(
          key,
          value,
        ) as never;
      });

      return nextPatch;
    });
  };

  const handlePageChange = (_: unknown, page: number) => {
    setRouteField('page', page + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    patchRouteState(
      {
        pageSize: Number(event.target.value),
        page: 1,
      },
      { history: 'push', resetPages: false },
    );
  };

  const handleAdvisorApply = (patch: Partial<ProblemsListParams>) => {
    patchRouteState(
      () => {
        const nextPatch: Partial<ProblemsListQueryState> = {
          page: 1,
        };

        const mutablePatch = nextPatch as Record<
          keyof ProblemsListQueryState,
          ProblemsListQueryState[keyof ProblemsListQueryState] | undefined
        >;

        advisorManagedFilterKeys.forEach((key) => {
          mutablePatch[key] = problemsListQueryDefaults[key];
        });

        (
          Object.entries(patch) as Array<
            [keyof ProblemsListParams, ProblemsListParams[keyof ProblemsListParams]]
          >
        ).forEach(([key, value]) => {
          mutablePatch[key as keyof ProblemsListQueryState] = normalizeProblemsListValue(
            key,
            value,
          ) as never;
        });

        nextPatch.tags = patch.tags ?? [];

        return nextPatch;
      },
      { resetPages: false },
    );
  };

  return (
    <FilterDrawerLayout
      open={filterDrawer.open}
      drawerWidth={filterDrawerWidth}
      drawer={
        <ProblemsFilterDrawer
          open={filterDrawer.open}
          handleClose={filterDrawer.close}
          drawerWidth={filterDrawerWidth}
          languages={languages ?? []}
          categories={categories ?? []}
          filter={filter}
          onChange={handleFilterChange}
          onPatch={handleFilterPatch}
        />
      }
    >
      <Stack direction="column" spacing={4} height={1}>
        <PageHeader
          title={t('problems.title2')}
          actionComponent={
            <Stack direction="row" flexWrap="wrap" justifyContent="flex-end">
              <Button
                component={RouterLink}
                to={resources.ProblemsRating}
                variant="text"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:chart-line" />}
              >
                {t('problems.ratingButton')}
              </Button>
              <Button
                component={RouterLink}
                to={resources.Attempts}
                variant="text"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:target" />}
              >
                {t('problems.attemptsButton')}
              </Button>
              {currentUser ? (
                <Button
                  component={RouterLink}
                  to={resources.ProblemsUserStatistics}
                  variant="text"
                  color="primary"
                  startIcon={<IconifyIcon icon="mdi:chart-bar" />}
                >
                  {t('problems.statisticsPage.title')}
                </Button>
              ) : null}
            </Stack>
          }
        />

        <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: { xs: 5, md: 6 } }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FilterCard
                languages={languages ?? []}
                categories={categories ?? []}
                filter={filter}
                filtersOpen={filterDrawer.open}
                onToggleFilters={filterDrawer.toggle}
                onChange={handleFilterChange}
                onPatch={handleFilterPatch}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="column" spacing={3}>
                <ProblemList
                  problems={problems}
                  isLoading={isProblemsLoading}
                  filter={filter}
                  total={total}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="column" spacing={3}>
                {currentUser && (
                  <ProblemDifficultiesCard
                    difficulties={rating?.difficulties}
                    isLoading={isSummaryLoading}
                  />
                )}

                {currentUser && studyPlans?.length && (
                  <ProblemStudyPlansShowcase studyPlans={studyPlans} />
                )}

                <ProblemTabsCard
                  activeTab={routeState.activeTab}
                  onTabChange={(value) => setRouteField('activeTab', value as never)}
                  attempts={{
                    isLoading: isAttemptsLoading,
                    items: attempts ?? [],
                  }}
                  lastContest={{
                    isLoading: isLastContestLoading,
                    data: lastContest,
                  }}
                  mostViewed={{
                    isLoading: isMostViewedLoading,
                    items: mostViewed ?? [],
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <ProblemStudyPlanAdvisorDialog
          open={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          studyPlans={studyPlans ?? []}
          currentFilters={filter}
          onApplyFilters={handleAdvisorApply}
        />
      </Stack>
    </FilterDrawerLayout>
  );
};

interface FilterCardProps {
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  filter: ProblemsListParams;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
  onPatch: (patch: Partial<ProblemsListParams>) => void;
  onOpenAdvisor: () => void;
}

const FilterCard = ({
  languages,
  categories,
  filter,
  filtersOpen,
  onToggleFilters,
  onChange,
  onPatch,
  onOpenAdvisor,
}: FilterCardProps) => {
  const { t } = useTranslation();

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );

  const orderingValue = filter.ordering ?? 'id';

  const handleOrderingChange = (_: SyntheticEvent, value: string) => {
    onChange('ordering', value as string);
  };

  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (filter.lang) {
      const langTitle =
        languages.find((item) => item.lang === filter.lang)?.langFull ?? filter.lang.toUpperCase();
      items.push({
        key: 'lang',
        label: `${t('problems.language')}: ${langTitle}`,
        onRemove: () => onChange('lang', undefined),
      });
    }

    if (filter.exclusive_lang) {
      const langTitle =
        languages.find((item) => item.lang === filter.exclusive_lang)?.langFull ??
        filter.exclusive_lang.toUpperCase();
      items.push({
        key: 'exclusive-lang',
        label: `${t('problems.language')}: ${langTitle} (${t('problems.recommendation.exclusiveOnly')})`,
        onRemove: () => onChange('exclusive_lang', undefined),
      });
    }

    if (filter.favorites) {
      items.push({
        key: 'favorites',
        label: t('problems.favoritesOnly'),
        onRemove: () => onChange('favorites', undefined),
      });
    }

    if (filter.category) {
      const categoryTitle =
        categories.find((category) => String(category.id) === String(filter.category))?.title ??
        String(filter.category);
      items.push({
        key: 'category',
        label: `${t('problems.category')}: ${categoryTitle}`,
        onRemove: () => onChange('category', undefined),
      });
    }

    if (filter.tags && filter.tags.length) {
      filter.tags.forEach((tagId) => {
        const tagName = tags.find((tag) => tag.id === tagId)?.name ?? tagId;
        items.push({
          key: `tag-${tagId}`,
          label: `${t('problems.tags')}: ${tagName}`,
          onRemove: () =>
            onChange(
              'tags',
              (filter.tags ?? []).filter((id) => id !== tagId),
            ),
        });
      });
    }

    if (filter.difficulty) {
      const diffLabel = difficultyOptions.find(
        (item) => item.value === Number(filter.difficulty),
      )?.label;
      items.push({
        key: 'difficulty',
        label: `${t('problems.difficultyLabel')}: ${diffLabel ? t(diffLabel) : filter.difficulty}`,
        onRemove: () => onChange('difficulty', undefined),
      });
    }

    if (filter.status != null) {
      const statusLabel = problemStatusOptions.find(
        (option) => option.value === filter.status,
      )?.label;
      items.push({
        key: 'status',
        label: `${t('problems.status')}: ${statusLabel ? t(statusLabel) : filter.status}`,
        onRemove: () => onChange('status', undefined),
      });
    }

    if (filter.problem_rating_min || filter.problem_rating_max) {
      items.push({
        key: 'problem-rating-band',
        label: `${t('problems.problemRating')}: ${formatProblemRatingBand(
          filter.problem_rating_min,
          filter.problem_rating_max,
        )}`,
        onRemove: () => onPatch({ problem_rating_min: undefined, problem_rating_max: undefined }),
      });
    }

    if (filter.has_solution === 'true') {
      items.push({
        key: 'has-solution',
        label: t('problems.withSolution'),
        onRemove: () => onChange('has_solution', undefined),
      });
    }

    if (filter.has_checker === 'true') {
      items.push({
        key: 'has-checker',
        label: t('problems.withChecker'),
        onRemove: () => onChange('has_checker', undefined),
      });
    }

    if (filter.partial_solvable === 'false') {
      items.push({
        key: 'partial-scorable',
        label: t('problems.withoutPartialScoring'),
        onRemove: () => onChange('partial_solvable', undefined),
      });
    }

    return items;
  }, [categories, filter, languages, onChange, onPatch, t, tags]);

  const handleClearFilters = () => {
    onPatch({
      lang: undefined,
      exclusive_lang: undefined,
      favorites: undefined,
      category: undefined,
      tags: [],
      difficulty: undefined,
      status: undefined,
      problem_rating_min: undefined,
      problem_rating_max: undefined,
      has_solution: undefined,
      has_checker: undefined,
      partial_solvable: undefined,
    });
  };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <TabContext value={orderingValue}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <TabList
                onChange={handleOrderingChange}
                aria-label="problems ordering"
                allowScrollButtonsMobile
              >
                {orderingOptions.map((option) => (
                  <Tab key={option.value} label={t(option.label)} value={option.value} />
                ))}
              </TabList>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              alignItems={{ sm: 'center' }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:star-four-points-circle-outline" />}
                onClick={onOpenAdvisor}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {t('problems.recommendation.cta')}
              </Button>
              <FilterButton
                id="problems-filters-button"
                onClick={onToggleFilters}
                label={t('problems.filters')}
                badgeContent={activeFilters.length}
                aria-haspopup="true"
                aria-expanded={filtersOpen ? 'true' : undefined}
                aria-controls={filtersOpen ? 'problems-filters-drawer' : undefined}
              />
              <SearchTextField
                sx={{ minWidth: 100 }}
                value={filter.search ?? ''}
                placeholder={t('problems.searchPlaceholder')}
                onChange={(event) => onChange('search', event.target.value)}
              />
            </Stack>
          </Stack>
        </TabContext>

        <AppliedFilters
          filters={activeFilters}
          summaryLabel={t('problems.appliedFilters', { count: activeFilters.length })}
          clearLabel={t('problems.clearFilters')}
          onClear={handleClearFilters}
        />
      </Stack>
    </>
  );
};

export default ProblemsListPage;
