import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Stack } from '@mui/material';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import FilterButton from 'shared/components/common/FilterButton';
import FilterPopover from 'shared/components/common/FilterPopover';
import SearchTextField from 'shared/components/common/SearchTextField';

export interface AdminActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

interface AdminFiltersToolbarProps {
  id: string;
  search: string;
  onSearchChange: (value: string) => void;
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const resolvedFilterLabel = filterLabel ?? t('problems.filters');
  const resolvedFiltersOpen = onToggleFilters ? filtersOpen : Boolean(anchorEl);
  const handleFiltersToggle =
    onToggleFilters ?? ((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget));
  const handleFiltersClose = () => setAnchorEl(null);

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
        <DebouncedTextField
          textFieldComponent={SearchTextField}
          sx={{ minWidth: { xs: 1, sm: 280 } }}
          value={search}
          placeholder={searchPlaceholder}
          variant="filled"
          onValueChange={onSearchChange}
        />
      </Stack>

      {activeFilters.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
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
        <FilterPopover
          title={resolvedFilterLabel}
          anchorEl={anchorEl}
          id={`${id}-filters-drawer`}
          onClose={handleFiltersClose}
          hasActiveFilters={activeFilters.length > 0}
          resetLabel={t('problems.clear')}
          doneLabel={t('contests.filters.done')}
          onReset={onClearFilters ?? (() => undefined)}
        >
          {filters}
        </FilterPopover>
      ) : null}
    </Stack>
  );
};

export default AdminFiltersToolbar;
