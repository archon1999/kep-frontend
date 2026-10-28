import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { ContestStandingsPageModel } from 'modules/contests/application/hooks/useContestStandingsPage';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import FilterPopover from 'shared/components/common/FilterPopover';

type Props = Pick<
  ContestStandingsPageModel,
  | 'contest'
  | 'contestFilters'
  | 'selectedFilter'
  | 'followingOnly'
  | 'officialOnly'
  | 'activeFiltersCount'
  | 'onFiltersChange'
  | 'onClearFilters'
> & { onReplay: () => void };
const ContestStandingsControls = ({
  contest,
  contestFilters,
  selectedFilter,
  followingOnly,
  officialOnly,
  activeFiltersCount,
  onFiltersChange,
  onClearFilters,
  onReplay,
}: Props) => {
  const { t } = useTranslation();
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const filtersOpen = Boolean(filtersAnchor);
  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleFiltersClose = () => {
    setFiltersAnchor(null);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {contest?.statusCode === ContestStatus.Finished && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<IconifyIcon icon="mdi:play-circle-outline" />}
          onClick={onReplay}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {t('contests.replay.title')}
        </Button>
      )}
      <FilterButton
        id="contest-standings-filters-button"
        onClick={handleFiltersToggle}
        variant="outlined"
        color="primary"
        label={t('contests.filters.toggle')}
        badgeContent={activeFiltersCount}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen ? 'true' : undefined}
        aria-controls={filtersOpen ? 'contest-standings-filters-menu' : undefined}
      />

      <FilterPopover
        id="contest-standings-filters-menu"
        title={t('contests.filters.toggle')}
        anchorEl={filtersAnchor}
        onClose={handleFiltersClose}
        onReset={onClearFilters}
        hasActiveFilters={Boolean(selectedFilter) || followingOnly || !officialOnly}
        resetLabel={t('contests.filter.reset')}
        doneLabel={t('contests.filters.done')}
        align="right"
      >
        <Stack direction="column" spacing={2.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pb: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('contests.standings.followingOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={followingOnly}
                  slotProps={{ input: { 'aria-label': t('contests.standings.followingOnly') } }}
                  onChange={(_, checked) => {
                    onFiltersChange({ followingOnly: checked });
                  }}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pb: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('contests.standings.officialOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={officialOnly}
                  slotProps={{ input: { 'aria-label': t('contests.standings.officialOnly') } }}
                  onChange={(_, checked) => {
                    onFiltersChange({ officialOnly: checked });
                  }}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            variant="outlined"
            size="small"
            slotProps={{ select: { MenuProps: { slotProps: { paper: { variant: 'framed' } } } } }}
            label={t('contests.standings.allFilters')}
            value={selectedFilter}
            disabled={!contestFilters.length}
            onChange={(event) => {
              onFiltersChange({ selectedFilter: event.target.value });
            }}
          >
            <MenuItem value="">
              <Typography variant="body2">{t('contests.standings.allFilters')}</Typography>
            </MenuItem>
            {contestFilters.map((filter) => (
              <MenuItem key={filter.id} value={String(filter.id)}>
                {filter.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </FilterPopover>
    </Stack>
  );
};
export default ContestStandingsControls;
