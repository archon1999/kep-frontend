import { KeyboardEvent, MouseEvent, SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography,
  alpha,
  checkboxClasses,
  drawerClasses,
  formControlLabelClasses,
  formLabelClasses,
  styled,
  useTheme,
} from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { difficultyOptions } from 'modules/problems/config/difficulty';
import {
  ProblemCategory,
  ProblemLanguageOption,
} from 'modules/problems/domain/entities/problem.entity.ts';
import { ProblemsListParams } from 'modules/problems/domain/ports/problems.repository.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import StyledTextField from 'shared/components/styled/StyledTextField.tsx';

export const problemStatusOptions = [
  { label: 'problems.statusUnknown', value: 3, icon: 'mdi:minus', color: 'warning.main' },
  { label: 'problems.statusSolved', value: 1, icon: 'mdi:check', color: 'success.main' },
  { label: 'problems.statusUnsolved', value: 2, icon: 'mdi:close', color: 'error.main' },
];

const problemRatingRange = {
  min: 100,
  max: 3000,
  step: 100,
};

export interface ProblemsFilterDrawerProps {
  open: boolean;
  handleClose: () => void;
  drawerWidth: number;
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  filter: ProblemsListParams;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
  onPatch: (patch: Partial<ProblemsListParams>) => void;
}

