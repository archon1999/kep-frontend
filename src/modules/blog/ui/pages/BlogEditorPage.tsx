import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import KepIcon from 'shared/components/base/KepIcon';
import PageLoader from 'shared/components/loading/PageLoader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  blogKeys,
  useBlogCreate,
  useBlogPost,
  useBlogSubmitForReview,
  useBlogUpdate,
} from '../../application/queries';
import { BlogPost, BlogStatus } from '../../domain/entities/blog.entity';
import BlogRichTextEditor from '../components/BlogRichTextEditor';
import BlogStatusChip from '../components/BlogStatusChip';

const trimTags = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));

const BlogEditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isCreateMode = !id;

  const { data: post, isLoading } = useBlogPost(id);
  const { trigger: createPost, isMutating: isCreating } = useBlogCreate();
  const { trigger: updatePost, isMutating: isUpdating } = useBlogUpdate(id);
  const { trigger: submitForReview, isMutating: isSubmitting } = useBlogSubmitForReview(id);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  const isBusy = isCreating || isUpdating || isSubmitting;
  const profileBlogUrl = currentUser?.username
    ? getResourceByUsername(resources.UserProfileBlog, currentUser.username)
    : resources.Blog;

  useDocumentTitle(
    isCreateMode ? 'pageTitles.blog' : currentPost?.title ? 'pageTitles.blogPost' : undefined,
    currentPost?.title ? { postTitle: currentPost.title } : undefined,
  );

  useEffect(() => {
    if (isCreateMode) {
      setHasInitialized(true);
      return;
    }

    if (!post || hasInitialized) {
      return;
    }

    setTitle(post.title);
    setBody(post.body ?? '');
    setTags(post.tags);
    setImagePreview(post.image ?? null);
    setCurrentPost(post);
    setHasInitialized(true);
  }, [hasInitialized, isCreateMode, post]);

  useEffect(() => {
    if (!imageFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const effectivePost = currentPost ?? post ?? null;
  const currentStatus = effectivePost?.status ?? BlogStatus.Draft;
  const canSubmit = effectivePost?.canSubmit ?? currentStatus === BlogStatus.Draft;
  const submitDisabled = currentStatus === BlogStatus.Published || isBusy || !canSubmit;
  const saveLabel =
    currentStatus === BlogStatus.Draft
      ? t('blog.editor.actions.saveDraft')
      : t('blog.editor.actions.saveChanges');

  const headerTitle = isCreateMode ? t('blog.editor.createTitle') : t('blog.editor.editTitle');
  const headerSubtitle = useMemo(() => {
    if (currentStatus === BlogStatus.Published) {
      return t('blog.editor.publishedHint');
    }
    if (currentStatus === BlogStatus.Pending) {
      return t('blog.editor.pendingHint');
    }

    return t('blog.editor.draftHint');
  }, [currentStatus, t]);

  const validate = () => {
    const nextTitleError = title.trim() ? '' : t('blog.editor.validation.titleRequired');
    const nextBodyError = body.trim() ? '' : t('blog.editor.validation.bodyRequired');

    setTitleError(nextTitleError);
    setBodyError(nextBodyError);

    return !nextTitleError && !nextBodyError;
  };

  const revalidateBlogData = async () => {
    await globalMutate((key) => Array.isArray(key) && key[0] === blogKeys.all[0]);
  };

  const buildPayload = () => ({
    title: title.trim(),
    body,
    tags: trimTags(tags),
    imageFile,
    removeImage: removeImage && !imageFile,
  });

  const handlePersist = async (mode: 'draft' | 'submit') => {
    if (!validate()) {
      return;
    }

    const payload = buildPayload();
    let persistedPost = effectivePost;

    if (isCreateMode) {
      persistedPost = await createPost(payload);
      setCurrentPost(persistedPost);
      await revalidateBlogData();

      if (mode === 'draft') {
        toast.success(t('blog.messages.saved'));
        navigate(getResourceById(resources.BlogEdit, persistedPost.id), { replace: true });
        return;
      }
    } else if (id) {
      persistedPost = await updatePost(payload);
      setCurrentPost(persistedPost);
      await revalidateBlogData();

      if (mode === 'draft') {
        toast.success(
          currentStatus === BlogStatus.Published
            ? t('blog.messages.updated')
            : t('blog.messages.saved'),
        );
        return;
      }
    }

    if (!persistedPost) {
      return;
    }

    const submittedPost = await submitForReview(persistedPost.id);

    setCurrentPost(submittedPost);
    await revalidateBlogData();
    toast.success(t('blog.messages.submittedForReview'));
    navigate(profileBlogUrl);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    setImageFile(nextFile);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isCreateMode && isLoading && !hasInitialized) {
    return <PageLoader />;
  }

  if (!isCreateMode && !post && !isLoading) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Alert severity="warning">{t('blog.editor.notFound')}</Alert>
      </Box>
    );
  }

  if (!isCreateMode && post && !post.canEdit) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={2}>
          <Alert severity="error">{t('blog.editor.forbidden')}</Alert>
          <Button
            component={RouterLink}
            to={resources.Blog}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('common.back')}
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1.5}>
          <Breadcrumbs>
            <RouterLink to={resources.Blog}>{t('blog.title')}</RouterLink>
            <RouterLink to={profileBlogUrl}>{t('users.profile.tabs.blog')}</RouterLink>
            <Typography color="text.primary">{headerTitle}</Typography>
          </Breadcrumbs>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h4" fontWeight={800}>
                {headerTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {headerSubtitle}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <BlogStatusChip status={currentStatus} size="medium" />
              <Button component={RouterLink} to={profileBlogUrl} variant="outlined">
                {t('blog.editor.actions.backToBlogs')}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {!currentUser ? (
          <Alert severity="warning">{t('blog.editor.authRequired')}</Alert>
        ) : null}

        <Alert severity={currentStatus === BlogStatus.Published ? 'success' : 'info'}>
          {currentStatus === BlogStatus.Published
            ? t('blog.editor.statusDescription.published')
            : currentStatus === BlogStatus.Pending
              ? t('blog.editor.statusDescription.pending')
              : t('blog.editor.statusDescription.draft')}
        </Alert>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={2}>
              <TextField
                label={t('blog.editor.fields.title')}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (titleError) {
                    setTitleError('');
                  }
                }}
                fullWidth
                error={Boolean(titleError)}
                helperText={titleError || t('blog.editor.fields.titleHint')}
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(_, value) => setTags(trimTags(value))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('blog.editor.fields.tags')}
                    helperText={t('blog.editor.fields.tagsHint')}
                  />
                )}
              />

              <Stack direction="column" spacing={1.25}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('blog.editor.fields.coverImage')}
                </Typography>

                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt={title || 'blog-cover'}
                    sx={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 3 }}
                  />
                ) : (
                  <Box
                    sx={{
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      borderRadius: 3,
                      px: 3,
                      py: 5,
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2">{t('blog.editor.fields.coverImageEmpty')}</Typography>
                  </Box>
                )}

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="outlined"
                    startIcon={<KepIcon name="upload" fontSize={18} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t('blog.editor.actions.uploadImage')}
                  </Button>
                  {imagePreview ? (
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<KepIcon name="close" fontSize={18} />}
                      onClick={handleRemoveImage}
                    >
                      {t('blog.editor.actions.removeImage')}
                    </Button>
                  ) : null}
                </Stack>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('blog.editor.fields.body')}
              </Typography>
              <BlogRichTextEditor
                value={body}
                onChange={(nextValue) => {
                  setBody(nextValue);
                  if (bodyError) {
                    setBodyError('');
                  }
                }}
                placeholder={t('blog.editor.fields.bodyPlaceholder')}
              />
              {bodyError ? (
                <Typography variant="caption" color="error.main">
                  {bodyError}
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
          <Button component={RouterLink} to={profileBlogUrl} variant="outlined" disabled={isBusy}>
            {t('blog.editor.actions.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => handlePersist('draft')}
            disabled={isBusy || !currentUser}
            startIcon={isCreating || isUpdating ? <CircularProgress color="inherit" size={18} /> : undefined}
          >
            {saveLabel}
          </Button>
          {currentStatus !== BlogStatus.Published && canSubmit ? (
            <Button
              variant="text"
              color="warning"
              onClick={() => handlePersist('submit')}
              disabled={submitDisabled || !currentUser}
              startIcon={isSubmitting ? <CircularProgress color="inherit" size={18} /> : undefined}
            >
              {t('blog.editor.actions.submitForReview')}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export default BlogEditorPage;
