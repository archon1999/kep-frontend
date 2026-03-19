import { ChangeEvent, useMemo } from 'react';
import {
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';

export interface BlogFilterState {
  title: string;
  author: string;
  orderBy: string;
  topic: string;
}

interface BlogFiltersProps {
  filters: BlogFilterState;
  authors: string[];
  onChange: (filters: BlogFilterState) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  totalPosts?: number;
}

const topics = [
  { key: '1', labelKey: 'blog.topics.technology', icon: 'learn' as const },
  { key: '2', labelKey: 'blog.topics.competitiveProgramming', icon: 'challenge' as const },
  { key: '3', labelKey: 'blog.topics.info', icon: 'info' as const },
];

const BlogFilters = ({
  filters,
  authors,
  onChange,
  hasActiveFilters = false,
  onReset,
  totalPosts,
}: BlogFiltersProps) => {
  const { t } = useTranslation();

  const selectedTopic = useMemo(() => filters.topic, [filters.topic]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filters, title: event.target.value });

  const handleAuthorChange = (event: SelectChangeEvent<string>) =>
    onChange({ ...filters, author: event.target.value ?? '' });

  const handleOrderChange = (event: SelectChangeEvent<string>) =>
    onChange({ ...filters, orderBy: event.target.value ?? '' });

  const handleTopicChange = (topicKey: string) =>
    onChange({ ...filters, topic: selectedTopic === topicKey ? '' : topicKey });

  const renderSelectValue = (value: string, placeholder: string) =>
    value ? <>{value}</> : <Typography color="text.secondary">{placeholder}</Typography>;

  return (
    <Stack
      spacing={2}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', lg: 'center' }}
        justifyContent="space-between"
      >
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={800}>
            {t('blog.filtersTitle')}
          </Typography>
          {typeof totalPosts === 'number' ? (
            <Typography variant="body2" color="text.secondary">
              {t('blog.resultsCount', { count: totalPosts })}
            </Typography>
          ) : null}
        </Stack>

        {hasActiveFilters && onReset ? (
          <Button variant="text" size="small" onClick={onReset}>
            {t('blog.clearFilters')}
          </Button>
        ) : null}
      </Stack>

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        useFlexGap
        flexWrap="wrap"
      >
        <TextField
          value={filters.title}
          onChange={handleSearchChange}
          placeholder={t('blog.searchPlaceholder')}
          fullWidth
          sx={{ flex: { lg: '1 1 360px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KepIcon name="search" fontSize={18} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth sx={{ flex: { lg: '0 1 220px' } }}>
          <InputLabel shrink>{t('blog.author')}</InputLabel>
          <Select
            label={t('blog.author')}
            value={filters.author}
            onChange={handleAuthorChange}
            displayEmpty
            renderValue={(value) => renderSelectValue(value, t('blog.authorPlaceholder'))}
          >
            <MenuItem value="">{t('blog.authorPlaceholder')}</MenuItem>
            {authors.map((author) => (
              <MenuItem key={author} value={author}>
                {author}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ flex: { lg: '0 1 220px' } }}>
          <InputLabel shrink>{t('blog.orderBy')}</InputLabel>
          <Select
            label={t('blog.orderBy')}
            value={filters.orderBy}
            onChange={handleOrderChange}
            displayEmpty
            renderValue={(value) => renderSelectValue(value, t('blog.orderByPlaceholder'))}
          >
            <MenuItem value="">{t('blog.orderByPlaceholder')}</MenuItem>
            <MenuItem value="1">{t('blog.order.likes')}</MenuItem>
            <MenuItem value="2">{t('blog.order.views')}</MenuItem>
            <MenuItem value="3">{t('blog.order.comments')}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {topics.map((topic) => {
          const active = selectedTopic === topic.key;

          return (
            <Chip
              key={topic.key}
              clickable
              icon={<KepIcon name={topic.icon} fontSize={18} />}
              label={t(topic.labelKey)}
              onClick={() => handleTopicChange(topic.key)}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              sx={{ px: 0.5, height: 36, borderRadius: 999 }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default BlogFilters;
