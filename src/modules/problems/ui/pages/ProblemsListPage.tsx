import { MouseEvent, SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { TabContext, TabList } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Tab,
  TablePagination,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import FilterButton from 'shared/components/common/FilterButton.tsx';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import {
  useLastContestProblems,
  useMostViewedProblems,
  useProblemCategories,
  useProblemLanguages,
  useProblemsList,
  useUserProblemsAttempts,
  useUserProblemsRating,
} from '../../application/queries.ts';
import {
  difficultyColorByKey,
  difficultyOptions,
  getDifficultyColor,
  getDifficultyLabelKey,
} from '../../config/difficulty';
import {
  DifficultyBreakdown,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemLanguageOption,
  ProblemListItem,
} from '../../domain/entities/problem.entity.ts';
import { ProblemsListParams } from '../../domain/ports/problems.repository.ts';

const orderingOptions = [
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderEasiest', value: 'difficulty,-solved' },
  { label: 'problems.orderHardest', value: '-difficulty,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

const statusOptions = [
  { label: 'problems.statusUnknown', value: 3, icon: 'mdi:minus', color: 'warning.main' },
  { label: 'problems.statusSolved', value: 1, icon: 'mdi:check', color: 'success.main' },
  { label: 'problems.statusUnsolved', value: 2, icon: 'mdi:close', color: 'error.main' },
];

const initialFilter: ProblemsListParams = {
  ordering: 'id',
  page: 1,
  pageSize: 20,
  tags: [],
};

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState<ProblemsListParams>(initialFilter);
  const [activeTab, setActiveTab] = useState('lastContest');

  const { data: problemsPage, isLoading: isProblemsLoading } = useProblemsList(filter);
  const { data: languages } = useProblemLanguages();
  const { data: categories } = useProblemCategories();
  const { data: mostViewed, isLoading: isMostViewedLoading } = useMostViewedProblems();
  const { data: lastContest, isLoading: isLastContestLoading } = useLastContestProblems();
  const { data: attempts, isLoading: isAttemptsLoading } = useUserProblemsAttempts(
    currentUser?.username ?? undefined,
    10,
  );
  const { data: rating, isLoading: isRatingLoading } = useUserProblemsRating(
    currentUser?.username ?? undefined,
  );
  const isSummaryLoading = isRatingLoading || rating === undefined;

  const problems = problemsPage?.data ?? [];
  const total = problemsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof ProblemsListParams>(
    key: K,
    value: ProblemsListParams[K],
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (_: unknown, page: number) => {
    setFilter((prev) => ({ ...prev, page: page + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, pageSize: Number(event.target.value), page: 1 }));
  };

  const toggleTag = (tagId: number) => {
    setFilter((prev) => {
      const currentTags = prev.tags ?? [];
      const hasTag = currentTags.includes(tagId);
      const nextTags = hasTag ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId];
      return { ...prev, tags: nextTags, page: 1 };
    });
  };

  const renderDifficultyBadge = (problem: ProblemListItem) => {
    const color = getDifficultyColor(problem.difficulty);
    const labelKey = getDifficultyLabelKey(problem.difficulty);

    return (
      <Chip
        size="small"
        label={problem.difficultyTitle || (labelKey ? t(labelKey) : '')}
        color={color}
        variant="outlined"
      />
    );
  };

  const renderProblemBadges = (problem: ProblemListItem) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {problem.hasSolution && (
        <Chip size="small" color="success" label={t('problems.solution')} variant="outlined" />
      )}
      {!problem.hasChecker && (
        <Chip
          size="small"
          color="warning"
          label={t('problems.checkerMissing')}
          variant="outlined"
        />
      )}
      {problem.hidden && (
        <Chip size="small" color="info" label={t('problems.hidden')} variant="outlined" />
      )}
    </Stack>
  );

  const renderTags = (problem: ProblemListItem) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {problem.tags.map((tag) => (
        <Chip
          key={`${problem.id}-${tag.id}`}
          size="small"
          label={tag.name}
          onClick={() => toggleTag(tag.id)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Stack>
  );

  const getRowBackground = (problem: ProblemListItem) => {
    if (problem.userInfo?.hasSolved) {
      return alpha(theme.palette.success.main, 0.12);
    }
    if (problem.userInfo?.hasAttempted) {
      return alpha(theme.palette.error.main, 0.06);
    }
    return undefined;
  };

  return (
    <Stack direction="column" spacing={4} height={1}>
      <PageHeader
        title={t('problems.title2')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('problems.title'), active: true },
        ]}
        actionComponent={
          <Stack direction="row" flexWrap="wrap" justifyContent="flex-end">
            <Button
              component={RouterLink}
              to={resources.ProblemsRating}
              variant="text"
              color="primary"
              startIcon={<IconifyIcon icon="mdi:chart-line" />}
            >
              {t('problems.ratingButton')}
            </Button>
            <Button
              component={RouterLink}
              to={resources.Attempts}
              variant="text"
              color="primary"
              startIcon={<IconifyIcon icon="mdi:target" />}
            >
              {t('problems.attemptsButton')}
            </Button>
            {currentUser ? (
              <Button
                component={RouterLink}
                to={resources.ProblemsUserStatistics}
                variant="text"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:chart-bar" />}
              >
                {t('problems.statisticsPage.title')}
              </Button>
            ) : null}
          </Stack>
        }
      />

      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: { xs: 5, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <FilterCard
              languages={languages ?? []}
              categories={categories ?? []}
              filter={filter}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="column" spacing={3}>
              <ProblemsList
                problems={problems}
                isLoading={isProblemsLoading}
                filter={filter}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                renderDifficultyBadge={renderDifficultyBadge}
                renderProblemBadges={renderProblemBadges}
                renderTags={renderTags}
                getRowBackground={getRowBackground}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="column" spacing={3}>
              {currentUser && (
                <DifficultiesCard
                  difficulties={rating?.difficulties}
                  isLoading={isSummaryLoading}
                />
              )}

              <TabsCard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                attempts={{
                  isLoading: isAttemptsLoading,
                  items: attempts ?? [],
                }}
                lastContest={{
                  isLoading: isLastContestLoading,
                  data: lastContest,
                }}
                mostViewed={{
                  isLoading: isMostViewedLoading,
                  items: mostViewed ?? [],
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

interface FilterCardProps {
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  filter: ProblemsListParams;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
}

const FilterCard = ({ languages, categories, filter, onChange }: FilterCardProps) => {
  const { t } = useTranslation();
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );

  const filtersOpen = Boolean(filtersAnchor);
  const orderingValue = filter.ordering ?? 'id';

  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleFiltersClose = () => setFiltersAnchor(null);

  const handleOrderingChange = (_: SyntheticEvent, value: string) => {
    onChange('ordering', value as string);
  };

  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (filter.lang) {
      const langTitle =
        languages.find((item) => item.lang === filter.lang)?.langFull ?? filter.lang.toUpperCase();
      items.push({
        key: 'lang',
        label: `${t('problems.language')}: ${langTitle}`,
        onRemove: () => onChange('lang', undefined),
      });
    }

    if (filter.favorites) {
      items.push({
        key: 'favorites',
        label: t('problems.favoritesOnly'),
        onRemove: () => onChange('favorites', undefined),
      });
    }

    if (filter.category) {
      const categoryTitle =
        categories.find((category) => String(category.id) === String(filter.category))?.title ??
        String(filter.category);
      items.push({
        key: 'category',
        label: `${t('problems.category')}: ${categoryTitle}`,
        onRemove: () => onChange('category', undefined),
      });
    }

    if (filter.tags && filter.tags.length) {
      filter.tags.forEach((tagId) => {
        const tagName = tags.find((tag) => tag.id === tagId)?.name ?? tagId;
        items.push({
          key: `tag-${tagId}`,
          label: `${t('problems.tags')}: ${tagName}`,
          onRemove: () =>
            onChange(
              'tags',
              (filter.tags ?? []).filter((id) => id !== tagId),
            ),
        });
      });
    }

    if (filter.difficulty) {
      const diffLabel = difficultyOptions.find(
        (item) => item.value === Number(filter.difficulty),
      )?.label;
      items.push({
        key: 'difficulty',
        label: `${t('problems.difficultyLabel')}: ${diffLabel ? t(diffLabel) : filter.difficulty}`,
        onRemove: () => onChange('difficulty', undefined),
      });
    }

    if (filter.status != null) {
      const statusLabel = statusOptions.find((option) => option.value === filter.status)?.label;
      items.push({
        key: 'status',
        label: `${t('problems.status')}: ${statusLabel ? t(statusLabel) : filter.status}`,
        onRemove: () => onChange('status', undefined),
      });
    }

    return items;
  }, [categories, filter, languages, onChange, t, tags]);

  const handleClearFilters = () => {
    onChange('lang', undefined);
    onChange('favorites', undefined);
    onChange('category', undefined);
    onChange('tags', []);
    onChange('difficulty', undefined);
    onChange('status', undefined);
  };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <TabContext value={orderingValue}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <TabList
                onChange={handleOrderingChange}
                aria-label="problems ordering"
                allowScrollButtonsMobile
              >
                {orderingOptions.map((option) => (
                  <Tab key={option.value} label={t(option.label)} value={option.value} />
                ))}
              </TabList>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              alignItems={{ sm: 'center' }}
            >
              <FilterButton
                id="problems-filters-button"
                onClick={handleFiltersToggle}
                label={t('problems.filters')}
                badgeContent={activeFilters.length}
                aria-haspopup="true"
                aria-expanded={filtersOpen ? 'true' : undefined}
                aria-controls={filtersOpen ? 'problems-filters-menu' : undefined}
              />
              <SearchTextField
                sx={{ minWidth: 100 }}
                value={filter.search ?? ''}
                placeholder={t('problems.searchPlaceholder')}
                onChange={(event) => onChange('search', event.target.value)}
              />
            </Stack>
          </Stack>
        </TabContext>

        {activeFilters.length > 0 && (
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
            <Button variant="text" size="small" color="secondary" onClick={handleClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          </Stack>
        )}
      </Stack>

      <Menu
        id="problems-filters-menu"
        anchorEl={filtersAnchor}
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
                {t('problems.filters')}
              </Typography>
            </Stack>
            <Button size="small" variant="text" color="secondary" onClick={handleClearFilters}>
              {t('problems.clearFilters')}
            </Button>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('problems.favoritesOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(filter.favorites)}
                  onChange={(_, checked) => onChange('favorites', checked)}
                  size="small"
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            variant="filled"
            size="small"
            label={t('problems.language')}
            value={filter.lang ?? ''}
            onChange={(event) =>
              onChange(
                'lang',
                event.target.value === '' ? undefined : (event.target.value as string),
              )
            }
          >
            <MenuItem value="">{t('problems.allLanguages')}</MenuItem>
            {languages.map((item) => (
              <MenuItem key={item.lang} value={item.lang}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{item.langFull}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.lang.toUpperCase()}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.category')}
            value={filter.category ?? ''}
            variant="filled"
            onChange={(event) =>
              onChange(
                'category',
                event.target.value === '' ? undefined : String(event.target.value),
              )
            }
          >
            <MenuItem value="">{t('problems.allCategories')}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                  <Typography variant="body2">{category.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                    {category.problemsCount ?? 0}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            variant="filled"
            label={t('problems.tags')}
            value={filter.tags ?? []}
            onChange={(event) =>
              onChange(
                'tags',
                (event.target.value as any).map((item: any) => Number(item)),
              )
            }
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(selected as number[]).map((id) => {
                    const tag = tags.find((item) => item.id === id);
                    return <Chip key={id} size="small" label={tag?.name ?? id} />;
                  })}
                </Stack>
              ),
            }}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{tag.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tag.category}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.difficultyLabel')}
            value={filter.difficulty ?? ''}
            variant="filled"
            onChange={(event) =>
              onChange(
                'difficulty',
                event.target.value === '' ? undefined : String(event.target.value),
              )
            }
          >
            <MenuItem value="">{t('problems.allDifficulties')}</MenuItem>
            {difficultyOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {t(item.label)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label={t('problems.status')}
            value={filter.status != null ? String(filter.status) : ''}
            variant="filled"
            onChange={(event) => {
              const value = event.target.value;
              onChange('status', value === '' ? undefined : Number(value));
            }}
          >
            <MenuItem value="">{t('problems.allStatuses')}</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconifyIcon
                    icon={option.icon}
                    width={18}
                    height={18}
                    color={option.color as string}
                  />
                  <Typography variant="body2">{t(option.label)}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Menu>
    </>
  );
};

interface ProblemsListProps {
  problems: ProblemListItem[];
  isLoading: boolean;
  filter: ProblemsListParams;
  total: number;
  onPageChange: (event: unknown, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  renderDifficultyBadge: (problem: ProblemListItem) => React.ReactNode;
  renderProblemBadges: (problem: ProblemListItem) => React.ReactNode;
  renderTags: (problem: ProblemListItem) => React.ReactNode;
  getRowBackground: (problem: ProblemListItem) => string | undefined;
}

const ProblemsList = ({
  problems,
  isLoading,
  filter,
  total,
  onPageChange,
  onRowsPerPageChange,
  renderDifficultyBadge,
}: ProblemsListProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const renderStatusIcon = (problem: ProblemListItem) => {
    if (problem.userInfo?.hasSolved) {
      return (
        <Tooltip title={t('problems.statusSolved')}>
          <IconifyIcon
            icon="mdi:check-circle"
            width={20}
            height={20}
            color={theme.palette.success.main}
          />
        </Tooltip>
      );
    }

    if (problem.userInfo?.hasAttempted) {
      return (
        <Tooltip title={t('problems.statusUnsolved')}>
          <IconifyIcon
            icon="mdi:close-circle"
            width={20}
            height={20}
            color={theme.palette.error.main}
          />
        </Tooltip>
      );
    }

    return (
      <IconifyIcon icon="mdi:minus-circle-outline" width={20} height={20} color="transparent" />
    );
  };

  const renderSolvedBadges = (problem: ProblemListItem) => {
    const solved = problem.solved ?? 0;
    const notSolved = problem.notSolved ?? Math.max((problem.attemptsCount ?? 0) - solved, 0);

    return (
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <IconifyIcon
            icon="mdi:user-check"
            width={18}
            height={18}
            color={theme.palette.success.main}
          />
          <Typography variant="body2" fontWeight={700}>
            {solved}
          </Typography>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: alpha(theme.palette.text.primary, 0.08), minHeight: 24 }}
        />

        <Stack direction="row" spacing={0.75} alignItems="center">
          <IconifyIcon
            icon="mdi:user-minus"
            width={18}
            height={18}
            color={theme.palette.error.main}
          />
          <Typography
            variant="body2"
            fontWeight={700}
            color={notSolved > 0 ? 'error.main' : 'text.secondary'}
          >
            {notSolved}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      {isLoading ? (
        <Stack direction="column" spacing={1.5}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} variant="rounded" height={90} />
          ))}
        </Stack>
      ) : problems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('problems.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('problems.emptySubtitle')}
          </Typography>
        </Box>
      ) : (
        <Stack direction="column" spacing={1.25}>
          {problems.map((problem) => {
            return (
              <Card
                key={problem.id}
                component={RouterLink}
                to={getResourceById(resources.Problem, problem.id)}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                    borderColor: alpha(theme.palette.primary.main, 0.25),
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" flex={1}>
                      {renderStatusIcon(problem)}

                      <Stack direction="column" spacing={0.25} minWidth={0}>
                        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                          {problem.id}. {problem.title}
                        </Typography>
                        {renderSolvedBadges(problem)}
                      </Stack>
                    </Stack>
                  </Stack>

                  {renderDifficultyBadge(problem)}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      {problems.length > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={(filter.page ?? 1) - 1}
          onPageChange={onPageChange}
          rowsPerPage={filter.pageSize ?? 20}
          rowsPerPageOptions={[10, 20, 50]}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={CustomTablePaginationAction}
        />
      )}
    </>
  );
};

interface DifficultiesCardProps {
  difficulties?: DifficultyBreakdown;
  isLoading: boolean;
}

const DifficultiesCard = ({ difficulties, isLoading }: DifficultiesCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const entries = useMemo(
    () =>
      difficultyOptions.map((option) => ({
        key: option.key,
        totalKey: `all${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}`,
        label: t(option.label),
        color: difficultyColorByKey[option.key],
      })),
    [t],
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:chart-pie" width={20} height={20} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.difficultyBreakdown')}
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        {isLoading || !difficulties ? (
          <Stack direction="column" spacing={1}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={20} />
            ))}
          </Stack>
        ) : (
          <Stack direction="column" spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('problems.difficultyOverview', {
                solved: difficulties.totalSolved,
                total: difficulties.totalProblems,
              })}
            </Typography>
            {entries.map((entry) => {
              const solved = (difficulties as any)[entry.key] as number;
              const total = (difficulties as any)[entry.totalKey] as number;
              const percent = total ? Math.min(100, (solved / total) * 100) : 0;

              return (
                <Stack key={entry.key} direction="column" spacing={0.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {entry.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {solved} / {total}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      bgcolor: alpha(theme.palette[entry.color].main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette[entry.color].main,
                      },
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

interface TabContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  attempts: { isLoading: boolean; items: ProblemAttemptSummary[] };
  lastContest: { isLoading: boolean; data: any };
  mostViewed: { isLoading: boolean; items: ProblemListItem[] };
}

const TabsCard = ({
  activeTab,
  onTabChange,
  attempts,
  lastContest,
  mostViewed,
}: TabContentProps) => {
  const { t } = useTranslation();

  const renderAttempts = () => {
    if (attempts.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!attempts.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noAttempts')}
        </Typography>
      );
    }

    return (
      <List dense>
        {attempts.items.map((attempt) => (
          <ListItemButton
            key={attempt.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, attempt.problemId)}
          >
            <ListItemText primary={`${attempt.problemId}. ${attempt.problemTitle}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const renderLastContest = () => {
    if (lastContest.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!lastContest.data) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noLastContest')}
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          {lastContest.data.title}
        </Typography>
        <List dense>
          {(lastContest.data.problems ?? []).map((problem: any) => (
            <ListItemButton
              key={problem.id}
              component={RouterLink}
              to={getResourceById(resources.Problem, problem.id)}
            >
              <ListItemText
                primary={`${problem.symbol ? `${problem.symbol}. ` : ''}${problem.title}`}
              />
            </ListItemButton>
          ))}
        </List>
        <Button
          component={RouterLink}
          to={getResourceById(resources.Contest, lastContest.data.id)}
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {t('problems.goToContest')}
        </Button>
      </Stack>
    );
  };

  const renderMostViewed = () => {
    if (mostViewed.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!mostViewed.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noMostViewed')}
        </Typography>
      );
    }

    return (
      <List dense>
        {mostViewed.items.map((problem) => (
          <ListItemButton
            key={problem.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, problem.id)}
          >
            <ListItemText primary={`${problem.id}. ${problem.title}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <Card variant="outlined">
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="lastContest" label={t('problems.lastContestProblems')} />
        <Tab value="attempts" label={t('problems.lastAttempts')} />
        <Tab value="mostViewed" label={t('problems.mostViewed')} />
      </Tabs>
      <Divider />
      <CardContent>
        {activeTab === 'lastContest' && renderLastContest()}
        {activeTab === 'attempts' && renderAttempts()}
        {activeTab === 'mostViewed' && renderMostViewed()}
      </CardContent>
    </Card>
  );
};

export default ProblemsListPage;
