import { KeyboardEvent, MouseEvent, SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { TabContext, TabList } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Tab,
  TablePagination,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import FilterButton from 'shared/components/common/FilterButton.tsx';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import {
  booleanFlagParam,
  enumParam,
  numberArrayParam,
  numberParam,
  stringParam,
} from 'shared/lib/queryParams';
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
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import {
  DifficultyBreakdown,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemLanguageOption,
  ProblemListItem,
} from 'modules/problems/domain/entities/problem.entity.ts';
import { ProblemsListParams } from 'modules/problems/domain/ports/problems.repository.ts';
import ProblemDifficultiesCard from './components/ProblemDifficultiesCard.tsx';
import ProblemList from './components/ProblemList.tsx';
import ProblemTabsCard from './components/ProblemTabsCard.tsx';
import ProblemStudyPlanAdvisorDialog from './dialogs/ProblemStudyPlanAdvisorDialog.tsx';
import ProblemStudyPlansShowcase from './components/ProblemStudyPlansShowcase.tsx';

const orderingOptions = [
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderEasiest', value: 'problem_rating,-solved' },
  { label: 'problems.orderHardest', value: '-problem_rating,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

const statusOptions = [
  { label: 'problems.statusUnknown', value: 3, icon: 'mdi:minus', color: 'warning.main' },
  { label: 'problems.statusSolved', value: 1, icon: 'mdi:check', color: 'success.main' },
  { label: 'problems.statusUnsolved', value: 2, icon: 'mdi:close', color: 'error.main' },
];

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
    <Stack direction="column" spacing={4} height={1}>
      <PageHeader
        title={t('problems.title2')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('problems.title'), active: true },
        ]}
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
              onChange={handleFilterChange}
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

              {currentUser && studyPlans?.length && <ProblemStudyPlansShowcase studyPlans={studyPlans} />}

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
  );
};

interface FilterCardProps {
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  filter: ProblemsListParams;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
  onOpenAdvisor: () => void;
}

