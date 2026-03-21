import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Button,
  Chip,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import {
  blogKeys,
  useBlogPosts,
  useBlogSubmitForReview,
  useMyBlogPosts,
} from 'modules/blog/application/queries';
import { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import BlogCard from 'modules/blog/ui/components/BlogCard';
import BlogStatusChip from 'modules/blog/ui/components/BlogStatusChip';
import { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import KepIcon from 'shared/components/base/KepIcon';
import { stripBlogHtml } from 'modules/blog/ui/lib/article-content';

const PAGE_SIZE = 6;

const BlogManagementCard = ({
  post,
  onSubmit,
  isSubmitting,
}: {
  post: BlogPost;
  onSubmit: (id: number) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation();
  const previewText = stripBlogHtml(post.bodyShort ?? post.body).slice(0, 180);
  const metaDateValue = post.updatedAt ?? post.created ?? '';
  const metaDate = metaDateValue ? dayjs(metaDateValue).format('DD MMM, YYYY') : '-';

  return (
    <Paper background={1} sx={{ p: 1, borderRadius: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box
          sx={{
            width: { xs: 1, md: 280 },
            aspectRatio: '16 / 10',
            borderRadius: 3,
            overflow: 'hidden',
            flexShrink: 0,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {post.image ? (
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{ width: 1, height: 1, objectFit: 'cover' }}
            />
          ) : (
            <KepIcon name="blog" fontSize={42} color="rgba(15,23,42,0.28)" />
          )}
        </Box>

        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, py: 1, pr: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <BlogStatusChip status={post.status} />
              {post.rewardValue ? (
                <Chip
                  color="warning"
                  label={t('blog.profile.reward', { value: post.rewardValue })}
                  size="small"
                />
              ) : null}
            </Stack>

            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              {metaDate}
            </Typography>
          </Stack>

          <Stack spacing={0.75} flex={1}>
            <Typography variant="h6" fontWeight={800} sx={{ lineClamp: 2 }}>
              {post.title}
            </Typography>
            {previewText ? (
              <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3 }}>
                {previewText}
              </Typography>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="view" fontSize={16} color="rgba(15,23,42,0.58)" />
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {post.views}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="comment" fontSize={16} color="rgba(15,23,42,0.58)" />
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {post.commentsCount}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="like" fontSize={16} color="rgba(15,23,42,0.58)" />
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {post.likesCount}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                component={RouterLink}
                to={getResourceById(resources.BlogPost, post.id)}
              >
                {t('blog.profile.view')}
              </Button>
              {post.canEdit ? (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={getResourceById(resources.BlogEdit, post.id)}
                >
                  {t('blog.profile.edit')}
                </Button>
              ) : null}
              {post.canSubmit ? (
                <Button
                  variant="text"
                  color="warning"
                  onClick={() => onSubmit(post.id)}
                  disabled={isSubmitting}
                >
                  {t('blog.profile.submitForReview')}
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const UserProfileBlogTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { currentUser } = useAuth();
  const isOwner = currentUser?.username === username;
  const [page, setPage] = useState(1);
  const { trigger: submitForReview, isMutating: isSubmitting } = useBlogSubmitForReview();

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      author: username || undefined,
    }),
    [page, username],
  );

  const { data: publicPosts, isLoading: isPublicLoading } = useBlogPosts(isOwner ? null : listParams);
  const { data: myPosts, isLoading: isOwnerLoading } = useMyBlogPosts(
    isOwner
      ? {
          page,
          pageSize: PAGE_SIZE,
        }
      : null,
  );

  const postsPage = isOwner ? myPosts : publicPosts;
  const posts = postsPage?.data ?? [];
  const total = postsPage?.total ?? posts.length;
  const isLoading = isOwner ? isOwnerLoading : isPublicLoading;

  useEffect(() => {
    setPage(1);
  }, [username, isOwner]);

  const handleSubmit = async (postId: number) => {
    try {
      await submitForReview(postId);
      await globalMutate((key) => Array.isArray(key) && key[0] === blogKeys.all[0]);
      toast.success(t('blog.messages.submittedForReview'));
    } catch {
      toast.error(t('blog.messages.submitFailed'));
    }
  };

  return (
    <Stack spacing={2.5}>
      {isOwner ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            Bloglar{' '}
            <Box component="sup" sx={{ fontSize: '0.5em', fontWeight: 500, color: 'text.secondary' }}>
              ({total})
            </Box>
          </Typography>

          <Button
            component={RouterLink}
            to={resources.BlogCreate}
            variant="contained"
            startIcon={<KepIcon name="upload" fontSize={18} />}
          >
            {t('blog.profile.create')}
          </Button>
        </Stack>
      ) : (
        <Paper background={1} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.75} sx={{ maxWidth: 720 }}>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                {t('blog.profile.publicEyebrow')}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                {t('blog.profile.publicTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('blog.profile.publicSubtitle')}
              </Typography>
            </Stack>

            <Chip label={t('blog.resultsCount', { count: total })} variant="outlined" />
          </Stack>
        </Paper>
      )}

      {isLoading ? (
        isOwner ? (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`blog-owner-skeleton-${index}`}
                variant="rounded"
                height={260}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                xl: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`blog-public-skeleton-${index}`}
                variant="rounded"
                height={300}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </Box>
        )
      ) : posts.length ? (
        isOwner ? (
          <Stack spacing={2}>
            {posts.map((post) => (
              <BlogManagementCard
                key={post.id}
                post={post}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                xl: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {posts.map((post) => (
              <Box key={post.id} sx={{ minWidth: 0 }}>
                <BlogCard post={post} />
              </Box>
            ))}
          </Box>
        )
      ) : (
        <Alert severity="info">
          {isOwner ? t('blog.profile.emptyOwner') : t('blog.profile.emptyPublic')}
        </Alert>
      )}

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
  );
};

export default UserProfileBlogTab;
