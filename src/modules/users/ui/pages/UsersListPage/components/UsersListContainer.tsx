import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, InputAdornment, Stack } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useUsersCountries, useUsersList } from 'modules/users/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AppliedFilters from 'shared/components/common/AppliedFilters';
import FilterButton from 'shared/components/common/FilterButton';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StyledTextField from 'shared/components/styled/StyledTextField';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, enumParam, stringParam } from 'shared/lib/queryParams';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { getCountryAlpha2, getCountryLabel } from 'shared/utils/country';
import UsersDataGrid from './UsersDataGrid';
import UsersHeaderStatistics from './UsersHeaderStatistics';
import UsersListFilterDrawer, { CountryOption } from './UsersListFilterDrawer';

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

type FiltersState = {
  search: string;
  country: string;
  ageFrom: string;
  ageTo: string;
  hasCountry: boolean;
  hasCodeforces: boolean;
  hasTelegram: boolean;
};

const AGE_RANGE: [number, number] = [0, 100];
const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;

const orderingFieldMap = Object.fromEntries(
  Object.entries(sortFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

type UsersListQueryState = FiltersState & {
  tabValue: TabValue;
  ordering: string;
};

const UsersListContainer = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { state, setField, resetState } = useRouteQueryState<UsersListQueryState>({
    defaults: {
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
  const filterDrawer = useFilterDrawer();
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const didMountRef = useRef(false);
  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
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

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedFilters(filters), 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedFilters, setPaginationModel, state.tabValue]);

  const { data: countries } = useUsersCountries();

  const normalizeCountryCode = (code?: string) => code?.trim().toLowerCase() ?? '';

  const countryOptions = useMemo(() => {
    if (!countries) return [];

    return countries
      .map((rawCode) => {
        if (!rawCode) return undefined;

        const value = String(rawCode);
        const normalized = normalizeCountryCode(value);
        if (!normalized) return undefined;

        const displayCode = getCountryAlpha2(normalized) ?? normalized.toUpperCase();

        return {
          value,
          code: displayCode,
          label: getCountryLabel(displayCode, i18n.language) ?? displayCode,
        } satisfies CountryOption;
      })
      .filter((option): option is CountryOption => Boolean(option));
  }, [countries, i18n.language]);

  const countryOptionsByValue = useMemo(
    () => Object.fromEntries(countryOptions.map((country) => [country.value, country])),
    [countryOptions],
  );

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
      search: debouncedFilters.search || undefined,
      country: debouncedFilters.country || undefined,
      ageFrom: debouncedFilters.ageFrom ? Number(debouncedFilters.ageFrom) : undefined,
      ageTo: debouncedFilters.ageTo ? Number(debouncedFilters.ageTo) : undefined,
      hasCountry: debouncedFilters.hasCountry || undefined,
      hasCodeforces: debouncedFilters.hasCodeforces || undefined,
      hasTelegram: debouncedFilters.hasTelegram || undefined,
      pinCurrentUser: Boolean(currentUser?.username),
    }),
    [pageParams.page, pageParams.pageSize, ordering, debouncedFilters, currentUser?.username],
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

  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (filters.country) {
      const selectedCountry = countryOptionsByValue[filters.country];
      items.push({
        key: 'country',
        label: `${t('users.filters.country')}: ${selectedCountry?.label ?? filters.country}`,
        onRemove: () => setField('country', ''),
      });
    }

    if (filters.ageFrom || filters.ageTo) {
      const label =
        filters.ageFrom && filters.ageTo
          ? `${filters.ageFrom}-${filters.ageTo}`
          : filters.ageFrom
            ? `${filters.ageFrom}+`
            : `<= ${filters.ageTo}`;
      items.push({
        key: 'age',
        label: `${t('users.filters.ageFrom').replace(/\s+\S+$/, '')}: ${label}`,
        onRemove: () => resetState(['ageFrom', 'ageTo']),
      });
    }

    if (filters.hasCountry) {
      items.push({
        key: 'hasCountry',
        label: t('users.filters.hasCountry'),
        onRemove: () => setField('hasCountry', false),
      });
    }

    if (filters.hasCodeforces) {
      items.push({
        key: 'hasCodeforces',
        label: t('users.filters.hasCodeforces'),
        onRemove: () => setField('hasCodeforces', false),
      });
    }

    if (filters.hasTelegram) {
      items.push({
        key: 'hasTelegram',
        label: t('users.filters.hasTelegram'),
        onRemove: () => setField('hasTelegram', false),
      });
    }

    return items;
  }, [
    countryOptionsByValue,
    filters.ageFrom,
    filters.ageTo,
    filters.country,
    filters.hasCodeforces,
    filters.hasCountry,
    filters.hasTelegram,
    resetState,
    setField,
    t,
  ]);

  const rows = useMemo(
    () =>
      mergePinnedRows(data?.data ?? [], data?.pinnedRows, (row) => row.id ?? row.username),
    [data?.data, data?.pinnedRows],
  );
  const rowCount = data?.total ?? 0;

  const handleTabChange = (value: TabValue) => {
    setField('tabValue', value);
    setField('ordering', '');
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };
  const tabs = useMemo(
    () => [
      { label: t('users.tabs.all'), value: 'all' as const },
      { label: t('users.tabs.skills'), value: 'skills' as const },
      { label: t('users.tabs.activity'), value: 'activity' as const },
      { label: t('users.tabs.contests'), value: 'contests' as const },
      { label: t('users.tabs.challenges'), value: 'challenges' as const },
    ],
    [t],
  );

  const handleFilterChange =
    (field: keyof FiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
      setField(field, event.target.value);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    };

  const handleClearFilters = () => {
    resetState(['country', 'ageFrom', 'ageTo', 'hasCountry', 'hasCodeforces', 'hasTelegram']);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleAgeRangeChange = (value: [number, number]) => {
    setField('ageFrom', value[0] === AGE_RANGE[0] ? '' : String(value[0]));
    setField('ageTo', value[1] === AGE_RANGE[1] ? '' : String(value[1]));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
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

  const columnLabels = {
    user: t('users.columns.user'),
    skills: t('users.columns.skills'),
    activity: t('users.columns.activity'),
    contests: t('users.columns.contests'),
    challenges: t('users.columns.challenges'),
    streak: t('users.columns.streak'),
    kepcoin: t('users.columns.kepcoin'),
    lastSeen: t('users.columns.lastSeen'),
    emptyValue: t('users.emptyValue'),
  } as const;

  const ageRange = useMemo<[number, number]>(
    () => [
      filters.ageFrom ? Number(filters.ageFrom) : AGE_RANGE[0],
      filters.ageTo ? Number(filters.ageTo) : AGE_RANGE[1],
    ],
    [filters.ageFrom, filters.ageTo],
  );

  return (
    <FilterDrawerLayout
      open={filterDrawer.open}
      drawerWidth={filterDrawerWidth}
      drawer={
        <UsersListFilterDrawer
          open={filterDrawer.open}
          handleClose={filterDrawer.close}
          drawerWidth={filterDrawerWidth}
          country={filters.country}
          ageRange={ageRange}
          hasCountry={filters.hasCountry}
          hasCodeforces={filters.hasCodeforces}
          hasTelegram={filters.hasTelegram}
          countryOptions={countryOptions}
          countryOptionsByValue={countryOptionsByValue}
          hasActiveFilters={hasActiveFilters}
          onClear={handleClearFilters}
          onCountryChange={handleFilterChange('country')}
          onAgeRangeChange={handleAgeRangeChange}
          onHasCountryChange={(checked) => {
            setField('hasCountry', checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          onHasCodeforcesChange={(checked) => {
            setField('hasCodeforces', checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          onHasTelegramChange={(checked) => {
            setField('hasTelegram', checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        />
      }
    >
      <Stack direction="column" height={1} spacing={{ xs: 2.5, md: 3 }}>
        <PageHeader
          title={t('users.title')}
          paperSx={{ py: { xs: 2, md: 1.75 } }}
          sx={{ alignItems: { sm: 'center' } }}
          actionComponent={<UsersHeaderStatistics />}
        />
        <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
          <>
            <Stack
              sx={{
                gap: 2,
                mb: 4,
                alignItems: { md: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box sx={{ order: { xs: 1, sm: 0 } }}>
                <ResponsiveTabs
                  value={state.tabValue}
                  onChange={handleTabChange}
                  items={tabs}
                  ariaLabel="users list tab"
                />
              </Box>
              <Stack
                sx={{ gap: 1, width: { xs: 1, sm: 'auto' } }}
                direction={{ xs: 'column', sm: 'row' }}
              >
                <FilterButton
                  id="users-filters-button"
                  onClick={filterDrawer.toggle}
                  aria-haspopup="true"
                  aria-expanded={filterDrawer.open ? 'true' : undefined}
                  aria-controls={filterDrawer.open ? 'users-filters-drawer' : undefined}
                  label={t('problems.filters')}
                  badgeContent={activeFilters.length}
                  containerSx={{ width: { xs: 1, sm: 'auto' } }}
                  sx={{ width: { xs: 1, sm: 'auto' } }}
                />
                <StyledTextField
                  id="search-box"
                  type="search"
                  variant="filled"
                  fullWidth
                  value={filters.search}
                  onChange={handleFilterChange('search')}
                  placeholder={t('users.filters.searchPlaceholder')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    maxWidth: { sm: 240, md: 280 },
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                />
              </Stack>
            </Stack>

            <Box sx={{ mb: activeFilters.length ? 3 : 0 }}>
              <AppliedFilters
                filters={activeFilters}
                summaryLabel={t('problems.appliedFilters', { count: activeFilters.length })}
                clearLabel={t('problems.clearFilters')}
                onClear={handleClearFilters}
              />
            </Box>

            <UsersDataGrid
              rows={rows}
              rowCount={rowCount}
              loading={isLoading || isValidating}
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              columnLabels={columnLabels}
              isFiltered={Boolean(filters.search || hasActiveFilters)}
              currentUsername={currentUser?.username}
            />
          </>
        </Box>
      </Stack>
    </FilterDrawerLayout>
  );
};

export default UsersListContainer;
