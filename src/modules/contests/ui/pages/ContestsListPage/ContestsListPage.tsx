import { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useContestCategories, useContestsList } from 'modules/contests/application/queries';
import AppliedFilters from 'shared/components/common/AppliedFilters';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestsListPageFiltersMenu from './ContestsListPageFiltersMenu.tsx';
import ContestsListPageHeroCard from './ContestsListPageHeroCard.tsx';
import ContestsListPageResults from './ContestsListPageResults.tsx';

const contestTypes = [
  'ACM2H',
  'ACM10M',
  'ACM20M',
  'IOI',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'IQ',
  'Ball',
  'DC',
  'MultiL',
  'CodeGolf',
  'Exam',
] as const;

const DEFAULT_PAGE_SIZE = 6;

type ContestListQueryState = {
  page: number;
  title: string;
  category?: number;
  type?: string;
  participation: 'all' | 'participated' | 'registered';
};

const ContestsListPage = () => {
  const { t } = useTranslation();
  const { data: categories } = useContestCategories();
  const { currentUser } = useAuth();

  const { state, setField, patchState } = useRouteQueryState<ContestListQueryState>({
    defaults: {
      page: 1,
      title: '',
      category: undefined,
      type: undefined,
      participation: 'all',
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
      title: {
        ...stringParam(),
        param: 'title',
      },
      category: {
        ...numberParam({ min: 1 }),
        param: 'category',
      },
      type: {
        ...stringParam(),
        param: 'type',
      },
      participation: {
        ...enumParam(['all', 'participated', 'registered'] as const),
        param: 'participation',
      },
    },
    historyByKey: {
      page: 'push',
    },
    pageResetKeys: ['title', 'category', 'type', 'participation'],
  });
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);

  const debouncedTitle = useDebouncedValue(state.title, 400);

  const filtersOpen = Boolean(filtersAnchorEl);

  const queryParams = useMemo(
    () => ({
      page: state.page,
      pageSize: DEFAULT_PAGE_SIZE,
      title: debouncedTitle || undefined,
      category: state.category ? String(state.category) : undefined,
      type: state.type,
      is_participated: state.participation === 'participated' ? '1' : undefined,
      is_registered: state.participation === 'registered' ? '1' : undefined,
    }),
    [debouncedTitle, state.category, state.page, state.participation, state.type],
  );

  const { data: pageResult, isLoading } = useContestsList(queryParams);
  const contests = pageResult?.data ?? [];
  const showEmptyState = !isLoading && contests.length === 0;
  const totalContestsCount = useMemo(
    () => categories?.reduce((sum, category) => sum + (category.contestsCount ?? 0), 0),
    [categories],
  );
  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (state.title) {
      items.push({
        key: 'title',
        label: `${t('contests.searchLabel')}: ${state.title}`,
        onRemove: () => setField('title', ''),
      });
    }

    if (state.type) {
      items.push({
        key: 'type',
        label: `${t('contests.typeLabel')}: ${t(`contests.typeLabels.${state.type}` as const)}`,
        onRemove: () => setField('type', undefined),
      });
    }

    if (state.category) {
      const selectedCategory = categories?.find((category) => category.id === state.category);
      items.push({
        key: 'category',
        label: `${t('contests.categoriesLabel')}: ${selectedCategory?.title ?? state.category}`,
        onRemove: () => setField('category', undefined),
      });
    }

    if (state.participation !== 'all') {
      items.push({
        key: 'participation',
        label: `${t('contests.participationLabel')}: ${t(
          `contests.participation.${state.participation}` as const,
        )}`,
        onRemove: () => setField('participation', 'all'),
      });
    }

    return items;
  }, [categories, setField, state.category, state.participation, state.title, state.type, t]);

  const handleClearFilters = () => {
    patchState({
      title: '',
      category: undefined,
      type: undefined,
      participation: 'all',
    });
  };

  const handleCategory = (id?: number) => {
    setField('category', id);
  };

  const handleTypeChange = (value?: string) => {
    setField('type', value || undefined);
  };

  const handleFiltersToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (filtersOpen) {
      setFiltersAnchorEl(null);
      return;
    }

    setFiltersAnchorEl(event.currentTarget);
  };

  const handleFiltersClose = () => setFiltersAnchorEl(null);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <ContestsListPageHeroCard
          canViewMyStats={Boolean(currentUser)}
          filtersOpen={filtersOpen}
          activeFiltersCount={activeFilters.length}
          onToggleFilters={handleFiltersToggle}
        />

        <ContestsListPageFiltersMenu
          anchorEl={filtersAnchorEl}
          open={filtersOpen}
          title={state.title}
          category={state.category}
          type={state.type}
          participation={state.participation}
          categories={categories}
          contestTypes={contestTypes}
          totalContestsCount={totalContestsCount}
          onClose={handleFiltersClose}
          onClear={handleClearFilters}
          hasActiveFilters={activeFilters.length > 0}
          onTitleChange={(value) => setField('title', value)}
          onCategoryChange={handleCategory}
          onTypeChange={handleTypeChange}
          onParticipationChange={(value) => setField('participation', value)}
        />

        <AppliedFilters
          filters={activeFilters}
          summaryLabel={t('problems.appliedFilters', { count: activeFilters.length })}
          clearLabel={t('problems.clearFilters')}
          onClear={handleClearFilters}
        />

        <ContestsListPageResults
          contests={contests}
          isLoading={isLoading}
          showEmptyState={showEmptyState}
          page={state.page}
          pagesCount={pageResult?.pagesCount ?? 0}
          skeletonCount={DEFAULT_PAGE_SIZE}
          onPageChange={(value) => setField('page', value)}
        />
      </Stack>
    </Box>
  );
};

export default ContestsListPage;
