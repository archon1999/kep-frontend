import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useContestCategories, useContestsList } from 'modules/contests/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam, stringParam } from 'shared/lib/queryParams';

export const DEFAULT_PAGE_SIZE = 6;

type ContestListQueryState = {
  page: number;
  title: string;
  category?: number;
  type?: string;
  participation: 'all' | 'participated' | 'registered';
};

export const useContestsListPage = () => {
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

  const queryParams = useMemo(
    () => ({
      page: state.page,
      pageSize: DEFAULT_PAGE_SIZE,
      title: state.title || undefined,
      category: state.category ? String(state.category) : undefined,
      type: state.type,
      is_participated: state.participation === 'participated' ? '1' : undefined,
      is_registered: state.participation === 'registered' ? '1' : undefined,
    }),
    [state.title, state.category, state.page, state.participation, state.type],
  );

  const { data: pageResult, isLoading, error, mutate } = useContestsList(queryParams);

  const contests = pageResult?.data ?? [];

  const totalContestsCount = useMemo(
    () => categories?.reduce((sum, category) => sum + (category.contestsCount ?? 0), 0),
    [categories],
  );

  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (state.title) {
      items.push({
        key: 'title',
        label: state.title,
        onRemove: () => setField('title', ''),
      });
    }

    if (state.type) {
      items.push({
        key: 'type',
        label: t(`contests.typeLabels.${state.type}` as const),
        onRemove: () => setField('type', undefined),
      });
    }

    if (state.category) {
      const selectedCategory = categories?.find((category) => category.id === state.category);
      items.push({
        key: 'category',
        label: selectedCategory?.title ?? String(state.category),
        onRemove: () => setField('category', undefined),
      });
    }

    if (state.participation !== 'all') {
      items.push({
        key: 'participation',
        label: t(`contests.participation.${state.participation}` as const),
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
  return {
    categories,
    currentUser,
    state,
    setField,
    pageResult,
    isLoading,
    error,
    mutate,
    contests,
    totalContestsCount,
    activeFilters,
    handleClearFilters,
    handleCategory,
    handleTypeChange,
  };
};
