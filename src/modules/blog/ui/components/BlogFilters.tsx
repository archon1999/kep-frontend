import { ChangeEvent, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
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
}

const topics = [
  { key: '1', labelKey: 'blog.topics.technology', icon: 'learn' as const },
  { key: '2', labelKey: 'blog.topics.competitiveProgramming', icon: 'challenge' as const },
  { key: '3', labelKey: 'blog.topics.info', icon: 'info' as const },
];

const BlogFilters = ({ filters, authors, onChange }: BlogFiltersProps) => {
  const { t } = useTranslation();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filters, title: event.target.value });

  const handleAuthorChange = (event: SelectChangeEvent<string>) => onChange({ ...filters, author: event.target.value ?? '' });
  const handleOrderChange = (event: SelectChangeEvent<string>) => onChange({ ...filters, orderBy: event.target.value ?? '' });
  const handleTopicChange = (topicKey: string) =>
    onChange({ ...filters, topic: selectedTopic === topicKey ? '' : topicKey });

  const selectedTopic = useMemo(() => filters.topic, [filters.topic]);
  const renderSelectValue = (value: string, placeholder: string) =>
    value ? <>{value}</> : <Typography color="text.secondary">{placeholder}</Typography>;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <KepIcon name="blog" fontSize={24} />
          <Typography variant="h6" fontWeight={800}>
            {t('blog.filtersTitle')}
          </Typography>
        </Stack>

        <TextField
          value={filters.title}
          onChange={handleSearchChange}
          placeholder={t('blog.searchPlaceholder')}
          fullWidth
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', pr: 1, color: 'text.secondary' }}>
                <KepIcon name="search" fontSize={18} />
              </Box>
            ),
          }}
        />

        <FormControl fullWidth>
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

        <FormControl fullWidth>
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.25}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            {t('blog.topics.title')}
          </Typography>
          <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
            {topics.map((topic) => {
              const active = selectedTopic === topic.key;

              return (
                <Box
                  key={topic.key}
                  role="button"
                  onClick={() => handleTopicChange(topic.key)}
                  sx={{
                    p: 1.25,
                    minWidth: { xs: '100%', sm: 220 },
                    flex: { xs: '1 1 100%', sm: '1 1 220px' },
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: active ? 'primary.main' : 'divider',
                    bgcolor: active ? 'primary.main' : 'background.default',
                    color: active ? 'primary.contrastText' : 'text.primary',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <KepIcon name={topic.icon} fontSize={22} />
                  <Typography fontWeight={700}>{t(topic.labelKey)}</Typography>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogFilters;
