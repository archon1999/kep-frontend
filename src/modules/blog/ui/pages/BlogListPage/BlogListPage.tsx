import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Skeleton, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { PAGE_SIZE, useBlogListPage } from 'modules/blog/application/hooks/useBlogListPage';
import BlogCard from 'modules/blog/ui/shared/components/BlogCard';
import BlogFilters from 'modules/blog/ui/shared/components/BlogFilters';
import KepIcon from 'shared/components/base/KepIcon';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { RouteListPagination } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';

const BlogListPage = () => {
  const {
    state,
    setField,
    isLoading,
    error,
    mutate,
    authors,
    topics,
    filters,
    posts,
    total,
    handleFilterChange,
    handleResetFilters,
    hasActiveFilters,
    featuredPost,
    remainingPosts,
  } = useBlogListPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={t('blog.title')}
        subtitle={t('blog.subtitle')}
        actionComponent={
          <Stack direction="row" alignItems="center" gap={2}>
            <PatternArtwork kind="blog" sx={{ width: 150, display: { xs: 'none', md: 'block' } }} />
            <Button
              component={RouterLink}
              to={resources.BlogCreate}
              variant="contained"
              startIcon={<KepIcon name="blog" fontSize={18} />}
            >
              {t('blog.profile.create')}
            </Button>
          </Stack>
        }
      />
      <BlogFilters
        filters={filters}
        authors={authors}
        topics={topics}
        onChange={handleFilterChange}
        hasActiveFilters={hasActiveFilters}
        onReset={handleResetFilters}
        totalPosts={total}
      />
      {error ? (
        <EmptyState
          kind="error"
          title={t('blog.loadError')}
          action={
            <Button variant="outlined" onClick={() => void mutate()}>
              {t('common.retry')}
            </Button>
          }
        />
      ) : isLoading ? (
        <Box
          sx={{
            ...contentGridSx,
            bgcolor: 'background.default',
            gap: 0,
            borderBottom: 0,
            '& > *': { minWidth: 0, borderRight: 1, borderBottom: 1, borderColor: 'divider' },
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2,minmax(0,1fr))',
              lg: 'repeat(3,minmax(0,1fr))',
            },
          }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Box key={index} sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={190} />
              <Skeleton sx={{ mt: 2 }} />
              <Skeleton width="70%" />
            </Box>
          ))}
        </Box>
      ) : posts.length ? (
        <>
          {featuredPost && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <BlogCard post={featuredPost} featured />
            </Box>
          )}
          <Box
            sx={{
              ...contentGridSx,
              bgcolor: 'background.default',
              gap: 0,
              borderBottom: 0,
              '& > *': { minWidth: 0, borderRight: 1, borderBottom: 1, borderColor: 'divider' },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2,minmax(0,1fr))',
                lg: 'repeat(3,minmax(0,1fr))',
              },
            }}
          >
            {remainingPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </Box>
        </>
      ) : (
        <EmptyState
          kind="blog"
          title={t('blog.empty.title')}
          description={t('blog.empty.subtitle')}
          action={
            hasActiveFilters ? (
              <Button variant="outlined" onClick={handleResetFilters}>
                {t('blog.clearFilters')}
              </Button>
            ) : (
              <Button component={RouterLink} to={resources.BlogCreate} variant="contained">
                {t('blog.profile.create')}
              </Button>
            )
          }
        />
      )}
      <RouteListPagination
        page={state.page}
        count={Math.ceil(total / PAGE_SIZE)}
        onChange={(page) => setField('page', page)}
        disabled={isLoading}
      />
    </FramedPage>
  );
};
export default BlogListPage;
