import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Chip, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
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
  const { currentUser } = useAuth();
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
  const [featuredPost, ...restPosts] = posts;

  useEffect(() => {
    setPage(1);
  }, [debouncedTitle, filters.author, filters.orderBy, filters.topic]);

  const handleFilterChange = (next: BlogFilterState) => setFilters(next);
  const handleResetFilters = () => setFilters(initialFilters);
  const hasActiveFilters = Boolean(filters.title || filters.author || filters.orderBy || filters.topic);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ xs: 'flex-start', xl: 'flex-end' }}
          justifyContent="space-between"
        >
          <Stack spacing={1.25} sx={{ maxWidth: 820 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>
              {t('blog.heroEyebrow')}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
              {t('blog.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
              {t('blog.subtitle')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={t('blog.heroHighlights.reward')} variant="outlined" />
              <Chip label={t('blog.heroHighlights.community')} variant="outlined" />
            </Stack>
          </Stack>

          <Stack spacing={1.25} sx={{ width: { xs: 1, xl: 'auto' }, maxWidth: 320 }}>
            <Typography variant="body2" color="text.secondary">
              {t(currentUser ? 'blog.heroCtaTitleAuth' : 'blog.heroCtaTitleGuest')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('blog.heroCtaSubtitle')}
            </Typography>
            <Button
              component={RouterLink}
              to={resources.BlogCreate}
              variant="contained"
              startIcon={<KepIcon name="upload" fontSize={18} />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('blog.profile.create')}
            </Button>
          </Stack>
        </Stack>

        <BlogFilters
          filters={filters}
          authors={authors}
          onChange={handleFilterChange}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          totalPosts={total}
        />

        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={`blog-list-skeleton-${index}`}
                  variant="rounded"
                  height={320}
                  sx={{ borderRadius: 4 }}
                />
              ))}
            </Box>
          </Stack>
        ) : posts.length ? (
          <Stack spacing={2}>
            {featuredPost ? <BlogCard post={featuredPost} featured /> : null}

            {restPosts.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, minmax(0, 1fr))',
                    xl: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                {restPosts.map((post) => (
                  <Box key={post.id} sx={{ minWidth: 0 }}>
                    <BlogCard post={post} />
                  </Box>
                ))}
              </Box>
            ) : null}
          </Stack>
        ) : (
          <Stack
            spacing={1.25}
            alignItems="center"
            sx={{
              py: { xs: 5, md: 7 },
              px: { xs: 2, md: 4 },
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
              page={page}
              onChange={(_, value) => setPage(value)}
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
