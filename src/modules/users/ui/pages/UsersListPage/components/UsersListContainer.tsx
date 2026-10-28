import { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, InputAdornment, Stack } from '@mui/material';
import { FiltersState, useUsersListPage } from 'modules/users/application/hooks/useUsersListPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AppliedFilters from 'shared/components/common/AppliedFilters';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import FilterButton from 'shared/components/common/FilterButton';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { getCountryAlpha2, getCountryLabel } from 'shared/utils/country';
import UsersDataGrid from './UsersDataGrid';
import UsersHeaderStatistics from './UsersHeaderStatistics';
import UsersListFilterDrawer, { CountryOption } from './UsersListFilterDrawer';

const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;

const UsersListContainer = () => {
  const {
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
  } = useUsersListPage();

  const { t, i18n } = useTranslation();
  const filterDrawer = useFilterDrawer();

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

  return (
    <FilterDrawerLayout
      anchorEl={filterDrawer.anchorEl}
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
          }}
          onHasCodeforcesChange={(checked) => {
            setField('hasCodeforces', checked);
          }}
          onHasTelegramChange={(checked) => {
            setField('hasTelegram', checked);
          }}
        />
      }
    >
      <Stack direction="column" spacing={0}>
        <PageHeader
          title={t('users.title')}
          sx={{ alignItems: { sm: 'center' } }}
          actionComponent={<UsersHeaderStatistics />}
        />
        <Box sx={{ minWidth: 0 }}>
          <>
            <Stack
              sx={{
                gap: 2,
                p: 'var(--kep-content-inset)',
                borderBottom: 1,
                borderColor: 'divider',
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
                <DebouncedTextField
                  id="search-box"
                  type="search"
                  variant="filled"
                  fullWidth
                  value={filters.search}
                  onValueChange={(value) => setField('search', value)}
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

            <Box sx={{ px: 'var(--kep-content-inset)', py: activeFilters.length ? 2 : 0 }}>
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
