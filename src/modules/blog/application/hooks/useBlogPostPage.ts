import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { resources } from 'app/routes/resources';
import { estimateBlogReadTime } from 'modules/blog/application/blog-content';
import { stripBlogHtml } from 'modules/blog/application/blog-content';
import {
  useBlogCommentCreate,
  useBlogCommentDelete,
  useBlogCommentLike,
  useBlogComments,
  useBlogPost,
  useBlogPostLike,
  useBlogPosts,
} from 'modules/blog/application/queries';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { formatDateTimeOrOriginal } from 'shared/lib/dateTime';
import { toast } from 'sonner';

const formatMetaDate = (value?: string) => {
  if (!value) return '';

  return formatDateTimeOrOriginal(value, 'compactDate');
};

export const useBlogPostPage = () => {
  const { id } = useParams();

  const { t } = useTranslation();

  const { currentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  const blogId = useMemo(() => id ?? '', [id]);

  const { data: post, isLoading, error, mutate } = useBlogPost(blogId);

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
    post ? stripBlogHtml(post.bodyShort || post.body || '').slice(0, 200) : undefined,
  );

  const articleSource = post?.body ?? post?.bodyShort ?? '';

  const readTime = useMemo(() => estimateBlogReadTime(articleSource), [articleSource]);

  const articlePreview = useMemo(() => stripBlogHtml(articleSource).slice(0, 220), [articleSource]);

  const authorBlogUrl = post
    ? `${resources.Blog}?author=${encodeURIComponent(post.author.username)}`
    : resources.Blog;

  const metaDate = formatMetaDate(post?.publishedAt ?? post?.updatedAt ?? post?.created ?? '');

  const authorBio =
    stripBlogHtml(post?.author.bio?.trim() || '') || t('blog.authorSectionSubtitle');

  const authorPosts = useMemo(
    () => (authorPostsPage?.data ?? []).filter((item) => item.id !== post?.id).slice(0, 3),
    [authorPostsPage?.data, post?.id],
  );

  const recommendedPosts = useMemo(() => {
    const excludedIds = new Set([post?.id, ...authorPosts.map((item) => item.id)]);

    return (recommendationsPage?.data ?? [])
      .filter((item) => !excludedIds.has(item.id))
      .slice(0, 3);
  }, [authorPosts, recommendationsPage?.data, post?.id]);

  const handleLikePost = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    try {
      const likes = await likePost();
      await mutate((prev) => (prev ? { ...prev, likesCount: likes } : prev), { revalidate: false });
    } catch {
      toast.error(t('common.loadFailed'));
    }
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
  return {
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
  };
};
