import { useMemo } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useUsersCountries, useUsersList } from 'modules/users/application/queries';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { booleanFlagParam, enumParam, numberParam, stringParam } from 'shared/lib/queryParams';

const tabOrderingMap = {
  all: '-id',
  skills: '-skills_rating',
  activity: '-activity_rating',
  contests: '-contests_rating__rating',
  challenges: '-kepcoin',
};

const sortFieldMap: Record<string, string> = {
  username: 'id',
  skillsRating: 'skills_rating',
  activityRating: 'activity_rating',
  contestsRating: 'contests_rating__rating',
  challengesRating: 'challenges_rating__rating',
  streak: 'streak',
  kepcoin: 'kepcoin',
  lastSeen: 'last_seen',
};

type TabValue = keyof typeof tabOrderingMap;

export type FiltersState = {
  search: string;
  country: string;
  ageFrom: string;
  ageTo: string;
  hasCountry: boolean;
  hasCodeforces: boolean;
  hasTelegram: boolean;
};

const AGE_RANGE: [number, number] = [0, 100];

const orderingFieldMap = Object.fromEntries(
  Object.entries(sortFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

type UsersListQueryState = FiltersState & {
  page: number;
  tabValue: TabValue;
  ordering: string;
};

export const useUsersListPage = () => {
  const { currentUser } = useAuth();

  const { state, setField, patchState, resetState } = useRouteQueryState<UsersListQueryState>({
    defaults: {
      page: 1,
      tabValue: 'skills',
      search: '',
      country: '',
      ageFrom: '',
      ageTo: '',
      hasCountry: false,
      hasCodeforces: false,
      hasTelegram: false,
      ordering: '',
    },
    schema: {
      page: numberParam({ min: 1 }),
      tabValue: {
        ...enumParam(['all', 'skills', 'activity', 'contests', 'challenges'] as const),
        param: 'tab',
      },
      search: {
        ...stringParam(),
        param: 'search',
      },
      country: {
        ...stringParam(),
        param: 'country',
      },
      ageFrom: {
        ...stringParam(),
        param: 'ageFrom',
      },
      ageTo: {
        ...stringParam(),
        param: 'ageTo',
      },
      hasCountry: {
        ...booleanFlagParam(),
        param: 'hasCountry',
      },
      hasCodeforces: {
        ...booleanFlagParam(),
        param: 'hasCodeforces',
      },
      hasTelegram: {
        ...booleanFlagParam(),
        param: 'hasTelegram',
      },
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
    historyByKey: {
      tabValue: 'push',
    },
    pageResetKeys: [
      'tabValue',
      'ordering',
      'search',
      'country',
      'ageFrom',
      'ageTo',
      'hasCountry',
      'hasCodeforces',
      'hasTelegram',
    ],
  });

  const filters = useMemo(
    () => ({
      search: state.search,
      country: state.country,
      ageFrom: state.ageFrom,
      ageTo: state.ageTo,
      hasCountry: state.hasCountry,
      hasCodeforces: state.hasCodeforces,
      hasTelegram: state.hasTelegram,
    }),
    [
      state.ageFrom,
      state.ageTo,
      state.country,
      state.hasCodeforces,
      state.hasCountry,
      state.hasTelegram,
      state.search,
    ],
  );

  const ageFilters = useMemo(
    () => ({ ageFrom: filters.ageFrom, ageTo: filters.ageTo }),
    [filters.ageFrom, filters.ageTo],
  );

  const debouncedAgeFilters = useDebouncedValue(ageFilters);

  const { paginationModel, onPaginationModelChange, pageParams } = useGridPagination({
    initialPageSize: 10,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });

  const sortModel = useMemo<GridSortModel>(() => {
    if (!state.ordering) {
      return [];
    }

    const isDescending = state.ordering.startsWith('-');
    const orderingField = isDescending ? state.ordering.slice(1) : state.ordering;
    const field = orderingFieldMap[orderingField] ?? orderingField;

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const { data: countries } = useUsersCountries();

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (currentSort) {
      const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
      return `${currentSort.sort === 'desc' ? '-' : ''}${orderingField}`;
    }

    return tabOrderingMap[state.tabValue];
  }, [sortModel, state.tabValue]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering,
      search: filters.search || undefined,
      country: filters.country || undefined,
      ageFrom: debouncedAgeFilters.ageFrom ? Number(debouncedAgeFilters.ageFrom) : undefined,
      ageTo: debouncedAgeFilters.ageTo ? Number(debouncedAgeFilters.ageTo) : undefined,
      hasCountry: filters.hasCountry || undefined,
      hasCodeforces: filters.hasCodeforces || undefined,
      hasTelegram: filters.hasTelegram || undefined,
      pinCurrentUser: Boolean(currentUser?.username),
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      ordering,
      filters,
      debouncedAgeFilters,
      currentUser?.username,
    ],
  );

  const { data, isLoading, isValidating } = useUsersList(queryParams);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.country ||
        filters.ageFrom ||
        filters.ageTo ||
        filters.hasCountry ||
        filters.hasCodeforces ||
        filters.hasTelegram,
      ),
    [
      filters.ageFrom,
      filters.ageTo,
      filters.country,
      filters.hasCodeforces,
      filters.hasCountry,
      filters.hasTelegram,
    ],
  );

  const rows = useMemo(
    () => mergePinnedRows(data?.data ?? [], data?.pinnedRows, (row) => row.id ?? row.username),
    [data?.data, data?.pinnedRows],
  );

  const rowCount = data?.total ?? 0;

  const handleTabChange = (value: TabValue) => {
    patchState({ tabValue: value, ordering: '' });
  };

  const handleClearFilters = () => {
    resetState(['country', 'ageFrom', 'ageTo', 'hasCountry', 'hasCodeforces', 'hasTelegram']);
  };

  const handleAgeRangeChange = (value: [number, number]) => {
    patchState({
      ageFrom: value[0] === AGE_RANGE[0] ? '' : String(value[0]),
      ageTo: value[1] === AGE_RANGE[1] ? '' : String(value[1]),
    });
  };

  const handleSortModelChange = (model: GridSortModel) => {
    const currentSort = model[0];

    if (!currentSort) {
      setField('ordering', '');
      return;
    }

    const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
    const orderingPrefix = currentSort.sort === 'desc' ? '-' : '';
    setField('ordering', `${orderingPrefix}${orderingField}`);
  };

  const ageRange = useMemo<[number, number]>(
    () => [
      filters.ageFrom ? Number(filters.ageFrom) : AGE_RANGE[0],
      filters.ageTo ? Number(filters.ageTo) : AGE_RANGE[1],
    ],
    [filters.ageFrom, filters.ageTo],
  );
  return {
    currentUser,
    state,
    setField,
    resetState,
    paginationModel,
    onPaginationModelChange,
    countries,
    isLoading,
    isValidating,
    filters,
    sortModel,
    hasActiveFilters,
    rows,
    rowCount,
    handleTabChange,
    handleClearFilters,
    handleAgeRangeChange,
    handleSortModelChange,
    ageRange,
  };
};
