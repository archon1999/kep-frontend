import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import { Button, Chip, Menu, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';

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
}: AdminFiltersToolbarProps) => {
  const { t } = useTranslation();
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<HTMLElement | null>(null);
  const filtersOpen = Boolean(filtersAnchorEl);
  const resolvedFilterLabel = filterLabel ?? t('problems.filters');

  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchorEl((current) => (current ? null : event.currentTarget));
  };

  const handleFiltersClose = () => setFiltersAnchorEl(null);

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
            aria-haspopup="true"
            aria-expanded={filtersOpen ? 'true' : undefined}
            aria-controls={filtersOpen ? `${id}-filters-menu` : undefined}
          />
        ) : null}
        <SearchTextField
          sx={{ minWidth: { xs: 1, sm: 280 } }}
          value={search}
          placeholder={searchPlaceholder}
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

      {filters ? (
        <Menu
          id={`${id}-filters-menu`}
          anchorEl={filtersAnchorEl}
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
                  {resolvedFilterLabel}
                </Typography>
              </Stack>
              {onClearFilters ? (
                <Button size="small" variant="text" color="secondary" onClick={onClearFilters}>
                  {t('problems.clearFilters')}
                </Button>
              ) : null}
            </Stack>
            {filters}
          </Stack>
        </Menu>
      ) : null}
    </Stack>
  );
};

export default AdminFiltersToolbar;
