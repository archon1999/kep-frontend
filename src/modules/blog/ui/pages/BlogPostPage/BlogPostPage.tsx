import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { useBlogPostPage } from 'modules/blog/application/hooks/useBlogPostPage';
import BlogArticleContent from 'modules/blog/ui/shared/components/BlogArticleContent';
import BlogCard from 'modules/blog/ui/shared/components/BlogCard';
import CommentsSection from 'modules/blog/ui/shared/components/CommentsSection';
import {
  type BlogArticleHeading,
  prepareBlogArticle,
} from 'modules/blog/ui/shared/lib/article-content';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import PageLoader from 'shared/components/loading/PageLoader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { toast } from 'sonner';

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
  const {
    post,
    isLoading,
    error,
    mutate,
    comments,
    commentsLoading,
    likingPost,
    creatingComment,
    isAuthorPostsLoading,
    isRecommendationsLoading,
    readTime,
    articlePreview,
    authorBio,
    articleSource,
    authorBlogUrl,
    metaDate,
    authorPosts,
    recommendedPosts,
    handleLikePost,
    handleLikeComment,
    handleDeleteComment,
    handleCreateComment,
  } = useBlogPostPage();

  const { t } = useTranslation();
  const article = useMemo(
    () => prepareBlogArticle(articleSource, post?.tableOfContents ?? [], post?.title),
    [articleSource, post?.tableOfContents, post?.title],
  );
  const articleHeadings = article.headings;
  const activeHeadingId = useActiveHeading(articleHeadings);

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

  if (isLoading) return <PageLoader />;
  if (!post || error)
    return (
      <FramedPage>
        <PageHeader variant="detail" title={t('blog.title')} backTo={resources.Blog} />
        <EmptyState
          kind={error ? 'error' : 'blog'}
          title={t(error ? 'blog.loadError' : 'blog.editor.notFound')}
          action={
            <Button variant="outlined" onClick={() => void mutate()}>
              {t('common.retry')}
            </Button>
          }
        />
      </FramedPage>
    );

  const contents = (
    <List disablePadding aria-label={t('blog.tableOfContents')}>
      {articleHeadings.map((heading) => (
        <ListItemButton
          key={heading.id}
          component="a"
          href={`#${heading.id}`}
          selected={heading.id === activeHeadingId}
          sx={{
            py: 0.75,
            pl: heading.level === 3 ? 2 : 1,
            borderLeft: 2,
            borderColor: heading.id === activeHeadingId ? 'primary.main' : 'divider',
            '&.Mui-selected': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          <ListItemText
            primary={heading.text}
            slotProps={{
              primary: { variant: 'caption', sx: { lineHeight: 1.6, overflowWrap: 'anywhere' } },
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={post.title}
        subtitle={post.subtitle}
        backTo={resources.Blog}
        sx={{
          '& .kep-page-hero-copy h1': {
            fontSize: { xs: 30, md: 44 },
            maxWidth: 900,
            lineHeight: 1.15,
          },
        }}
        actionComponent={
          post.canEdit ? (
            <Button
              component={RouterLink}
              to={getResourceById(resources.BlogEdit, post.id)}
              variant="contained"
              startIcon={<IconifyIcon icon="material-symbols:edit-outline-rounded" />}
            >
              {t('blog.profile.edit')}
            </Button>
          ) : undefined
        }
      />
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        flexWrap="wrap"
        sx={{ px: 'var(--kep-content-inset)', py: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Avatar src={post.author.avatar ?? undefined} alt="" sx={{ width: 32, height: 32 }} />
        <Box>
          <UserPopover username={post.author.username} avatar={post.author.avatar ?? undefined}>
            <Typography
              variant="body2"
              sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 600 }}
            >
              {post.author.username}
            </Typography>
          </UserPopover>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {metaDate} · {t('blog.minRead', { count: readTime })}
          </Typography>
        </Box>
        <Stack direction="row" gap={0.5} sx={{ ml: { sm: 'auto' }, flexWrap: 'wrap' }}>
          <Button
            variant="text"
            size="small"
            onClick={handleLikePost}
            disabled={likingPost}
            aria-label={`${t('blog.actions.like')}: ${post.likesCount}`}
            startIcon={<IconifyIcon icon="material-symbols:thumb-up-outline-rounded" />}
          >
            {post.likesCount}
          </Button>
          <Button
            component="a"
            href="#blog-comments"
            variant="text"
            size="small"
            aria-label={t('blog.comments')}
            startIcon={<IconifyIcon icon="material-symbols:mode-comment-outline-rounded" />}
          >
            {comments?.length ?? post.commentsCount}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={handleShare}
            startIcon={<IconifyIcon icon="material-symbols:share-outline" />}
          >
            {t('blog.actions.share')}
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1fr) 280px' },
        }}
      >
        <Box component="article" sx={{ minWidth: 0 }}>
          {post.image && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.level1' }}>
              <Box
                component="img"
                src={post.image}
                alt={post.title}
                sx={{
                  display: 'block',
                  width: '100%',
                  maxHeight: { xs: 220, md: 300 },
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
          {articleHeadings.length > 0 && (
            <Box
              component="details"
              sx={{
                display: { lg: 'none' },
                px: 'var(--kep-content-inset)',
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                component="summary"
                variant="body2"
                sx={{ cursor: 'pointer', color: 'primary.main', mb: 1 }}
              >
                {t('blog.tableOfContents')}
              </Typography>
              {contents}
            </Box>
          )}
          <Box sx={{ px: 'var(--kep-content-inset)', py: { xs: 3, md: 4 } }}>
            <BlogArticleContent html={article.html} sx={{ maxWidth: '72ch', mx: 'auto' }} />
            {!!post.tags.length && (
              <Stack
                direction="row"
                gap={1}
                flexWrap="wrap"
                sx={{ mt: 4, maxWidth: '72ch', mx: 'auto' }}
              >
                {post.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
          </Box>
          <Box
            id="blog-comments"
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              p: 'var(--kep-content-inset)',
              scrollMarginTop: 100,
            }}
          >
            <CommentsSection
              comments={comments}
              isLoading={commentsLoading}
              isSubmitting={creatingComment}
              onLike={handleLikeComment}
              onDelete={handleDeleteComment}
              onSubmit={handleCreateComment}
            />
          </Box>
        </Box>
        <Box
          component="aside"
          sx={{
            minWidth: 0,
            borderLeft: { lg: 1 },
            borderTop: { xs: 1, lg: 0 },
            borderColor: { xs: 'divider', lg: 'divider' },
          }}
        >
          <Stack
            direction="column"
            gap={3}
            sx={{
              p: 3,
              position: { lg: 'sticky' },
              top: 96,
              maxHeight: { lg: 'calc(100dvh - 112px)' },
              overflowY: { lg: 'auto' },
            }}
          >
            {articleHeadings.length > 0 && (
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 2 }}
                >
                  {t('blog.tableOfContents')}
                </Typography>
                {contents}
              </Box>
            )}
            <Box>
              <Typography component="h2" variant="overline" color="text.secondary" sx={{ mb: 2 }}>
                {t('blog.aboutAuthor')}
              </Typography>
              <Stack direction="row" gap={1.25} alignItems="center" sx={{ my: 1.5 }}>
                <Avatar
                  src={post.author.avatar ?? undefined}
                  alt=""
                  sx={{ width: 36, height: 36 }}
                />
                <UserPopover
                  username={post.author.username}
                  avatar={post.author.avatar ?? undefined}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.primary', textDecoration: 'none', overflowWrap: 'anywhere' }}
                  >
                    {post.author.username}
                  </Typography>
                </UserPopover>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, overflowWrap: 'anywhere' }}
              >
                {authorBio}
              </Typography>
              <Button
                component={RouterLink}
                to={authorBlogUrl}
                size="small"
                sx={{ mt: 1.5, px: 0, textAlign: 'left' }}
              >
                {t('blog.authorSectionAction')} ↗
              </Button>
            </Box>
            {(isAuthorPostsLoading || authorPosts.length > 0) && (
              <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Typography component="h2" variant="overline" color="text.secondary">
                  {t('blog.moreFromCreator')}
                </Typography>
                {isAuthorPostsLoading ? (
                  <Skeleton height={80} />
                ) : (
                  authorPosts.map((item) => (
                    <Typography
                      key={item.id}
                      component={RouterLink}
                      to={getResourceById(resources.BlogPost, item.id)}
                      variant="body2"
                      sx={{
                        display: 'block',
                        py: 1.5,
                        color: 'text.primary',
                        textDecoration: 'none',
                        borderBottom: 1,
                        borderColor: 'divider',
                        overflowWrap: 'anywhere',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {item.title}{' '}
                      <Box component="span" color="primary.main">
                        ↗
                      </Box>
                    </Typography>
                  ))
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
      {(isRecommendationsLoading || recommendedPosts.length > 0) && (
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <SectionHeader
            title={t('blog.moreBlogs')}
            action={
              <Button component={RouterLink} to={resources.Blog}>
                {t('blog.viewAll')} ↗
              </Button>
            }
          />
          <Box
            sx={{
              ...contentGridSx,
              bgcolor: 'background.default',
              gap: 0,
              borderBottom: 0,
              '& > *': { minWidth: 0, borderRight: 1, borderBottom: 1, borderColor: 'divider' },
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3,minmax(0,1fr))' },
            }}
          >
            {isRecommendationsLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} variant="rectangular" height={300} />
                ))
              : recommendedPosts.map((item) => <BlogCard key={item.id} post={item} />)}
          </Box>
        </Box>
      )}
    </FramedPage>
  );
};
export default BlogPostPage;
