import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources.ts';
import { mapBlogPost } from 'modules/blog/data-access/mappers/blog.mapper.ts';
import BlogCard from 'modules/blog/ui/components/BlogCard';
import { BlogDetail } from 'shared/api/orval/generated/endpoints/index.schemas.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';
import { useHomePosts } from '../../application/queries';

const PostsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomePosts();

  const posts = useMemo(
    () =>
      data?.data?.map((item) =>
        mapBlogPost({
          ...(item as BlogDetail),
          body: item.bodyShort ?? '',
        }),
      ) ?? [],
    [data],
  );
  const previewPosts = posts.slice(0, 2);

  return (
    <Paper sx={{ height: '100%' }}>
      <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('homePage.posts.title')}
          </Typography>

          <Button component={RouterLink} to={resources.Blog} variant="outlined">
            {t('homePage.posts.viewAll')}
          </Button>
        </Stack>

        {isLoading ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: 1, overflow: 'hidden' }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={360}
                sx={{ flex: 1, minWidth: 240, borderRadius: 5 }}
              />
            ))}
          </Stack>
        ) : previewPosts.length ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {previewPosts.map((post) => (
              <Box key={post.id} sx={{ minWidth: 0 }}>
                <BlogCard post={post} variant="home" />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.posts.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default PostsSection;
