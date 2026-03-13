import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Box, Button, InputAdornment, Menu, MenuItem, Stack, Tab, TextField, Typography } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useUsersCountries, useUsersList } from 'modules/users/application/queries';
import StyledTextField from 'shared/components/styled/StyledTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import UsersDataGrid from './UsersDataGrid';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import FilterButton from 'shared/components/common/FilterButton';
import useGridPagination from 'shared/hooks/useGridPagination';

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
};

const defaultFilters: FiltersState = {
  search: '',
  country: '',
  ageFrom: '',
  ageTo: '',
};

type CountryOption = {
  value: string;
  code: string;
  label: string;
};

const UsersListContainer = () => {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState<TabValue>('skills');
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FiltersState>({ ...defaultFilters });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams,
    setPaginationModel,
  } = useGridPagination({ initialPageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedFilters(filters), 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedFilters, tabValue]);

  const { data: countries } = useUsersCountries();

  const filtersOpen = Boolean(filtersAnchorEl);

  const normalizeLocale = (language: string) => {
    if (language.includes('-')) return language;
    const match = language.match(/^(\w{2})([A-Z]{2})$/);

    if (match) {
      return `${match[1]}-${match[2]}`;
    }

    return language;
  };

  const regionNames = useMemo(
    () => new Intl.DisplayNames([normalizeLocale(i18n.language) ?? 'en-US'], { type: 'region' }),
    [i18n.language],
  );

  const normalizeCountryCode = (code?: string) => code?.trim().toLowerCase() ?? '';

  const countryOptions = useMemo(() => {
    if (!countries) return [];

    return countries
      .map((rawCode) => {
        if (!rawCode) return undefined;

        const value = String(rawCode);
        const normalized = normalizeCountryCode(value);
        if (!normalized) return undefined;

        const displayCode = normalized.toUpperCase();

        return {
          value,
          code: displayCode,
          label: regionNames.of(displayCode) ?? displayCode,
        } satisfies CountryOption;
      })
      .filter((option): option is CountryOption => Boolean(option));
  }, [countries, regionNames]);

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

    return tabOrderingMap[tabValue];
  }, [sortModel, tabValue]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering,
      search: debouncedFilters.search || undefined,
      country: debouncedFilters.country || undefined,
      ageFrom: debouncedFilters.ageFrom ? Number(debouncedFilters.ageFrom) : undefined,
      ageTo: debouncedFilters.ageTo ? Number(debouncedFilters.ageTo) : undefined,
    }),
    [pageParams.page, pageParams.pageSize, ordering, debouncedFilters],
  );

  const { data, isLoading, isValidating } = useUsersList(queryParams);

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search || filters.country || filters.ageFrom || filters.ageTo),
    [filters],
  );

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const rowCount = data?.total ?? 0;

  const handleTabChange = (_: SyntheticEvent, value: TabValue) => {
    setTabValue(value);
    setSortModel([]);
  };

  const handleFilterChange = (field: keyof FiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFiltersToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (filtersOpen) {
      setFiltersAnchorEl(null);
    } else {
      setFiltersAnchorEl(event.currentTarget);
    }
  };

  const handleFiltersClose = () => setFiltersAnchorEl(null);

  const handleClearFilters = () => {
    setFilters(() => ({ ...defaultFilters }));
  };

  const handleSortModelChange = (model: GridSortModel) => setSortModel(model);

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
    <TabContext value={tabValue}>
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
          <TabList onChange={handleTabChange} aria-label="users list tab">
            <Tab label={t('users.tabs.all')} value="all" />
            <Tab label={t('users.tabs.skills')} value="skills" />
            <Tab label={t('users.tabs.activity')} value="activity" />
            <Tab label={t('users.tabs.contests')} value="contests" />
            <Tab label={t('users.tabs.challenges')} value="challenges" />
          </TabList>
        </Box>
        <Stack sx={{ gap: 1 }} direction={{ xs: 'column', sm: 'row' }}>
          <FilterButton
            id="users-filters-button"
            onClick={handleFiltersToggle}
            aria-haspopup="true"
            aria-expanded={filtersOpen ? 'true' : undefined}
            aria-controls={filtersOpen ? 'users-filters-menu' : undefined}
            label={t('users.filters.toggle')}
          />
          <StyledTextField
            id="search-box"
            type="search"
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

      <Menu
        id="users-filters-menu"
        anchorEl={filtersAnchorEl}
        open={filtersOpen}
        onClose={handleFiltersClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            p: 2,
            width: 300,
          },
        }}
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              {t('users.filters.toggle')}
            </Typography>
            <Button size="small" color="secondary" onClick={handleClearFilters} disabled={!hasActiveFilters}>
              {t('users.filters.clear')}
            </Button>
          </Stack>
          <TextField
            select
            variant="filled"
            fullWidth
            label={t('users.filters.country')}
            value={filters.country}
            onChange={handleFilterChange('country')}
            placeholder={t('users.filters.countryPlaceholder')}
            slotProps={{ inputLabel: { shrink: true } }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (value) => {
                const selectedValue = (value as string) || '';

                if (!selectedValue) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      {t('users.filters.anyCountry')}
                    </Typography>
                  );
                }

                const selectedOption = countryOptionsByValue[selectedValue];
                const label = selectedOption?.label ?? selectedValue;

                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CountryFlagIcon code={selectedOption?.code ?? selectedValue} size={20} />
                    <Typography variant="body2" component="span" noWrap>
                      {label}
                    </Typography>
                  </Stack>
                );
              },
            }}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                {t('users.filters.anyCountry')}
              </Typography>
            </MenuItem>
            {countryOptions.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CountryFlagIcon code={country.code} size={20} />
                  <Typography variant="body2" component="span" noWrap>
                    {country.label}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1.5} alignItems="flex-end">
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label={t('users.filters.ageFrom')}
              value={filters.ageFrom}
              onChange={handleFilterChange('ageFrom')}
              placeholder={t('users.filters.agePlaceholder')}
            />
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label={t('users.filters.ageTo')}
              value={filters.ageTo}
              onChange={handleFilterChange('ageTo')}
              placeholder={t('users.filters.agePlaceholder')}
            />
          </Stack>
        </Stack>
      </Menu>

      <UsersDataGrid
        rows={rows}
        rowCount={rowCount}
        loading={isLoading || isValidating}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        columnLabels={columnLabels}
      />
    </TabContext>
  );
};

export default UsersListContainer;
