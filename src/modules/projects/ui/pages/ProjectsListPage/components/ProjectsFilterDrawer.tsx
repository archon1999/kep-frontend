import { useTranslation } from 'react-i18next';
import { MenuItem, Stack, formLabelClasses } from '@mui/material';
import FilterDrawer from 'shared/components/common/FilterDrawer';
import StyledTextField from 'shared/components/styled/StyledTextField';
import {
  PROJECT_CATEGORY_META,
  PROJECT_CATEGORY_ORDER,
  PROJECT_STATUS_OPTIONS,
  ProjectListFilters,
} from '../project-listing';

interface ProjectsFilterDrawerProps {
  open: boolean;
  filters: ProjectListFilters;
  onChange: <Key extends keyof ProjectListFilters>(
    key: Key,
    value: ProjectListFilters[Key],
  ) => void;
  onReset: () => void;
  onClose: () => void;
  levels: { value: number; label: string }[];
  showProgressFilter: boolean;
  progressFilterDisabled: boolean;
}

const ProjectsFilterDrawer = ({
  open,
  filters,
  onChange,
  onReset,
  onClose,
  levels,
  showProgressFilter,
  progressFilterDisabled,
}: ProjectsFilterDrawerProps) => {
  const { t } = useTranslation();
  const hasActiveFilters =
    filters.category !== 'all' || filters.level > 0 || filters.status !== 'all';

  return (
    <FilterDrawer
      id="projects-filters-drawer"
      open={open}
      onClose={onClose}
      title={t('projects.filters')}
      hasActiveFilters={hasActiveFilters}
      clearLabel={t('projects.clear')}
      onClear={onReset}
    >
      <Stack direction="column" gap={1}>
        <StyledTextField
          id="projects-filter-category"
          select
          label={t('projects.categoryFilter')}
          value={filters.category}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) =>
            onChange('category', event.target.value as ProjectListFilters['category'])
          }
        >
          <MenuItem value="all">{t('projects.allCategories')}</MenuItem>
          {PROJECT_CATEGORY_ORDER.map((category) => (
            <MenuItem key={category} value={category}>
              {t(PROJECT_CATEGORY_META[category].labelKey)}
            </MenuItem>
          ))}
        </StyledTextField>
        <StyledTextField
          id="projects-filter-level"
          select
          label={t('projects.level')}
          value={filters.level}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) => onChange('level', Number(event.target.value))}
        >
          <MenuItem value={0}>{t('projects.allLevels')}</MenuItem>
          {levels.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </StyledTextField>
        {showProgressFilter && (
          <StyledTextField
            id="projects-filter-status"
            select
            label={t('projects.progressFilter')}
            value={filters.status}
            fullWidth
            sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
            onChange={(event) =>
              onChange('status', event.target.value as ProjectListFilters['status'])
            }
          >
            {PROJECT_STATUS_OPTIONS.map((status) => (
              <MenuItem
                key={status}
                value={status}
                disabled={progressFilterDisabled && status !== 'all'}
              >
                {t(`projects.status.${status}`)}
              </MenuItem>
            ))}
          </StyledTextField>
        )}
      </Stack>
    </FilterDrawer>
  );
};

export default ProjectsFilterDrawer;
