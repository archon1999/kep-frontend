import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField';
import AppliedFilters, { AppliedFilterItem } from 'shared/components/common/AppliedFilters';
import FilterButton from 'shared/components/common/FilterButton';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import {
  PROJECT_CATEGORY_META,
  PROJECT_SORT_OPTIONS,
  ProjectListFilters,
} from '../project-listing';

interface ProjectsToolbarProps {
  filters: ProjectListFilters;
  onChange: <Key extends keyof ProjectListFilters>(
    key: Key,
    value: ProjectListFilters[Key],
  ) => void;
  onReset: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
  levels: { value: number; label: string }[];
}

const ProjectsToolbar = ({
  filters,
  onChange,
  onReset,
  onToggleFilters,
  filtersOpen,
  levels,
}: ProjectsToolbarProps) => {
  const { t } = useTranslation();
  const activeFilters: AppliedFilterItem[] = [];
  if (filters.search)
    activeFilters.push({
      key: 'search',
      label: filters.search,
      onRemove: () => onChange('search', ''),
    });
  if (filters.category !== 'all')
    activeFilters.push({
      key: 'category',
      label: t(PROJECT_CATEGORY_META[filters.category].labelKey),
      onRemove: () => onChange('category', 'all'),
    });
  if (filters.level)
    activeFilters.push({
      key: 'level',
      label:
        levels.find((level) => level.value === filters.level)?.label ??
        t('projects.levelLabel', { level: filters.level }),
      onRemove: () => onChange('level', 0),
    });
  if (filters.status !== 'all')
    activeFilters.push({
      key: 'status',
      label: t(`projects.status.${filters.status}`),
      onRemove: () => onChange('status', 'all'),
    });

  return (
    <Stack direction="column" spacing={3} mb={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography component="h1" variant="h4">
          {t('projects.title')}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 1.25 }}
          alignItems={{ sm: 'center' }}
          sx={{ width: { xs: 1, md: 'auto' } }}
        >
          <FilterButton
            id="projects-filters-button"
            onClick={onToggleFilters}
            label={t('projects.filters')}
            badgeContent={activeFilters.length}
            aria-haspopup="true"
            aria-expanded={filtersOpen ? 'true' : undefined}
            aria-controls={filtersOpen ? 'projects-filters-drawer' : undefined}
            containerSx={{ width: { xs: 1, sm: 'auto' } }}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          />
          <DebouncedTextField
            textFieldComponent={SearchTextField}
            sx={{ minWidth: 100, width: { xs: 1, sm: 260, md: 300 } }}
            value={filters.search}
            placeholder={t('projects.searchPlaceholder')}
            onValueChange={(value) => onChange('search', value)}
            slotProps={{ htmlInput: { 'aria-label': t('projects.searchPlaceholder') } }}
          />
        </Stack>
      </Stack>
      <Stack direction="column" spacing={2}>
        <ResponsiveTabs
          value={filters.sort}
          onChange={(value) => onChange('sort', value)}
          ariaLabel={t('projects.sortLabel')}
          items={PROJECT_SORT_OPTIONS.map((sort) => ({
            value: sort,
            label: t(`projects.sort.${sort}`),
          }))}
          tabsProps={{ variant: 'scrollable', allowScrollButtonsMobile: true }}
          containerSx={{ width: 1, minWidth: 0 }}
        />
        <AppliedFilters
          filters={activeFilters}
          summaryLabel={t('projects.appliedFilters', { count: activeFilters.length })}
          clearLabel={t('projects.clearFilters')}
          onClear={onReset}
        />
      </Stack>
    </Stack>
  );
};

export default ProjectsToolbar;
