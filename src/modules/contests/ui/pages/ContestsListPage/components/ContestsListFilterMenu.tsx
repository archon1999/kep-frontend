import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InputAdornment,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ContestCategoryEntity } from 'modules/contests/domain/entities/contest.entity';
import KepIcon from 'shared/components/base/KepIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import FilterPopover from 'shared/components/common/FilterPopover';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { filterOptionsSx } from '../ContestsListPage.styles';

interface ContestsListFilterMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  category?: number;
  type?: string;
  participation: 'all' | 'participated' | 'registered';
  categories?: ContestCategoryEntity[];
  contestTypes: readonly string[];
  totalContestsCount?: number;
  hasActiveFilters: boolean;
  onClear: () => void;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value?: number) => void;
  onTypeChange: (value?: string) => void;
  onParticipationChange: (value: 'all' | 'participated' | 'registered') => void;
}

const ContestsListFilterMenu = ({
  anchorEl,
  onClose,
  title,
  category,
  type,
  participation,
  categories,
  contestTypes,
  totalContestsCount,
  hasActiveFilters,
  onClear,
  onTitleChange,
  onCategoryChange,
  onTypeChange,
  onParticipationChange,
}: ContestsListFilterMenuProps) => {
  const { t } = useTranslation();

  const renderCategoryValue = (value: unknown): ReactNode => {
    const numericValue = Number(value);
    const selectedCategory = (categories ?? []).find((item) => item.id === numericValue);

    if (!numericValue || !selectedCategory) {
      return (
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="body2">{t('contests.allCategories')}</Typography>
          {typeof totalContestsCount === 'number' ? (
            <Typography className="contests-category-count" variant="body2" color="text.secondary">
              {totalContestsCount}
            </Typography>
          ) : null}
        </Stack>
      );
    }

    return (
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Typography variant="body2">{selectedCategory.title}</Typography>
        <Typography className="contests-category-count" variant="body2" color="text.secondary">
          {selectedCategory.contestsCount ?? 0}
        </Typography>
      </Stack>
    );
  };

  return (
    <FilterPopover
      id="contests-filter-menu"
      title={t('problems.filters')}
      anchorEl={anchorEl}
      onClose={onClose}
      onReset={onClear}
      hasActiveFilters={hasActiveFilters}
      resetLabel={t('problems.clear')}
      doneLabel={t('contests.filters.done')}
    >
      <Stack direction="column" gap={2}>
        <DebouncedTextField
          value={title}
          onValueChange={onTitleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KepIcon name="search" fontSize={20} />
              </InputAdornment>
            ),
          }}
          label={t('contests.searchLabel')}
          placeholder={t('contests.searchLabel')}
          fullWidth
        />

        <StyledTextField
          select
          label={t('contests.typeLabel')}
          value={type ?? ''}
          fullWidth
          onChange={(event) => onTypeChange(event.target.value || undefined)}
          SelectProps={{
            displayEmpty: true,
            MenuProps: {
              slotProps: { paper: { variant: 'framed', sx: filterOptionsSx } },
            },
          }}
        >
          <MenuItem value="">{t('contests.allTypes')}</MenuItem>
          {contestTypes.map((contestType) => (
            <MenuItem key={contestType} value={contestType}>
              {t(`contests.typeLabels.${contestType}` as const)}
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledTextField
          select
          label={t('contests.categoriesLabel')}
          value={category ? String(category) : ''}
          fullWidth
          onChange={(event) =>
            onCategoryChange(event.target.value ? Number(event.target.value) : undefined)
          }
          SelectProps={{
            displayEmpty: true,
            renderValue: renderCategoryValue,
            MenuProps: {
              slotProps: { paper: { variant: 'framed', sx: filterOptionsSx } },
            },
          }}
        >
          <MenuItem value="">
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Typography variant="body2">{t('contests.allCategories')}</Typography>
              {typeof totalContestsCount === 'number' ? (
                <Typography variant="body2" color="text.secondary">
                  {totalContestsCount}
                </Typography>
              ) : null}
            </Stack>
          </MenuItem>
          {(categories ?? []).map((item) => (
            <MenuItem key={item.id} value={String(item.id)}>
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Typography variant="body2">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.contestsCount ?? 0}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </StyledTextField>

        <Stack direction="column" spacing={1}>
          <Typography
            className="contests-participation-label"
            variant="subtitle2"
            color="text.secondary"
          >
            {t('contests.participationLabel')}
          </Typography>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={participation}
            onChange={(_, value: 'all' | 'participated' | 'registered' | null) => {
              if (value) {
                onParticipationChange(value);
              }
            }}
            size="small"
            fullWidth
            sx={{ width: 1 }}
          >
            <ToggleButton value="all">{t('contests.participation.all')}</ToggleButton>
            <ToggleButton value="participated">
              {t('contests.participation.participated')}
            </ToggleButton>
            <ToggleButton value="registered">{t('contests.participation.registered')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </FilterPopover>
  );
};

export default ContestsListFilterMenu;
