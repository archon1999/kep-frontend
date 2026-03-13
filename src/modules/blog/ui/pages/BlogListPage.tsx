import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useBlogAuthors, useBlogPosts } from '../../application/queries';
import BlogCard from '../components/BlogCard';
import BlogFilters, { BlogFilterState } from '../components/BlogFilters';

const PAGE_SIZE = 4;

const initialFilters: BlogFilterState = {
  title: '',
  author: '',
  orderBy: '',
  topic: '',
};

const BlogListPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<BlogFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const debouncedTitle = useDebouncedValue(filters.title);

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      title: debouncedTitle || undefined,
      author: filters.author || undefined,
      order_by: filters.orderBy || undefined,
      topic: filters.topic || undefined,
    }),
    [page, debouncedTitle, filters.author, filters.orderBy, filters.topic],
  );

  const { data: postsPage, isLoading } = useBlogPosts(listParams);
  const { data: authors = [] } = useBlogAuthors();

  const posts = postsPage?.data ?? [];
  const total = postsPage?.total ?? posts.length;

  useEffect(() => {
    setPage(1);
  }, [debouncedTitle, filters.author, filters.orderBy, filters.topic]);

  const handleFilterChange = (next: BlogFilterState) => setFilters(next);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          rowGap={1.5}
        >
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {t('blog.title')}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2.5}>
              {isLoading
                ? Array.from({ length: 4 }).map((_) => (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Skeleton variant="rounded" height={360} />
                    </Grid>
                  ))
                : posts.map((post) => (
                    <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                      <BlogCard post={post} />
                    </Grid>
                  ))}
            </Grid>

            <Stack direction="row" alignItems="center" sx={{ mt: 3 }}>
              {total > PAGE_SIZE ? (
                <Pagination
                  color="primary"
                  count={Math.ceil(total / PAGE_SIZE)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  size="large"
                />
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <BlogFilters filters={filters} authors={authors} onChange={handleFilterChange} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default BlogListPage;