const FilterCard = ({
  languages,
  categories,
  filter,
  onChange,
  onOpenAdvisor,
}: FilterCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const [tagsAnchor, setTagsAnchor] = useState<HTMLElement | null>(null);
  const [expandedTagCategories, setExpandedTagCategories] = useState<string[]>([]);

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );
  const groupedTags = useMemo(() => {
    const selectedCategoryId = filter.category == null ? null : String(filter.category);

    return categories
      .map((category) => ({
        id: category.id,
        title: category.title,
        isFocused: selectedCategoryId != null && String(category.id) === selectedCategoryId,
        tags: (category.tags ?? [])
          .slice()
          .sort((left, right) => left.name.localeCompare(right.name)),
      }))
      .filter((category) => category.tags.length > 0)
      .sort((left, right) => {
        if (left.isFocused !== right.isFocused) {
          return left.isFocused ? -1 : 1;
        }

        return left.title.localeCompare(right.title);
      });
  }, [categories, filter.category]);

  const handleTagsKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setTagsAnchor((current) => (current ? null : event.currentTarget));
    }
  };

  const filtersOpen = Boolean(filtersAnchor);
  const tagsOpen = Boolean(tagsAnchor);
  const orderingValue = filter.ordering ?? 'id';

  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleFiltersClose = () => {
    setFiltersAnchor(null);
    setTagsAnchor(null);
  };

  const handleTagsToggle = (event: MouseEvent<HTMLElement>) => {
    setTagsAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleTagsClose = () => setTagsAnchor(null);

  const handleOrderingChange = (_: SyntheticEvent, value: string) => {
    onChange('ordering', value as string);
  };

  const tagSummary = useMemo(() => {
    const activeTagIds = filter.tags ?? [];

    if (activeTagIds.length === 0) {
      return `${groupedTags.length} categories, ${tags.length} tags`;
    }

    const activeTagNames = activeTagIds
      .map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
      .filter((name): name is string => Boolean(name));

    if (activeTagNames.length === 0) {
      return t('problems.appliedFilters', { count: activeTagIds.length });
    }

    if (activeTagNames.length <= 2) {
      return activeTagNames.join(', ');
    }

    return `${activeTagNames.slice(0, 2).join(', ')} +${activeTagNames.length - 2}`;
  }, [filter.tags, groupedTags.length, t, tags]);

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
      const statusLabel = statusOptions.find((option) => option.value === filter.status)?.label;
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
        onRemove: () => {
          onChange('problem_rating_min', undefined);
          onChange('problem_rating_max', undefined);
        },
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
  }, [categories, filter, languages, onChange, t, tags]);

  const handleClearFilters = () => {
    onChange('lang', undefined);
    onChange('exclusive_lang', undefined);
    onChange('favorites', undefined);
    onChange('category', undefined);
    onChange('tags', []);
    onChange('difficulty', undefined);
    onChange('status', undefined);
    onChange('problem_rating_min', undefined);
    onChange('problem_rating_max', undefined);
    onChange('has_solution', undefined);
    onChange('has_checker', undefined);
    onChange('partial_solvable', undefined);
  };
  const handleTagToggle = (tagId: number) => {
    const activeTags = filter.tags ?? [];
    const nextTags = activeTags.includes(tagId)
      ? activeTags.filter((id) => id !== tagId)
      : [...activeTags, tagId];

    onChange('tags', nextTags);
  };

  const handleTagCategoryToggle =
    (categoryId: string) => (_event: SyntheticEvent, expanded: boolean) => {
      setExpandedTagCategories((prev) =>
        expanded ? [...prev, categoryId] : prev.filter((item) => item !== categoryId),
      );
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
                onClick={handleFiltersToggle}
                label={t('problems.filters')}
                badgeContent={activeFilters.length}
                aria-haspopup="true"
                aria-expanded={filtersOpen ? 'true' : undefined}
                aria-controls={filtersOpen ? 'problems-filters-menu' : undefined}
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

        {activeFilters.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('problems.appliedFilters', { count: activeFilters.length })}
            </Typography>
            {activeFilters.map((item) => (
              <Chip
                key={item.key}
                size="small"
                label={item.label}
                onDelete={item.onRemove}
                color="primary"
                variant="outlined"
              />
            ))}
            <Button variant="text" size="small" color="secondary" onClick={handleClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          </Stack>
        )}
      </Stack>

      <Menu
        id="problems-filters-menu"
        anchorEl={filtersAnchor}
        open={filtersOpen}
        onClose={handleFiltersClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            p: 2.5,
            width: { xs: 320, sm: 420 },
          },
        }}
      >
        <Stack direction="column" spacing={2.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:tune-variant" width={20} height={20} />
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.filters')}
              </Typography>
            </Stack>
            <Button size="small" variant="text" color="secondary" onClick={handleClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('problems.favoritesOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(filter.favorites)}
                  onChange={(_, checked) => onChange('favorites', checked)}
                  size="small"
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            variant="filled"
            size="small"
            label={t('problems.language')}
            value={filter.lang ?? ''}
            onChange={(event) =>
              onChange(
                'lang',
                event.target.value === '' ? undefined : (event.target.value as string),
              )
            }
          >
            <MenuItem value="">{t('problems.allLanguages')}</MenuItem>
            {languages.map((item) => (
              <MenuItem key={item.lang} value={item.lang}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{item.langFull}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.lang.toUpperCase()}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.category')}
            value={filter.category ?? ''}
            variant="filled"
            onChange={(event) =>
              onChange(
                'category',
                event.target.value === '' ? undefined : String(event.target.value),
              )
            }
          >
            <MenuItem value="">{t('problems.allCategories')}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                  <Typography variant="body2">{category.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                    {category.problemsCount ?? 0}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            size="small"
            variant="filled"
            label={t('problems.tags')}
            value={tagSummary}
            onClick={handleTagsToggle}
            onKeyDown={handleTagsKeyDown}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconifyIcon
                      icon={tagsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                      color={theme.palette.text.secondary}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                cursor: 'pointer',
              },
              '& .MuiInputBase-input': {
                cursor: 'pointer',
                textOverflow: 'ellipsis',
              },
            }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.difficultyLabel')}
            value={filter.difficulty ?? ''}
            variant="filled"
            onChange={(event) =>
              onChange(
                'difficulty',
                event.target.value === '' ? undefined : String(event.target.value),
              )
            }
          >
            <MenuItem value="">{t('problems.allDifficulties')}</MenuItem>
            {difficultyOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {t(item.label)}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <TextField
              fullWidth
              type="number"
              size="small"
              variant="filled"
              label={t('problems.problemRatingFrom')}
              value={filter.problem_rating_min ?? ''}
              onChange={(event) => onChange('problem_rating_min', event.target.value || undefined)}
            />
            <TextField
              fullWidth
              type="number"
              size="small"
              variant="filled"
              label={t('problems.problemRatingTo')}
              value={filter.problem_rating_max ?? ''}
              onChange={(event) => onChange('problem_rating_max', event.target.value || undefined)}
            />
          </Stack>

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.status')}
            value={filter.status != null ? String(filter.status) : ''}
            variant="filled"
            onChange={(event) => {
              const value = event.target.value;
              onChange('status', value === '' ? undefined : Number(value));
            }}
          >
            <MenuItem value="">{t('problems.allStatuses')}</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconifyIcon
                    icon={option.icon}
                    width={18}
                    height={18}
                    color={option.color as string}
                  />
                  <Typography variant="body2">{t(option.label)}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Menu>

      <Menu
        id="problems-tags-menu"
        anchorEl={tagsAnchor}
        open={tagsOpen}
        onClose={handleTagsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 320, sm: 420 },
            maxHeight: 520,
            p: 1,
            overflow: 'hidden',
          },
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, pt: 0.5 }}
          >
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.tags')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {filter.tags && filter.tags.length > 0
                  ? t('problems.appliedFilters', { count: filter.tags.length })
                  : `${groupedTags.length} categories, ${tags.length} tags`}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {(filter.tags?.length ?? 0) > 0 ? (
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={() => onChange('tags', [])}
                >
                  {t('problems.clearFilters')}
                </Button>
              ) : null}
              <Button size="small" variant="text" color="secondary" onClick={handleTagsClose}>
                OK
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ maxHeight: 430, overflowY: 'auto', pr: 0.25 }}>
            <Stack spacing={1}>
              {groupedTags.map((category) => {
                const selectedCount = category.tags.filter((tag) =>
                  (filter.tags ?? []).includes(tag.id),
                ).length;
                const categoryId = String(category.id);
                const isExpanded = expandedTagCategories.includes(categoryId);

                return (
                  <Accordion
                    key={category.id}
                    expanded={isExpanded}
                    onChange={handleTagCategoryToggle(categoryId)}
                    sx={{
                      border: '1px solid',
                      borderColor: category.isFocused
                        ? alpha(theme.palette.primary.main, 0.4)
                        : 'divider',
                      bgcolor: category.isFocused
                        ? alpha(theme.palette.primary.main, 0.04)
                        : alpha(theme.palette.background.default, 0.18),
                    }}
                  >
                    <AccordionSummary>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {category.title}
                        </Typography>

                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Chip
                            size="small"
                            variant="outlined"
                            label={category.tags.length}
                            sx={{ minWidth: 40 }}
                          />
                          {selectedCount > 0 ? (
                            <Chip size="small" color="primary" label={selectedCount} />
                          ) : null}
                        </Stack>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {category.tags.map((tag) => {
                          const isActive = (filter.tags ?? []).includes(tag.id);

                          return (
                            <Chip
                              key={tag.id}
                              size="small"
                              clickable
                              onClick={() => handleTagToggle(tag.id)}
                              label={tag.name}
                              color={isActive ? 'primary' : 'default'}
                              variant={isActive ? 'filled' : 'outlined'}
                              sx={
                                isActive
                                  ? {
                                      fontWeight: 600,
                                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`,
                                    }
                                  : {
                                      bgcolor: alpha(theme.palette.background.paper, 0.82),
                                      borderColor: alpha(theme.palette.text.primary, 0.12),
                                      '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.32),
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                      },
                                    }
                              }
                            />
                          );
                        })}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Menu>
    </>
  );
};

export default ProblemsListPage;
