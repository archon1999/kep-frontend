import { Menu, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContestCategoryEntity } from 'modules/contests/domain/entities/contest.entity';
import KepIcon from 'shared/components/base/KepIcon';

interface ContestsListPageFiltersMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  title: string;
  category?: number;
  type?: string;
  participation: 'all' | 'joined' | 'notJoined';
  categories?: ContestCategoryEntity[];
  contestTypes: readonly string[];
  totalContestsCount?: number;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value?: number) => void;
  onTypeChange: (value?: string) => void;
  onParticipationChange: (value: 'all' | 'joined' | 'notJoined') => void;
}

const ContestsListPageFiltersMenu = ({
  anchorEl,
  open,
  title,
  category,
  type,
  participation,
  categories,
  contestTypes,
  totalContestsCount,
  onClose,
  onTitleChange,
  onCategoryChange,
  onTypeChange,
  onParticipationChange,
}: ContestsListPageFiltersMenuProps) => {
  const { t } = useTranslation();

  const renderCategoryValue = (value: unknown) => {
    const numericValue = Number(value);
    const selectedCategory = (categories ?? []).find((item) => item.id === numericValue);

    if (!numericValue || !selectedCategory) {
      return (
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="body2">{t('contests.allCategories')}</Typography>
          {typeof totalContestsCount === 'number' ? (
            <Typography variant="body2" color="text.secondary">
              {totalContestsCount}
            </Typography>
          ) : null}
        </Stack>
      );
    }

    return (
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Typography variant="body2">{selectedCategory.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedCategory.contestsCount ?? 0}
        </Typography>
      </Stack>
    );
  };

  return (
    <Menu
      id="contests-filters-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 2,
          width: { xs: 320, sm: 360 },
        },
      }}
    >
      <Stack direction="column" spacing={2}>
        <TextField
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KepIcon name="search" fontSize={20} />
              </InputAdornment>
            ),
          }}
          label={t('contests.searchLabel')}
          size="small"
          fullWidth
        />

        <FormControl fullWidth size="small">
          <InputLabel>{t('contests.typeLabel')}</InputLabel>
          <Select
            label={t('contests.typeLabel')}
            value={type ?? ''}
            onChange={(event) => onTypeChange(event.target.value || undefined)}
          >
            <MenuItem value="">
              <em>{t('contests.allTypes')}</em>
            </MenuItem>
            {contestTypes.map((contestType) => (
              <MenuItem key={contestType} value={contestType}>
                {t(`contests.typeLabels.${contestType}` as const)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>{t('contests.categoriesLabel')}</InputLabel>
          <Select
            label={t('contests.categoriesLabel')}
            value={category ? String(category) : ''}
            onChange={(event) =>
              onCategoryChange(event.target.value ? Number(event.target.value) : undefined)
            }
            renderValue={renderCategoryValue}
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
          </Select>
        </FormControl>

        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {t('contests.participationLabel')}
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={participation}
            onChange={(_, value: 'all' | 'joined' | 'notJoined' | null) => {
              if (value) {
                onParticipationChange(value);
              }
            }}
            size="small"
            fullWidth
            sx={{ width: 1 }}
          >
            <ToggleButton value="all">{t('contests.participation.all')}</ToggleButton>
            <ToggleButton value="joined">{t('contests.participation.joined')}</ToggleButton>
            <ToggleButton value="notJoined">{t('contests.participation.notJoined')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Menu>
  );
};

export default ContestsListPageFiltersMenu;
