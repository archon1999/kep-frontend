import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mui/material';
import { difficultyOptions } from 'modules/problems/config/difficulty';
import { ProblemsListParams } from 'modules/problems/domain/contracts/problems.repository.ts';
import {
  ProblemCategory,
  ProblemGroup,
  ProblemLanguageOption,
} from 'modules/problems/domain/entities/problem.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import AppliedFilters from 'shared/components/common/AppliedFilters.tsx';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import FilterButton from 'shared/components/common/FilterButton.tsx';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import SearchTextField from 'shared/components/common/SearchTextField';
import { problemStatusOptions } from './ProblemsFilterDrawer.tsx';

const orderingOptions = [
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderEasiest', value: 'problem_rating,-solved' },
  { label: 'problems.orderHardest', value: '-problem_rating,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

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

interface ProblemsListFilterBarProps {
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  groups: ProblemGroup[];
  filter: ProblemsListParams;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
  onPatch: (patch: Partial<ProblemsListParams>) => void;
  onOpenAdvisor: () => void;
}

const ProblemsListFilterBar = ({
  languages,
  categories,
  groups,
  filter,
  filtersOpen,
  onToggleFilters,
  onChange,
  onPatch,
  onOpenAdvisor,
}: ProblemsListFilterBarProps) => {
  const { t } = useTranslation();

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );

  const groupsById = useMemo(() => {
    const map = new Map<number, ProblemGroup>();
    const visit = (items: ProblemGroup[]) => {
      items.forEach((item) => {
        map.set(item.id, item);
        visit(item.children ?? []);
      });
    };
    visit(groups);
    return map;
  }, [groups]);

  const orderingValue = filter.ordering ?? 'id';

  const handleOrderingChange = (value: string) => {
    onChange('ordering', value);
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

    if (filter.groups && filter.groups.length) {
      filter.groups.forEach((groupId) => {
        const groupName = groupsById.get(groupId)?.name ?? groupId;
        items.push({
          key: `group-${groupId}`,
          label: `${t('problems.groups')}: ${groupName}`,
          onRemove: () =>
            onChange(
              'groups',
              (filter.groups ?? []).filter((id) => id !== groupId),
            ),
        });
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
  }, [categories, filter, groupsById, languages, onChange, onPatch, t, tags]);

  const handleClearFilters = () => {
    onPatch({
      lang: undefined,
      exclusive_lang: undefined,
      favorites: undefined,
      groups: [],
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
      <Stack
        direction="column"
        spacing={2}
        sx={{ px: 'var(--kep-content-inset)', py: 2.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 1, lg: 2 }}
          >
            <Stack spacing={0.75} sx={{ minWidth: 0, width: { xs: 1, lg: 'auto' } }}>
              <ResponsiveTabs
                value={orderingValue}
                onChange={handleOrderingChange}
                ariaLabel="problems ordering"
                items={orderingOptions.map((option) => ({
                  value: option.value,
                  label: t(option.label),
                }))}
                tabsProps={{
                  allowScrollButtonsMobile: true,
                }}
                containerSx={{ width: { xs: 1, lg: 'auto' } }}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 1.25 }}
              alignItems={{ sm: 'center' }}
              sx={{ width: { xs: 1, lg: 'auto' } }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:star-four-points-circle-outline" />}
                onClick={onOpenAdvisor}
                sx={{ width: { xs: 1, sm: 'auto' }, whiteSpace: 'nowrap' }}
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
                containerSx={{ width: { xs: 1, sm: 'auto' } }}
                sx={{ width: { xs: 1, sm: 'auto' } }}
              />
              <DebouncedTextField
                textFieldComponent={SearchTextField}
                sx={{ minWidth: 100, width: { xs: 1, sm: 260, md: 300 } }}
                value={filter.search ?? ''}
                placeholder={t('problems.searchPlaceholder')}
                onValueChange={(value) => onChange('search', value)}
              />
            </Stack>
          </Stack>
        </>

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

export default ProblemsListFilterBar;
