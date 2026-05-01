import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useBlogAuthors, useBlogPosts, useBlogTopics } from '../../application/queries';
import BlogCard from '../components/BlogCard';
import BlogFilters, { BlogFilterState } from '../components/BlogFilters';

const PAGE_SIZE = 10;

const initialFilters: BlogFilterState = {
  title: '',
  author: '',
  orderBy: '',
  topic: '',
};

const editorialCardLayouts = [
  {
    emphasis: 'featured' as const,
    sx: {
      gridColumn: { lg: 'span 2' },
      gridRow: { lg: 'span 2' },
    },
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'highlight' as const,
    sx: {
      gridColumn: { lg: 'span 2' },
    },
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'highlight' as const,
    sx: {
      gridColumn: { lg: 'span 2' },
    },
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'regular' as const,
    sx: {},
  },
  {
    emphasis: 'highlight' as const,
    sx: {
      gridColumn: { lg: 'span 2' },
    },
  },
];

const BlogListPage = () => {
  const { t } = useTranslation();
  const { state, patchState, resetState, setField } = useRouteQueryState({
    defaults: {
      ...initialFilters,
      page: 1,
    },
    schema: {
      title: {
        ...stringParam(),
        param: 'title',
      },
      author: {
        ...stringParam(),
        param: 'author',
      },
      orderBy: {
        ...stringParam(),
        param: 'orderBy',
      },
      topic: {
        ...stringParam(),
        param: 'topic',
      },
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
    },
    historyByKey: {
      page: 'push',
    },
    pageResetKeys: ['title', 'author', 'orderBy', 'topic'],
  });
  const filters = useMemo<BlogFilterState>(
    () => ({
      title: state.title,
      author: state.author,
      orderBy: state.orderBy,
      topic: state.topic,
    }),
    [state.author, state.orderBy, state.title, state.topic],
  );
  const debouncedTitle = useDebouncedValue(filters.title);

  const listParams = useMemo(
    () => ({
      page: state.page,
      pageSize: PAGE_SIZE,
      title: debouncedTitle || undefined,
      author: filters.author || undefined,
      order_by: filters.orderBy || undefined,
      topic: filters.topic || undefined,
    }),
    [debouncedTitle, filters.author, filters.orderBy, filters.topic, state.page],
  );

  const { data: postsPage, isLoading } = useBlogPosts(listParams);
  const { data: authors = [] } = useBlogAuthors();
  const { data: topics = [] } = useBlogTopics();

  const posts = postsPage?.data ?? [];
  const total = postsPage?.total ?? posts.length;

  const handleFilterChange = (next: BlogFilterState) => patchState(next);
  const handleResetFilters = () => resetState(['title', 'author', 'orderBy', 'topic', 'page']);
  const hasActiveFilters = Boolean(
    filters.title || filters.author || filters.orderBy || filters.topic,
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <BlogFilters
          filters={filters}
          authors={authors}
          topics={topics}
          onChange={handleFilterChange}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          totalPosts={total}
          createHref={resources.BlogCreate}
          createLabel={t('blog.profile.create')}
        />

        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
                xl: 'repeat(4, minmax(0, 1fr))',
              },
              gridAutoFlow: 'dense',
              gap: 2,
            }}
          >
            {editorialCardLayouts.map((layout, index) => (
              <Skeleton
                key={`blog-list-skeleton-${index}`}
                variant="rounded"
                height={layout.emphasis === 'featured' ? 576 : 280}
                sx={{
                  borderRadius: 4,
                  ...layout.sx,
                }}
              />
            ))}
          </Box>
        ) : posts.length ? (
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))',
                },
                gridAutoFlow: 'dense',
                gap: 2,
              }}
            >
              {posts.map((post, index) => {
                const layout = editorialCardLayouts[index] ?? {
                  emphasis: 'regular' as const,
                  sx: {},
                };

                return (
                  <Box key={post.id} sx={{ minWidth: 0, ...layout.sx }}>
                    <BlogCard post={post} emphasis={layout.emphasis} />
                  </Box>
                );
              })}
            </Box>
          </Stack>
        ) : (
          <Stack
            spacing={1.25}
            alignItems="center"
            sx={{
              py: { xs: 4, md: 5 },
              px: { xs: 2, md: 3 },
              textAlign: 'center',
              borderRadius: 4,
              border: (theme) => `1px dashed ${theme.vars.palette.divider}`,
            }}
          >
            <KepIcon name="blog" fontSize={36} color="rgba(15,23,42,0.35)" />
            <Typography variant="h5" fontWeight={800}>
              {t('blog.empty.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
              {t('blog.empty.subtitle')}
            </Typography>
            <Button component={RouterLink} to={resources.BlogCreate} variant="contained">
              {t('blog.profile.create')}
            </Button>
          </Stack>
        )}

        {total > PAGE_SIZE ? (
          <Stack direction="row" justifyContent="center">
            <Pagination
              color="primary"
              count={Math.ceil(total / PAGE_SIZE)}
              page={state.page}
              onChange={(_, value) => setField('page', value)}
              shape="rounded"
              size="large"
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default BlogListPage;
