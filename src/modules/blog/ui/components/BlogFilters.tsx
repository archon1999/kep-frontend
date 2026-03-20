import { ChangeEvent, MouseEvent, SyntheticEvent, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { TabContext, TabList } from '@mui/lab';
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterButton from 'shared/components/common/FilterButton';
import KepIcon from 'shared/components/base/KepIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { BlogTopic } from '../../domain/entities/blog.entity';

export interface BlogFilterState {
  title: string;
  author: string;
  orderBy: string;
  topic: string;
}

interface BlogFiltersProps {
  filters: BlogFilterState;
  authors: string[];
  topics: BlogTopic[];
  onChange: (filters: BlogFilterState) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  totalPosts?: number;
  createHref?: string;
  createLabel?: string;
}

const BlogFilters = ({
  filters,
  authors,
  topics,
  onChange,
  hasActiveFilters = false,
  onReset,
  totalPosts,
  createHref,
  createLabel,
}: BlogFiltersProps) => {
  const { t } = useTranslation();
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const filtersOpen = Boolean(filtersAnchorEl);

  const advancedFiltersCount = useMemo(
    () => [filters.author, filters.orderBy].filter(Boolean).length,
    [filters.author, filters.orderBy],
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filters, title: event.target.value });

  const handleTopicChange = (_: SyntheticEvent, topic: string) =>
    onChange({ ...filters, topic });

  const handleFiltersToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (filtersOpen) {
      setFiltersAnchorEl(null);
    } else {
      setFiltersAnchorEl(event.currentTarget);
    }
  };

  const handleFiltersClose = () => setFiltersAnchorEl(null);

  const handleSelectChange =
    (field: 'author' | 'orderBy') => (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...filters, [field]: event.target.value ?? '' });

  return (
    <TabContext value={filters.topic}>
      <Stack spacing={1.5}>
        <Stack
          sx={{
            gap: 2,
            alignItems: { lg: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          <Box sx={{ minWidth: 0, width: { xs: 1, lg: 'auto' } }}>
            <TabList
              onChange={handleTopicChange}
              aria-label="blog topics"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                minHeight: 0,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  minHeight: 0,
                  minWidth: 'fit-content',
                  mr: 1,
                  px: 2,
                  py: 1.25,
                  borderRadius: 999,
                  textTransform: 'none',
                  border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                  backgroundColor: 'background.paper',
                  fontWeight: 700,
                  color: 'text.primary',
                },
                '& .Mui-selected': {
                  color: 'primary.main !important',
                  borderColor: 'primary.main',
                  backgroundColor: (theme) => theme.vars.palette.primary.softBg,
                },
              }}
            >
              <Tab
                key="all"
                value=""
                label={t('blog.topics.all', { defaultValue: 'All' })}
                sx={{ whiteSpace: 'nowrap' }}
              />
              {topics.map((topic) => (
                <Tab
                  key={topic.id}
                  value={String(topic.id)}
                  label={topic.title}
                  sx={{ whiteSpace: 'nowrap' }}
                />
              ))}
            </TabList>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: 1, lg: 'auto' } }}
          >
            <FilterButton
              id="blog-filters-button"
              onClick={handleFiltersToggle}
              aria-haspopup="true"
              aria-expanded={filtersOpen ? 'true' : undefined}
              aria-controls={filtersOpen ? 'blog-filters-menu' : undefined}
              label={t('blog.filtersTitle')}
              badgeContent={advancedFiltersCount}
            />

            <StyledTextField
              type="search"
              fullWidth
              value={filters.title}
              onChange={handleSearchChange}
              placeholder={t('common.searchPlaceholder')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KepIcon name="search" fontSize={18} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                maxWidth: { sm: 240, md: 280 },
                flexGrow: { xs: 1, sm: 0 },
              }}
            />

            {createHref && createLabel ? (
              <Button
                component={RouterLink}
                to={createHref}
                variant="contained"
                startIcon={<KepIcon name="upload" fontSize={18} />}
              >
                {createLabel}
              </Button>
            ) : null}
          </Stack>
        </Stack>

        {typeof totalPosts === 'number' ? (
          <Typography variant="body2" color="text.secondary">
            {t('blog.resultsCount', { count: totalPosts })}
          </Typography>
        ) : null}

        <Menu
          id="blog-filters-menu"
          anchorEl={filtersAnchorEl}
          open={filtersOpen}
          onClose={handleFiltersClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          MenuListProps={{ disablePadding: true }}
          PaperProps={{
            sx: {
              p: 2,
              width: 320,
            },
          }}
        >
          <Stack direction="column" spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                {t('blog.filtersTitle')}
              </Typography>
              {hasActiveFilters && onReset ? (
                <Button size="small" color="secondary" onClick={onReset}>
                  {t('blog.clearFilters')}
                </Button>
              ) : null}
            </Stack>

            <TextField
              select
              variant="filled"
              fullWidth
              label={t('blog.author')}
              value={filters.author}
              onChange={handleSelectChange('author')}
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <Typography variant="body2" color="text.secondary">
                  {t('blog.authorPlaceholder')}
                </Typography>
              </MenuItem>
              {authors.map((author) => (
                <MenuItem key={author} value={author}>
                  {author}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              variant="filled"
              fullWidth
              label={t('blog.orderBy')}
              value={filters.orderBy}
              onChange={handleSelectChange('orderBy')}
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <Typography variant="body2" color="text.secondary">
                  {t('blog.orderByPlaceholder')}
                </Typography>
              </MenuItem>
              <MenuItem value="1">{t('blog.order.likes')}</MenuItem>
              <MenuItem value="2">{t('blog.order.views')}</MenuItem>
              <MenuItem value="3">{t('blog.order.comments')}</MenuItem>
            </TextField>
          </Stack>
        </Menu>
      </Stack>
    </TabContext>
  );
};

export default BlogFilters;