const ProblemsFilterDrawer = ({
  open,
  handleClose,
  drawerWidth,
  languages,
  categories,
  filter,
  onChange,
  onPatch,
}: ProblemsFilterDrawerProps) => {
  const { up } = useBreakpoints();
  const { topbarHeight } = useNavContext();
  const upXl = up('xl');
  const upSm = up('sm');
  const drawerContent = (
    <ProblemsFilterDrawerContent
      handleClose={handleClose}
      languages={languages}
      categories={categories}
      filter={filter}
      onChange={onChange}
      onPatch={onPatch}
    />
  );

  return (
    <>
      {upXl ? (
        <Drawer
          variant="persistent"
          open={open}
          sx={(theme) => ({
            flexShrink: 0,
            display: { xs: 'none', xl: 'block' },
            [`& .${drawerClasses.paper}`]: {
              position: 'sticky',
              zIndex: 'unset',
              top: theme.mixins.topOffset(topbarHeight),
              height: theme.mixins.contentHeight(
                topbarHeight,
                (upSm ? theme.mixins.footer.sm : theme.mixins.footer.xs) + 1,
              ),
              border: 0,
              overflowY: 'auto',
              width: drawerWidth,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleClose}
          ModalProps={{
            disableAutoFocus: true,
            disableEnforceFocus: true,
            disableRestoreFocus: true,
          }}
          disablePortal
          sx={(theme) => ({
            display: { xs: 'block', xl: 'none' },
            [`& .${drawerClasses.paper}`]: {
              top: theme.mixins.topOffset(topbarHeight),
              height: theme.mixins.contentHeight(topbarHeight),
              width: drawerWidth,
              border: 0,
              zIndex: theme.zIndex.drawer,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

type ProblemFilterDrawerContentProps = Omit<ProblemsFilterDrawerProps, 'open' | 'drawerWidth'>;

const ProblemsFilterDrawerContent = ({
  handleClose,
  languages,
  categories,
  filter,
  onChange,
  onPatch,
}: ProblemFilterDrawerContentProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tagsAnchor, setTagsAnchor] = useState<HTMLElement | null>(null);
  const [expandedTagCategories, setExpandedTagCategories] = useState<string[]>([]);

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );
  const groupedTags = useMemo(() => {
    const selectedCategoryId = filter.category == null ? null : String(filter.category);

    return categories
      .map((category) => ({
        id: category.id,
        title: category.title,
        isFocused: selectedCategoryId != null && String(category.id) === selectedCategoryId,
        tags: (category.tags ?? [])
          .slice()
          .sort((left, right) => left.name.localeCompare(right.name)),
      }))
      .filter((category) => category.tags.length > 0)
      .sort((left, right) => {
        if (left.isFocused !== right.isFocused) {
          return left.isFocused ? -1 : 1;
        }

        return left.title.localeCompare(right.title);
      });
  }, [categories, filter.category]);

  const tagsOpen = Boolean(tagsAnchor);
  const ratingRangeValue = useMemo<[number, number]>(() => {
    const min = Number(filter.problem_rating_min);
    const max = Number(filter.problem_rating_max);
    const normalizedMin = Number.isFinite(min) && min > 0 ? min : problemRatingRange.min;
    const normalizedMax = Number.isFinite(max) && max > 0 ? max : problemRatingRange.max;

    return [
      Math.max(problemRatingRange.min, Math.min(normalizedMin, normalizedMax)),
      Math.min(problemRatingRange.max, Math.max(normalizedMin, normalizedMax)),
    ];
  }, [filter.problem_rating_max, filter.problem_rating_min]);

  const tagSummary = useMemo(() => {
    const activeTagIds = filter.tags ?? [];

    if (activeTagIds.length === 0) {
      return `${groupedTags.length} categories, ${tags.length} tags`;
    }

    const activeTagNames = activeTagIds
      .map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
      .filter((name): name is string => Boolean(name));

    if (activeTagNames.length === 0) {
      return t('problems.appliedFilters', { count: activeTagIds.length });
    }

    if (activeTagNames.length <= 2) {
      return activeTagNames.join(', ');
    }

    return `${activeTagNames.slice(0, 2).join(', ')} +${activeTagNames.length - 2}`;
  }, [filter.tags, groupedTags.length, t, tags]);

  const hasActiveFilters = Boolean(
    filter.lang ||
      filter.exclusive_lang ||
      filter.favorites ||
      filter.category ||
      (filter.tags?.length ?? 0) > 0 ||
      filter.difficulty ||
      filter.status != null ||
      filter.has_solution === 'true' ||
      filter.has_checker === 'true' ||
      filter.partial_solvable === 'false' ||
      (Number(filter.problem_rating_min) > problemRatingRange.min &&
        Number.isFinite(Number(filter.problem_rating_min))) ||
      (Number(filter.problem_rating_max) < problemRatingRange.max &&
        Number.isFinite(Number(filter.problem_rating_max))),
  );

  const handleClearFilters = () => {
    onPatch({
      lang: undefined,
      exclusive_lang: undefined,
      favorites: undefined,
      category: undefined,
      tags: [],
      difficulty: undefined,
      status: undefined,
      problem_rating_min: undefined,
      problem_rating_max: undefined,
      has_solution: undefined,
      has_checker: undefined,
      partial_solvable: undefined,
    });
  };

  const handleTagsToggle = (event: MouseEvent<HTMLElement>) => {
    setTagsAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleTagsKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setTagsAnchor((current) => (current ? null : event.currentTarget));
    }
  };

  const handleTagsClose = () => setTagsAnchor(null);

  const handleTagToggle = (tagId: number) => {
    const activeTags = filter.tags ?? [];
    const nextTags = activeTags.includes(tagId)
      ? activeTags.filter((id) => id !== tagId)
      : [...activeTags, tagId];

    onChange('tags', nextTags);
  };

  const handleTagCategoryToggle =
    (categoryId: string) => (_event: SyntheticEvent, expanded: boolean) => {
      setExpandedTagCategories((prev) =>
        expanded ? [...prev, categoryId] : prev.filter((item) => item !== categoryId),
      );
    };

  const handleRatingRangeChange = (_event: Event, value: number | number[]) => {
    if (!Array.isArray(value)) return;

    const [min, max] = value;
    onPatch({
      problem_rating_min: min > problemRatingRange.min ? String(min) : undefined,
      problem_rating_max: max < problemRatingRange.max ? String(max) : undefined,
    });
  };

  return (
    <Box id="problems-filters-drawer" component="aside" sx={{ px: 3, py: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{t('problems.filterTitle')}</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {hasActiveFilters ? (
            <Button size="small" variant="text" color="secondary" onClick={handleClearFilters}>
              {t('problems.clear')}
            </Button>
          ) : null}
          <Button shape="circle" color="neutral" onClick={handleClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
      </Stack>

      <Stack direction="column" gap={1}>
        <StyledTextField
          select
          label={t('problems.language')}
          value={filter.lang ?? ''}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) =>
            onChange('lang', event.target.value === '' ? undefined : event.target.value)
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
        </StyledTextField>

        <StyledTextField
          select
          label={t('problems.category')}
          value={filter.category ?? ''}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) =>
            onChange('category', event.target.value === '' ? undefined : event.target.value)
          }
        >
          <MenuItem value="">{t('problems.allCategories')}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={String(category.id)}>
              <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <Typography variant="body2">{category.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                  {category.problemsCount ?? 0}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledTextField
          label={t('problems.tags')}
          value={tagSummary}
          fullWidth
          onClick={handleTagsToggle}
          onKeyDown={handleTagsKeyDown}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon
                    icon={tagsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                    color={theme.palette.text.secondary}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            [`& .${formLabelClasses.root}`]: { color: 'text.primary' },
            '& .MuiInputBase-root': { cursor: 'pointer' },
            '& .MuiInputBase-input': {
              cursor: 'pointer',
              textOverflow: 'ellipsis',
            },
          }}
        />

        <StyledTextField
          select
          label={t('problems.difficultyLabel')}
          value={filter.difficulty ?? ''}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) =>
            onChange('difficulty', event.target.value === '' ? undefined : event.target.value)
          }
        >
          <MenuItem value="">{t('problems.allDifficulties')}</MenuItem>
          {difficultyOptions.map((item) => (
            <MenuItem key={item.value} value={String(item.value)}>
              {t(item.label)}
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledTextField
          select
          label={t('problems.status')}
          value={filter.status != null ? String(filter.status) : ''}
          fullWidth
          sx={{ [`& .${formLabelClasses.root}`]: { color: 'text.primary' } }}
          onChange={(event) => {
            const value = event.target.value;
            onChange('status', value === '' ? undefined : Number(value));
          }}
        >
          <MenuItem value="">{t('problems.allStatuses')}</MenuItem>
          {problemStatusOptions.map((option) => (
            <MenuItem key={option.value} value={String(option.value)}>
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
        </StyledTextField>

        <FilterRangeField
          label={t('problems.problemRating')}
          range={[problemRatingRange.min, problemRatingRange.max]}
          step={problemRatingRange.step}
          value={ratingRangeValue}
          onChange={handleRatingRangeChange}
          valueText={(value) => String(value)}
        />

        <FilterFieldset
          label={t('problems.filterTitle')}
          options={[
            {
              label: t('problems.favoritesOnly'),
              checked: Boolean(filter.favorites),
              onChange: (checked) => onChange('favorites', checked),
            },
            {
              label: t('problems.withSolution'),
              checked: filter.has_solution === 'true',
              onChange: (checked) => onChange('has_solution', checked ? 'true' : undefined),
            },
            {
              label: t('problems.withChecker'),
              checked: filter.has_checker === 'true',
              onChange: (checked) => onChange('has_checker', checked ? 'true' : undefined),
            },
            {
              label: t('problems.withoutPartialScoring'),
              checked: filter.partial_solvable === 'false',
              onChange: (checked) =>
                onChange('partial_solvable', checked ? 'false' : undefined),
            },
          ]}
        />

      </Stack>

      <Menu
        id="problems-tags-menu"
        anchorEl={tagsAnchor}
        open={tagsOpen}
        onClose={handleTagsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 280, sm: 420 },
            maxHeight: 520,
            p: 1,
            overflow: 'hidden',
          },
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, pt: 0.5 }}
          >
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.tags')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {filter.tags && filter.tags.length > 0
                  ? t('problems.appliedFilters', { count: filter.tags.length })
                  : `${groupedTags.length} categories, ${tags.length} tags`}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {(filter.tags?.length ?? 0) > 0 ? (
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={() => onChange('tags', [])}
                >
                  {t('problems.clearFilters')}
                </Button>
              ) : null}
              <Button size="small" variant="text" color="secondary" onClick={handleTagsClose}>
                OK
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ maxHeight: 430, overflowY: 'auto', pr: 0.25 }}>
            <Stack spacing={1}>
              {groupedTags.map((category) => {
                const selectedCount = category.tags.filter((tag) =>
                  (filter.tags ?? []).includes(tag.id),
                ).length;
                const categoryId = String(category.id);
                const isExpanded = expandedTagCategories.includes(categoryId);

                return (
                  <Accordion
                    key={category.id}
                    expanded={isExpanded}
                    onChange={handleTagCategoryToggle(categoryId)}
                    sx={{
                      border: '1px solid',
                      borderColor: category.isFocused
                        ? alpha(theme.palette.primary.main, 0.4)
                        : 'divider',
                      bgcolor: category.isFocused
                        ? alpha(theme.palette.primary.main, 0.04)
                        : alpha(theme.palette.background.default, 0.18),
                    }}
                  >
                    <AccordionSummary>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {category.title}
                        </Typography>

                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Chip
                            size="small"
                            variant="outlined"
                            label={category.tags.length}
                            sx={{ minWidth: 40 }}
                          />
                          {selectedCount > 0 ? (
                            <Chip size="small" color="primary" label={selectedCount} />
                          ) : null}
                        </Stack>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {category.tags.map((tag) => {
                          const isActive = (filter.tags ?? []).includes(tag.id);

                          return (
                            <Chip
                              key={tag.id}
                              size="small"
                              clickable
                              onClick={() => handleTagToggle(tag.id)}
                              label={tag.name}
                              color={isActive ? 'primary' : 'default'}
                              variant={isActive ? 'filled' : 'outlined'}
                              sx={
                                isActive
                                  ? {
                                      fontWeight: 600,
                                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`,
                                    }
                                  : {
                                      bgcolor: alpha(theme.palette.background.paper, 0.82),
                                      borderColor: alpha(theme.palette.text.primary, 0.12),
                                      '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.32),
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                      },
                                    }
                              }
                            />
                          );
                        })}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Menu>
    </Box>
  );
};

interface FilterFieldsetProps {
  label: string;
  options: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }[];
}

const FilterFieldset = ({ label, options }: FilterFieldsetProps) => {
  return (
    <FormControl component="fieldset" variant="standard" sx={{ px: 2 }}>
      <StyledFormLabel>{label}</StyledFormLabel>
      <FormGroup sx={{ pl: 2 }}>
        {options.map((option) => (
          <StyledFormControlLabel
            key={option.label}
            control={
              <Checkbox
                checked={option.checked}
                onChange={(event) => option.onChange(event.target.checked)}
                name={option.label}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

interface FilterRangeFieldProps {
  label: string;
  range: [number, number];
  step: number;
  value: [number, number];
  onChange: (event: Event, value: number | number[]) => void;
  valueText: (value: number) => string;
}

const FilterRangeField = ({
  label,
  range,
  step,
  value,
  onChange,
  valueText,
}: FilterRangeFieldProps) => {
  return (
    <FormControl component="fieldset" variant="standard" sx={{ px: 2 }}>
      <StyledFormLabel>{label}</StyledFormLabel>
      <FormGroup>
        <Slider
          value={value}
          min={range[0]}
          max={range[1]}
          step={step}
          onChange={onChange}
          valueLabelDisplay="auto"
          valueLabelFormat={valueText}
          getAriaValueText={valueText}
          sx={{ mx: 0 }}
        />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {valueText(range[0])}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {valueText(range[1])}
          </Typography>
        </Stack>
      </FormGroup>
    </FormControl>
  );
};

const StyledFormLabel = styled(FormLabel)(({ theme: { typography, vars, spacing } }) => ({
  fontSize: typography.caption.fontSize,
  fontWeight: 500,
  lineHeight: '14px',
  color: vars.palette.text.primary,
  paddingTop: spacing(1),
  paddingBottom: spacing(1),
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme: { typography, spacing } }) => ({
  [`& .${formControlLabelClasses.label}`]: {
    fontSize: typography.caption.fontSize,
    alignSelf: 'center',
    marginTop: '0 !important',
  },
  [`& .${checkboxClasses.root}`]: { padding: spacing(0.875), alignSelf: 'center' },
}));

export default ProblemsFilterDrawer;
