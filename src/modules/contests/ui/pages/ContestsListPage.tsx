import { MouseEvent, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Menu,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import FilterButton from 'shared/components/common/FilterButton';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import ContestCard from '../components/ContestCard';
import { useContestCategories, useContestsList } from '../../application/queries';
import { resources } from 'app/routes/resources';
import { useAuth } from 'app/providers/AuthProvider';

const contestTypes = [
  'ACM2H',
  'ACM10M',
  'ACM20M',
  'IOI',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'IQ',
  'Ball',
  'DC',
  'MultiL',
  'CodeGolf',
  'Exam',
] as const;

const DEFAULT_PAGE_SIZE = 6;

type ContestListQueryState = {
  page: number;
  title: string;
  category?: number;
  type?: string;
  participation: 'all' | 'joined' | 'notJoined';
};

const ContestsListPage = () => {
  const { t } = useTranslation();
  const { data: categories } = useContestCategories();
  const { currentUser } = useAuth();

  const { state, setField } = useRouteQueryState<ContestListQueryState>({
    defaults: {
      page: 1,
      title: '',
      category: undefined,
      type: undefined,
      participation: 'all',
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
      title: {
        ...stringParam(),
        param: 'title',
      },
      category: {
        ...numberParam({ min: 1 }),
        param: 'category',
      },
      type: {
        ...stringParam(),
        param: 'type',
      },
      participation: {
        ...enumParam(['all', 'joined', 'notJoined'] as const),
        param: 'participation',
      },
    },
    historyByKey: {
      page: 'push',
    },
    pageResetKeys: ['title', 'category', 'type', 'participation'],
  });
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);

  const debouncedTitle = useDebouncedValue(state.title, 400);

  const filtersOpen = Boolean(filtersAnchorEl);

  const queryParams = useMemo(
    () => ({
      page: state.page,
      pageSize: DEFAULT_PAGE_SIZE,
      title: debouncedTitle || undefined,
      category: state.category ? String(state.category) : undefined,
      type: state.type,
      is_participated:
        state.participation === 'joined'
          ? '1'
          : state.participation === 'notJoined'
            ? '0'
            : undefined,
    }),
    [debouncedTitle, state.category, state.page, state.participation, state.type],
  );

  const { data: pageResult, isLoading } = useContestsList(queryParams);
  const contests = pageResult?.data ?? [];
  const showEmptyState = !isLoading && contests.length === 0;
  const totalContestsCount = useMemo(
    () => categories?.reduce((sum, category) => sum + (category.contestsCount ?? 0), 0),
    [categories],
  );

  const handleCategory = (id?: number) => {
    setField('category', id);
  };

  const handleTypeChange = (value?: string) => {
    setField('type', value || undefined);
  };

  const handleParticipationChange = (_: any, value: 'all' | 'joined' | 'notJoined') => {
    if (!value) return;
    setField('participation', value);
  };

  const handleFiltersToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (filtersOpen) {
      setFiltersAnchorEl(null);
      return;
    }

    setFiltersAnchorEl(event.currentTarget);
  };

  const handleFiltersClose = () => setFiltersAnchorEl(null);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper',
            background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
          })}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                spacing={2}
              >
                <Stack direction="column" spacing={1}>
                  <Typography variant="h4" fontWeight={800}>
                    {t('contests.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                    {t('contests.subtitle')}
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <Button
                    component={RouterLink}
                    to={resources.ContestsRating}
                    variant="contained"
                    color="primary"
                    startIcon={<IconifyIcon icon="mdi:trophy" sx={{ fontSize: 20 }} />}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                  >
                    {t('contests.viewRating')}
                  </Button>

                  {currentUser ? (
                    <Button
                      component={RouterLink}
                      to={resources.ContestsUserStatistics}
                      variant="outlined"
                      color="primary"
                      startIcon={<IconifyIcon icon="mdi:chart-line" sx={{ fontSize: 20 }} />}
                      sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                    >
                      {t('contests.viewMyStats')}
                    </Button>
                  ) : null}

                  <FilterButton
                    onClick={handleFiltersToggle}
                    aria-haspopup="true"
                    aria-expanded={filtersOpen ? 'true' : undefined}
                    aria-controls={filtersOpen ? 'contests-filters-menu' : undefined}
                    label={t('contests.filters.toggle')}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              right: { xs: -24, md: 24 },
              bottom: { xs: -24, md: 8 },
              opacity: 0.08,
              pointerEvents: 'none',
            }}
          >
            <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
          </Box>
        </Card>

        <Menu
          id="contests-filters-menu"
          anchorEl={filtersAnchorEl}
          open={filtersOpen}
          onClose={handleFiltersClose}
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
              value={state.title}
              onChange={(event) => setField('title', event.target.value)}
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
                value={state.type ?? ''}
                onChange={(event) => handleTypeChange(event.target.value || undefined)}
              >
                <MenuItem value="">
                  <em>{t('contests.allTypes')}</em>
                </MenuItem>
                {contestTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`contests.typeLabels.${type}` as const)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('contests.categoriesLabel')}</InputLabel>
              <Select
                label={t('contests.categoriesLabel')}
                value={state.category ? String(state.category) : ''}
                onChange={(event) => handleCategory(event.target.value ? Number(event.target.value) : undefined)}
                renderValue={(value) => {
                  const numericValue = Number(value);
                  const category = (categories ?? []).find((item) => item.id === numericValue);

                  if (!numericValue || !category) {
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
                      <Typography variant="body2">{category.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.contestsCount ?? 0}
                      </Typography>
                    </Stack>
                  );
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
                {(categories ?? []).map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{category.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.contestsCount ?? 0}
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
                value={state.participation}
                onChange={handleParticipationChange}
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

        {showEmptyState ? (
          <Box
            sx={{
              py: 8,
              px: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('contests.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('contests.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Stack direction="column" spacing={3}>
            <Grid container spacing={3}>
              {isLoading
                ? Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, idx) => (
                    <Grid size={{ xs: 12 }} key={idx}>
                      <Skeleton variant="rounded" height={400} />
                    </Grid>
                  ))
                : contests.map((contest) => (
                    <Grid size={{ xs: 12 }} key={contest.id}>
                      <ContestCard contest={contest} />
                    </Grid>
                  ))}
            </Grid>

            {pageResult && pageResult.pagesCount > 1 ? (
              <Stack direction="row" justifyContent="center">
                <Pagination
                  count={pageResult.pagesCount}
                  page={state.page}
                  onChange={(_, value) => setField('page', value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ContestsListPage;
