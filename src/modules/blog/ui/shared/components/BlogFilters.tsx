import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { BlogFilterState } from 'modules/blog/domain/entities/blog-filter.types';
import { BlogTopic } from 'modules/blog/domain/entities/blog.entity';
import KepIcon from 'shared/components/base/KepIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import FilterButton from 'shared/components/common/FilterButton';
import FilterPopover from 'shared/components/common/FilterPopover';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

export type { BlogFilterState } from 'modules/blog/domain/entities/blog-filter.types';

interface BlogFiltersProps {
  filters: BlogFilterState;
  authors: string[];
  topics: BlogTopic[];
  onChange: (filters: BlogFilterState) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  totalPosts?: number;
}

const BlogFilters = ({
  filters,
  authors,
  topics,
  onChange,
  hasActiveFilters = false,
  onReset,
  totalPosts,
}: BlogFiltersProps) => {
  const { t } = useTranslation();
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const filtersOpen = Boolean(filtersAnchorEl);

  const advancedFiltersCount = useMemo(
    () => [filters.author, filters.orderBy].filter(Boolean).length,
    [filters.author, filters.orderBy],
  );

  const handleSearchChange = (title: string) => onChange({ ...filters, title });

  const handleTopicChange = (topic: string) => onChange({ ...filters, topic });

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
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={1.5}
        sx={{ px: 'var(--kep-content-inset)', py: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <DebouncedTextField
          type="search"
          size="small"
          variant="outlined"
          value={filters.title}
          onValueChange={handleSearchChange}
          placeholder={t('blog.searchPlaceholder')}
          slotProps={{
            htmlInput: { 'aria-label': t('blog.searchPlaceholder') },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <KepIcon name="search" fontSize={18} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
        <FilterButton
          id="blog-filters-button"
          onClick={handleFiltersToggle}
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
          aria-controls={filtersOpen ? 'blog-filters-menu' : undefined}
          label={t('blog.filtersTitle')}
          badgeContent={advancedFiltersCount}
        />
        {hasActiveFilters && (
          <Button variant="text" size="small" onClick={onReset}>
            {t('blog.clearFilters')}
          </Button>
        )}
        {typeof totalPosts === 'number' && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {t('blog.resultsCount', { count: totalPosts })}
          </Typography>
        )}
      </Stack>
      <Box sx={{ px: 'var(--kep-content-inset)', borderBottom: 1, borderColor: 'divider' }}>
        <ResponsiveTabs
          value={filters.topic}
          onChange={handleTopicChange}
          ariaLabel={t('blog.topics.title')}
          items={[
            { value: '', label: t('blog.topics.all') },
            ...topics.map((topic) => ({ value: String(topic.id), label: topic.title })),
          ]}
          tabsProps={{
            variant: 'scrollable',
            scrollButtons: 'auto',
            allowScrollButtonsMobile: true,
            sx: {
              minHeight: 52,
              '& .MuiTab-root': { minHeight: 52, px: 2, fontSize: 13, whiteSpace: 'nowrap' },
            },
          }}
        />
      </Box>
      <FilterPopover
        id="blog-filters-menu"
        title={t('blog.filtersTitle')}
        anchorEl={filtersAnchorEl}
        onClose={handleFiltersClose}
        onReset={onReset ?? (() => undefined)}
        hasActiveFilters={hasActiveFilters}
        resetLabel={t('blog.clearFilters')}
        doneLabel={t('contests.filters.done')}
        align="left"
      >
        <Stack direction="column" spacing={2}>
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
      </FilterPopover>
    </Box>
  );
};

export default BlogFilters;
