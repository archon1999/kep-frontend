import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import PageLoader from 'shared/components/loading/PageLoader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  useBlogCommentCreate,
  useBlogCommentDelete,
  useBlogCommentLike,
  useBlogComments,
  useBlogPost,
  useBlogPostLike,
} from '../../application/queries';
import CommentsSection from '../components/CommentsSection';

const BlogPostPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const blogId = useMemo(() => id ?? '', [id]);

  const { data: post, isLoading, mutate } = useBlogPost(blogId);
  const {
    data: comments,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = useBlogComments(blogId);
  const { trigger: likePost, isMutating: likingPost } = useBlogPostLike(blogId);
  const { trigger: likeComment } = useBlogCommentLike(blogId);
  const { trigger: deleteComment } = useBlogCommentDelete(blogId);
  const { trigger: createComment, isMutating: creatingComment } = useBlogCommentCreate(blogId);
  useDocumentTitle(
    post?.title ? 'pageTitles.blogPost' : undefined,
    post?.title
      ? {
          postTitle: post.title,
        }
      : undefined,
  );

  const handleLikePost = async () => {
    const likes = await likePost();
    await mutate((prev) => (prev ? { ...prev, likesCount: likes } : prev), { revalidate: false });
  };

  const handleLikeComment = async (commentId: number) => {
    const likes = await likeComment(commentId);
    await mutateComments(
      (prev) =>
        prev
          ? prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes,
                  }
                : comment,
            )
          : prev,
      {
        revalidate: false,
      },
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
    await mutateComments((prev) => prev?.filter((comment) => comment.id !== commentId), {
      revalidate: false,
    });
  };

  const handleCreateComment = async (body: string) => {
    await createComment(body);
    await mutateComments();
  };

  if (isLoading || !post) {
    return <PageLoader />;
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1.5}>
          <Breadcrumbs>
            <Link to={resources.Blog}>{t('blog.title')}</Link>
            <Typography color="text.primary">{post.title}</Typography>
          </Breadcrumbs>

          <Typography variant="h3" fontWeight={800}>
            {post.title}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={post.author.avatar} alt={post.author.username} />
            <Stack direction="column" spacing={0.25}>
              <Typography variant="subtitle1" fontWeight={700}>
                {post.author.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.created}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ color: 'text.secondary', ml: 'auto' }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="comment" fontSize={20} />
                <Typography variant="body2" fontWeight={700}>
                  {post.commentsCount}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="like" fontSize={20} />
                <Typography variant="body2" fontWeight={700}>
                  {post.likesCount}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="view" fontSize={20} />
                <Typography variant="body2" fontWeight={700}>
                  {post.views}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          {post.image ? (
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{ width: '100%', maxHeight: 440, objectFit: 'contain' }}
            />
          ) : (
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 0 }} />
          )}
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: post.body ?? post.bodyShort ?? '' }}
            />

            {post.tags.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Stack>
            ) : null}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={<KepIcon name="like" fontSize={20} />}
                onClick={handleLikePost}
                disabled={likingPost}
              >
                {t('blog.actions.like')} ({post.likesCount})
              </Button>
              <Button
                variant="outlined"
                startIcon={<KepIcon name="share" fontSize={20} />}
                component="a"
                href={window.location.href}
              >
                {t('blog.actions.share')}
              </Button>
              <Button variant="text" startIcon={<KepIcon name="comment" fontSize={20} />}>
                {t('blog.comments')}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <CommentsSection
          comments={comments}
          isLoading={commentsLoading || creatingComment}
          onLike={handleLikeComment}
          onDelete={handleDeleteComment}
          onSubmit={handleCreateComment}
        />

        {!currentUser ? (
          <Typography variant="body2" color="text.secondary">
            {t('blog.authNotice')}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default BlogPostPage;
