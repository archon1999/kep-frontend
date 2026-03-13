import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import KepIcon from 'shared/components/base/KepIcon';
import {
  blogKeys,
  useBlogPosts,
  useBlogSubmitForReview,
  useMyBlogPosts,
} from 'modules/blog/application/queries';
import { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import BlogCard from 'modules/blog/ui/components/BlogCard';
import BlogStatusChip from 'modules/blog/ui/components/BlogStatusChip';

const PAGE_SIZE = 6;

const stripHtml = (html?: string) =>
  (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
  const previewText = stripHtml(post.bodyShort ?? post.body).slice(0, 180);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      {post.image ? (
        <Box
          component="img"
          src={post.image}
          alt={post.title}
          sx={{ width: '100%', height: 220, objectFit: 'cover' }}
        />
      ) : null}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={post.author.avatar ?? undefined} alt={post.author.username} />
          <Stack direction="column" spacing={0.25} flex={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              {post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.updatedAt ?? post.created ?? '—'}
            </Typography>
          </Stack>
          <BlogStatusChip status={post.status} />
        </Stack>

        <Stack direction="column" spacing={1} flex={1}>
          <Typography variant="h6" fontWeight={800}>
            {post.title}
          </Typography>

          {previewText ? (
            <Typography variant="body2" color="text.secondary">
              {previewText}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
            ))}
            {post.rewardValue ? (
              <Chip
                color="warning"
                label={t('blog.profile.reward', { value: post.rewardValue })}
                size="small"
                sx={{ borderRadius: 2 }}
              />
            ) : null}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            component={RouterLink}
            to={getResourceById(resources.BlogPost, post.id)}
            startIcon={<KepIcon name="view" fontSize={18} />}
          >
            {t('blog.profile.view')}
          </Button>
          {post.canEdit ? (
            <Button
              variant="contained"
              component={RouterLink}
              to={getResourceById(resources.BlogEdit, post.id)}
              startIcon={<KepIcon name="info" fontSize={18} />}
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
      </CardContent>
    </Card>
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
    await submitForReview(postId);
    await globalMutate((key) => Array.isArray(key) && key[0] === blogKeys.all[0]);
    toast.success(t('blog.messages.submittedForReview'));
  };

  return (
    <Stack direction="column" spacing={2.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="column" spacing={0.5}>
          <Typography variant="h6" fontWeight={800}>
            {isOwner ? t('blog.profile.ownerTitle') : t('blog.profile.publicTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isOwner ? t('blog.profile.ownerSubtitle') : t('blog.profile.publicSubtitle')}
          </Typography>
        </Stack>

        {isOwner ? (
          <Button
            component={RouterLink}
            to={resources.BlogCreate}
            variant="contained"
            startIcon={<KepIcon name="upload" fontSize={18} />}
          >
            {t('blog.profile.create')}
          </Button>
        ) : null}
      </Stack>

      {isOwner ? (
        <Alert severity="info">{t('blog.profile.reviewFlowHint')}</Alert>
      ) : null}

      <Grid container spacing={2.5}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Grid key={`blog-profile-skeleton-${index}`} size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rounded" height={320} />
              </Grid>
            ))
          : posts.length
            ? posts.map((post) => (
                <Grid key={post.id} size={{ xs: 12, md: isOwner ? 6 : 4 }}>
                  {isOwner ? (
                    <BlogManagementCard
                      post={post}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <BlogCard post={post} />
                  )}
                </Grid>
              ))
            : (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info">
                    {isOwner ? t('blog.profile.emptyOwner') : t('blog.profile.emptyPublic')}
                  </Alert>
                </Grid>
              )}
      </Grid>

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
