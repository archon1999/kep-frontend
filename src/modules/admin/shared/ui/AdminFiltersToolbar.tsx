import { ChangeEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Stack, Typography } from '@mui/material';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField';
import FilterButton from 'shared/components/common/FilterButton';
import FilterDrawer, { DEFAULT_FILTER_DRAWER_WIDTH } from 'shared/components/common/FilterDrawer';

export interface AdminActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

interface AdminFiltersToolbarProps {
  id: string;
  search: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  filters?: ReactNode;
  activeFilters?: AdminActiveFilter[];
  onClearFilters?: () => void;
  filterLabel?: string;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
}

const AdminFiltersToolbar = ({
  id,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilters = [],
  onClearFilters,
  filterLabel,
  filtersOpen = false,
  onToggleFilters,
}: AdminFiltersToolbarProps) => {
  const { t } = useTranslation();
  const [localFiltersOpen, setLocalFiltersOpen] = useState(false);
  const resolvedFilterLabel = filterLabel ?? t('problems.filters');
  const resolvedFiltersOpen = onToggleFilters ? filtersOpen : localFiltersOpen;
  const handleFiltersToggle = onToggleFilters ?? (() => setLocalFiltersOpen((current) => !current));
  const handleFiltersClose = () => setLocalFiltersOpen(false);

  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
        alignItems={{ sm: 'center' }}
        justifyContent="flex-end"
      >
        {filters ? (
          <FilterButton
            id={`${id}-filters-button`}
            onClick={handleFiltersToggle}
            label={resolvedFilterLabel}
            badgeContent={activeFilters.length}
            aria-haspopup="dialog"
            aria-expanded={resolvedFiltersOpen ? 'true' : undefined}
            aria-controls={resolvedFiltersOpen ? `${id}-filters-drawer` : undefined}
            containerSx={{ width: { xs: 1, sm: 'auto' } }}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          />
        ) : null}
        <SearchTextField
          sx={{ minWidth: { xs: 1, sm: 280 } }}
          value={search}
          placeholder={searchPlaceholder}
          variant="filled"
          onChange={onSearchChange}
        />
      </Stack>

      {activeFilters.length > 0 ? (
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
          {onClearFilters ? (
            <Button variant="text" size="small" color="secondary" onClick={onClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          ) : null}
        </Stack>
      ) : null}

      {filters && !onToggleFilters ? (
        <FilterDrawer
          id={`${id}-filters-drawer`}
          open={resolvedFiltersOpen}
          onClose={handleFiltersClose}
          drawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
          temporary
          hasActiveFilters={activeFilters.length > 0}
          clearLabel={t('problems.clear')}
          onClear={onClearFilters}
        >
          {filters}
        </FilterDrawer>
      ) : null}
    </Stack>
  );
};

export default AdminFiltersToolbar;
