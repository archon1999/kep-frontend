import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
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
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { SwiperSlide } from 'swiper/react';
import Swiper from 'shared/components/base/Swiper';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import PageLoader from 'shared/components/loading/PageLoader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { toast } from 'sonner';
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
  type BlogArticleHeading,
  estimateBlogReadTime,
  prepareBlogArticle,
  stripBlogHtml,
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

const formatMetaDate = (value?: string) => {
  if (!value) return '';

  return dayjs(value).isValid() ? dayjs(value).format('DD MMM, YYYY') : value;
};

const BlogPostPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigationPrevRef = useRef<HTMLButtonElement | null>(null);
  const navigationNextRef = useRef<HTMLButtonElement | null>(null);
  const blogId = useMemo(() => id ?? '', [id]);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

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
            pageSize: 4,
            author: post.author.username,
          }
        : null,
    [post],
  );

  const { data: authorPostsPage, isLoading: isAuthorPostsLoading } =
    useBlogPosts(authorPostsParams);

  const { data: recommendationsPage, isLoading: isRecommendationsLoading } = useBlogPosts({
    page: 1,
    pageSize: 8,
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
  const metaDate = formatMetaDate(post?.publishedAt ?? post?.updatedAt ?? post?.created ?? '');
  const authorBio = stripBlogHtml(post?.author.bio?.trim() || '') || t('blog.authorSectionSubtitle');

  const authorPosts = useMemo(
    () => (authorPostsPage?.data ?? []).filter((item) => item.id !== post?.id).slice(0, 3),
    [authorPostsPage?.data, post?.id],
  );

  const recommendedPosts = useMemo(() => {
    const excludedIds = new Set([post?.id, ...authorPosts.map((item) => item.id)]);

    return (recommendationsPage?.data ?? [])
      .filter((item) => !excludedIds.has(item.id))
      .slice(0, 6);
  }, [authorPosts, recommendationsPage?.data, post?.id]);

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

  if (isLoading) {
    return <PageLoader />;
  }

  if (!post) {
    return (
      <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1280, mx: 'auto' }}>
        <Alert severity="warning">{t('blog.editor.notFound')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1280, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Stack spacing={{ xs: 3, md: 5 }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1, maxWidth: 860 }}>
                {post.title}
              </Typography>

              <Stack direction="row" sx={{ gap: 2, alignItems: 'center', mb: 3 }} flexWrap="wrap">
                {post.tags[0] ? <Chip size="small" label={post.tags[0]} /> : null}

                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {t('blog.minRead', { count: readTime })}
                </Typography>

                {metaDate ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {metaDate}
                  </Typography>
                ) : null}
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 'auto' }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <Avatar src={post.author.avatar ?? undefined} alt={post.author.username} sx={{ width: 32, height: 32 }} />
                    <Typography
                      component={RouterLink}
                      to={authorBlogUrl}
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ color: 'text.primary', textDecoration: 'none' }}
                    >
                      {post.author.username}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 'auto' }}
                  sx={{
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <Button
                        variant="text"
                        color="neutral"
                        onClick={handleLikePost}
                        disabled={likingPost}
                        startIcon={
                          <IconifyIcon
                            icon="material-symbols:thumb-up-outline-rounded"
                            fontSize={18}
                          />
                        }
                      >
                        {post.likesCount}
                      </Button>

                      <Button
                        variant="text"
                        color="neutral"
                        onClick={() => setCommentsDrawerOpen(true)}
                        startIcon={
                          <IconifyIcon
                            icon="material-symbols:mode-comment-outline-rounded"
                            fontSize={18}
                          />
                        }
                      >
                        {comments?.length ?? post.commentsCount}
                      </Button>
                    </Stack>

                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <Button variant="text" color="neutral" shape="square" onClick={handleShare}>
                        <IconifyIcon icon="material-symbols:share-outline" fontSize={18} />
                      </Button>

                      <Button variant="text" color="neutral" shape="square">
                        <IconifyIcon
                          icon="material-symbols:bookmark-outline-rounded"
                          fontSize={18}
                        />
                      </Button>

                      <Button variant="text" color="neutral" shape="square">
                        <IconifyIcon icon="mdi:dots-horizontal" fontSize={20} />
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

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
                '& h1, & h2, & h3, & h4': {
                  mb: 2,
                  mt: 4,
                  fontWeight: 700,
                },
                '& p, & li': {
                  color: 'text.secondary',
                  lineHeight: 1.9,
                },
                '& img': {
                  borderRadius: 3,
                  my: 2,
                },
              }}
            />

            {post.tags.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {post.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Stack>
            ) : null}

            <Divider />

            <Paper
              background={1}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={post.author.avatar ?? undefined} alt={post.author.username} sx={{ width: 64, height: 64 }} />

                    <Stack spacing={0.75}>
                      <Typography
                        component={RouterLink}
                        to={authorBlogUrl}
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ color: 'text.primary', textDecoration: 'none' }}
                      >
                        {post.author.username}
                      </Typography>

                      <Stack gap={{ xs: 1, sm: 2 }} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <Typography variant="caption" fontWeight={500} sx={{ color: 'text.secondary' }}>
                          {authorPostsPage?.total ?? authorPosts.length} Stories
                        </Typography>
                        <Typography variant="caption" fontWeight={500} sx={{ color: 'text.secondary' }}>
                          {post.tags.length} Topics
                        </Typography>
                        <Typography variant="caption" fontWeight={500} sx={{ color: 'text.secondary' }}>
                          {post.likesCount} Likes
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Button component={RouterLink} to={authorBlogUrl} variant="soft" color="primary">
                    {t('blog.authorSectionAction')}
                  </Button>
                </Stack>

                <Typography sx={{ color: 'text.secondary' }}>{authorBio}</Typography>
              </Stack>
            </Paper>

            <Divider />

            <Stack spacing={3}>
              <Typography variant="h6">{t('blog.moreFromCreator')}</Typography>

              {isAuthorPostsLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={`author-post-skeleton-${index}`} variant="rounded" height={240} sx={{ borderRadius: 4 }} />
                  ))}
                </Stack>
              ) : authorPosts.length ? (
                <Stack spacing={2}>
                  {authorPosts.map((item) => (
                    <BlogCard key={item.id} post={item} variant="horizontal" />
                  ))}
                </Stack>
              ) : null}
            </Stack>

            <Divider />

            <Box id="blog-comments">
              <CommentsSection
                comments={comments}
                isLoading={commentsLoading || creatingComment}
                onLike={handleLikeComment}
                onDelete={handleDeleteComment}
                onSubmit={handleCreateComment}
              />
            </Box>
          </Stack>
        </Grid>

        {articleHeadings.length ? (
          <Grid size={{ xs: 12, lg: 3 }}>
            <Paper
              elevation={0}
              sx={{
                outline: 0,
                bgcolor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <List
                dense
                sx={{
                  width: '100%',
                  position: 'sticky',
                  top: 96,
                  py: 0,
                  px: 0,
                }}
              >
                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                  {t('blog.tableOfContents')}
                </Typography>

                {articleHeadings.map((heading) => (
                  <ListItemButton
                    key={heading.id}
                    component="a"
                    href={`#${heading.id}`}
                    selected={heading.id === activeHeadingId}
                    sx={{
                      mb: 0.6,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08),
                      },
                    }}
                  >
                    <ListItemText
                      primary={heading.text}
                      primaryTypographyProps={{
                        variant: 'caption',
                        fontWeight: 500,
                        fontSize: '12px !important',
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>
        ) : null}
      </Grid>

      {(isRecommendationsLoading || recommendedPosts.length > 0) && (
        <>
          <Divider sx={{ mt: { xs: 4, md: 5 } }} />

          <Stack direction="column" sx={{ gap: 3, py: { xs: 3, md: 5 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Typography variant="h4">{t('blog.moreBlogs')}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }} sx={{ ml: { sm: 'auto' } }}>
                <Stack
                  sx={{
                    alignItems: 'center',
                    justifyContent: { xs: 'space-between', sm: 'flex-end' },
                  }}
                >
                  <Stack sx={{ alignItems: 'center' }}>
                    <Button ref={navigationPrevRef} variant="soft" color="neutral" sx={{ mr: 1 }}>
                      <KepIcon name="left-arrow" fontSize={18} />
                    </Button>
                    <Button ref={navigationNextRef} variant="soft" color="neutral" sx={{ mr: 2 }}>
                      <KepIcon name="right-arrow" fontSize={18} />
                    </Button>
                  </Stack>

                  <Button component={RouterLink} to={resources.Blog}>
                    {t('blog.title')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {isRecommendationsLoading ? (
              <Stack direction="row" spacing={2} sx={{ overflow: 'hidden' }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={`recommendation-skeleton-${index}`}
                    variant="rounded"
                    width={272}
                    height={360}
                    sx={{ borderRadius: 4, flexShrink: 0 }}
                  />
                ))}
              </Stack>
            ) : (
              <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                loop
                navigation={{
                  prevEl: navigationPrevRef,
                  nextEl: navigationNextRef,
                }}
                sx={{
                  '& .swiper-slide': {
                    width: 'auto',
                    maxHeight: 'auto',
                    boxSizing: 'border-box',
                  },
                }}
              >
                {recommendedPosts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Box sx={{ width: 272 }}>
                      <BlogCard post={item} variant="home" />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Stack>
        </>
      )}

      <CommentsSection
        comments={comments}
        isLoading={commentsLoading || creatingComment}
        onLike={handleLikeComment}
        onDelete={handleDeleteComment}
        onSubmit={handleCreateComment}
        isDrawer
        open={commentsDrawerOpen}
        onClose={() => setCommentsDrawerOpen(false)}
      />
    </Box>
  );
};

export default BlogPostPage;
