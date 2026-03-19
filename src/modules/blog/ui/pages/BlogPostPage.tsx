import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import dayjs from 'dayjs';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { toast } from 'sonner';
import KepIcon from 'shared/components/base/KepIcon';
import PageLoader from 'shared/components/loading/PageLoader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import {
  useBlogCommentCreate,
  useBlogCommentDelete,
  useBlogCommentLike,
  useBlogComments,
  useBlogPost,
  useBlogPostLike,
  useBlogPosts,
} from '../../application/queries';
import BlogArticleContent from '../components/BlogArticleContent';
import BlogCard from '../components/BlogCard';
import CommentsSection from '../components/CommentsSection';
import {
  estimateBlogReadTime,
  prepareBlogArticle,
  stripBlogHtml,
  type BlogArticleHeading,
} from '../lib/article-content';

const useActiveHeading = (headings: BlogArticleHeading[]) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  useEffect(() => {
    if (!headings.length || typeof IntersectionObserver === 'undefined') {
      setActiveHeadingId(headings[0]?.id ?? '');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting);

        if (visibleHeading?.target.id) {
          setActiveHeadingId(visibleHeading.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0.4,
      },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);

      if (element) {
        observer.observe(element);
      }
    });

    setActiveHeadingId((current) => current || headings[0]?.id || '');

    return () => observer.disconnect();
  }, [headings]);

  return activeHeadingId;
};

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

  const authorPostsParams = useMemo(
    () =>
      post
        ? {
            page: 1,
            pageSize: 3,
            author: post.author.username,
          }
        : null,
    [post],
  );

  const { data: authorPostsPage, isLoading: isAuthorPostsLoading } =
    useBlogPosts(authorPostsParams);

  const { data: morePostsPage, isLoading: isMorePostsLoading } = useBlogPosts({
    page: 1,
    pageSize: 6,
    order_by: '2',
  });

  useDocumentTitle(
    post?.title ? 'pageTitles.blogPost' : undefined,
    post?.title
      ? {
          postTitle: post.title,
        }
      : undefined,
  );

  const articleSource = post?.body ?? post?.bodyShort ?? '';
  const article = useMemo(
    () => prepareBlogArticle(articleSource, post?.tableOfContents ?? []),
    [articleSource, post?.tableOfContents],
  );
  const articleHeadings = post?.tableOfContents?.length ? post.tableOfContents : article.headings;
  const readTime = useMemo(() => estimateBlogReadTime(articleSource), [articleSource]);
  const articlePreview = useMemo(() => stripBlogHtml(articleSource).slice(0, 220), [articleSource]);
  const activeHeadingId = useActiveHeading(articleHeadings);
  const authorBlogUrl = post
    ? getResourceByUsername(resources.UserProfileBlog, post.author.username)
    : resources.Blog;
  const metaDateValue = post?.publishedAt ?? post?.created ?? post?.updatedAt ?? '';
  const metaDate = metaDateValue ? dayjs(metaDateValue).format('DD MMM, YYYY') : '';
  const authorBio = post?.author.bio?.trim() || t('blog.authorSectionSubtitle');

  const authorPosts = useMemo(
    () => (authorPostsPage?.data ?? []).filter((item) => item.id !== post?.id).slice(0, 3),
    [authorPostsPage?.data, post?.id],
  );

  const morePosts = useMemo(() => {
    const excludedIds = new Set([post?.id, ...authorPosts.map((item) => item.id)]);

    return (morePostsPage?.data ?? []).filter((item) => !excludedIds.has(item.id)).slice(0, 3);
  }, [authorPosts, morePostsPage?.data, post?.id]);

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
      { revalidate: false },
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: articlePreview,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }

      toast.success(t('blog.messages.linkCopied'));
    } catch {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t('blog.messages.linkCopied'));
      }
    }
  };

  const handleScrollToComments = () => {
    document
      .getElementById('blog-comments')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!post) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Alert severity="warning">{t('blog.editor.notFound')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: articleHeadings.length ? 9 : 12 }}>
            <Stack spacing={{ xs: 3, md: 4 }}>
              <Stack spacing={2}>
                <Breadcrumbs>
                  <Typography
                    component={RouterLink}
                    to={resources.Blog}
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    {t('blog.title')}
                  </Typography>
                  <Typography color="text.primary">{post.title}</Typography>
                </Breadcrumbs>

                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    {post.tags[0] ? <Chip label={post.tags[0]} size="small" /> : null}
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {t('blog.minRead', { count: readTime })}
                    </Typography>
                    {metaDate ? (
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        {metaDate}
                      </Typography>
                    ) : null}
                  </Stack>

                  <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                    {post.title}
                  </Typography>

                  {articlePreview ? (
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                      {articlePreview}
                    </Typography>
                  ) : null}
                </Stack>

                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      src={post.author.avatar ?? undefined}
                      alt={post.author.username}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {post.author.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('blog.creatorLabel')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="outlined"
                      onClick={handleLikePost}
                      disabled={likingPost}
                      startIcon={<KepIcon name="like" fontSize={18} />}
                    >
                      {post.likesCount}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleScrollToComments}
                      startIcon={<KepIcon name="comment" fontSize={18} />}
                    >
                      {comments?.length ?? post.commentsCount}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleShare}
                      startIcon={<KepIcon name="share" fontSize={18} />}
                    >
                      {t('blog.actions.share')}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>

              {post.image ? (
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: 1,
                    aspectRatio: '16 / 10',
                    objectFit: 'cover',
                    borderRadius: 5,
                  }}
                />
              ) : null}

              <BlogArticleContent
                html={article.html}
                sx={{
                  '& h1': { fontSize: { xs: '1.9rem', md: '2.25rem' } },
                  '& h2': { fontSize: { xs: '1.35rem', md: '1.65rem' } },
                  '& h3': { fontSize: { xs: '1.1rem', md: '1.25rem' } },
                  '& p, & li': { lineHeight: 1.9 },
                }}
              />

              {post.tags.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              ) : null}

              <Paper
                background={1}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  backgroundImage: 'none',
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar
                      src={post.author.avatar ?? undefined}
                      alt={post.author.username}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Stack spacing={0.75}>
                      <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        {t('blog.aboutAuthor')}
                      </Typography>
                      <Typography variant="h6" fontWeight={800}>
                        {post.author.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
                        {authorBio}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button component={RouterLink} to={authorBlogUrl} variant="contained">
                    {t('blog.authorSectionAction')}
                  </Button>
                </Stack>
              </Paper>

              {(isAuthorPostsLoading || authorPosts.length > 0) && (
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={800}>
                      {t('blog.moreFromCreator')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('blog.moreFromCreatorSubtitle')}
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    {isAuthorPostsLoading
                      ? Array.from({ length: 2 }).map((_, index) => (
                          <Skeleton
                            key={`author-post-skeleton-${index}`}
                            variant="rounded"
                            height={220}
                            sx={{ borderRadius: 4 }}
                          />
                        ))
                      : authorPosts.map((item) => (
                          <BlogCard key={item.id} post={item} variant="horizontal" />
                        ))}
                  </Stack>
                </Stack>
              )}

              <Box id="blog-comments">
                <CommentsSection
                  comments={comments}
                  isLoading={commentsLoading || creatingComment}
                  onLike={handleLikeComment}
                  onDelete={handleDeleteComment}
                  onSubmit={handleCreateComment}
                />
              </Box>

              {!currentUser ? (
                <Typography variant="body2" color="text.secondary">
                  {t('blog.authNotice')}
                </Typography>
              ) : null}
            </Stack>
          </Grid>

          {articleHeadings.length ? (
            <Grid size={{ xs: 12, lg: 3 }}>
              <Paper
                background={1}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  position: { lg: 'sticky' },
                  top: { lg: 96 },
                  backgroundImage: 'none',
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t('blog.tableOfContents')}
                  </Typography>

                  <List disablePadding>
                    {articleHeadings.map((heading) => (
                      <ListItemButton
                        key={heading.id}
                        component="a"
                        href={`#${heading.id}`}
                        selected={activeHeadingId === heading.id}
                        sx={(theme) => ({
                          borderRadius: 2,
                          alignItems: 'flex-start',
                          px: 1.25,
                          py: 0.75,
                          pl: 1.25 + (heading.level - 1) * 1.5,
                          '&.Mui-selected': {
                            bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08),
                          },
                        })}
                      >
                        <ListItemText
                          primary={heading.text}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: activeHeadingId === heading.id ? 700 : 500,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>

                  <Divider />

                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {authorBio}
                    </Typography>
                    <Button component={RouterLink} to={authorBlogUrl} variant="outlined">
                      {t('blog.authorSectionAction')}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ) : null}
        </Grid>

        {(isMorePostsLoading || morePosts.length > 0) && (
          <Stack spacing={2.5}>
            <Divider />

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={800}>
                  {t('blog.moreBlogs')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('blog.moreBlogsSubtitle')}
                </Typography>
              </Stack>

              <Button component={RouterLink} to={resources.Blog} variant="outlined">
                {t('blog.title')}
              </Button>
            </Stack>

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
              {isMorePostsLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={`more-post-skeleton-${index}`}
                      variant="rounded"
                      height={300}
                      sx={{ borderRadius: 4 }}
                    />
                  ))
                : morePosts.map((item) => (
                    <Box key={item.id} sx={{ minWidth: 0 }}>
                      <BlogCard post={item} />
                    </Box>
                  ))}
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default BlogPostPage;
