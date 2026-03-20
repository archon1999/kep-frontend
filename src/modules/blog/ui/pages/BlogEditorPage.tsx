import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PageLoader from 'shared/components/loading/PageLoader';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import {
  blogKeys,
  useBlogCreate,
  useBlogPost,
  useBlogSubmitForReview,
  useBlogTopics,
  useBlogUpdate,
} from '../../application/queries';
import { BlogPost, BlogStatus, BlogTopic } from '../../domain/entities/blog.entity';
import BlogArticleContent from '../components/BlogArticleContent';
import BlogRichTextEditor from '../components/BlogRichTextEditor';
import { prepareBlogArticle } from '../lib/article-content';

const trimTags = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 10);

const THUMBNAIL_HELPER =
  'Images should be in JPEG or PNG format, up to 15MB in size. A 16:9 aspect ratio is required, with 3000×3000 pixels recommended for high resolution.';

const LABEL_SX = { mb: 1, fontWeight: 700 } as const;

const BlogEditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isCreateMode = !id;

  const { data: post, isLoading } = useBlogPost(id);
  const { data: topicOptions = [] } = useBlogTopics();
  const { trigger: createPost, isMutating: isCreating } = useBlogCreate();
  const { trigger: updatePost, isMutating: isUpdating } = useBlogUpdate(id);
  const { trigger: submitForReview, isMutating: isSubmitting } = useBlogSubmitForReview(id);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<BlogTopic[]>([]);
  const [canonicalLink, setCanonicalLink] = useState('');
  const [accessibility, setAccessibility] = useState('public');
  const [language, setLanguage] = useState('english');
  const [targetAudience, setTargetAudience] = useState('all');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditingStory, setIsEditingStory] = useState(false);

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

  const headerTitle = isCreateMode ? 'Blog Details' : t('blog.editor.editTitle');
  const headerSubtitle = useMemo(() => {
    if (currentStatus === BlogStatus.Published) {
      return t('blog.editor.publishedHint');
    }
    if (currentStatus === BlogStatus.Pending) {
      return t('blog.editor.pendingHint');
    }

    return t('blog.editor.draftHint');
  }, [currentStatus, t]);

  const previewArticle = useMemo(() => prepareBlogArticle(body), [body]);

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

  const attachImage = (file: File | null) => {
    if (!file) {
      return;
    }

    setImageFile(file);
    setRemoveImage(false);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    attachImage(event.target.files?.[0] ?? null);
  };

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    attachImage(event.dataTransfer.files?.[0] ?? null);
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
        <Stack spacing={2}>
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

  const storyEditor = (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 960, mx: 'auto' }}>
      <Stack
        direction="column"
        sx={{
          gap: 2,
          minHeight: '70vh',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="column" gap={3}>
          <StyledTextField
            fullWidth
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) {
                setTitleError('');
              }
            }}
            placeholder="Title"
            error={Boolean(titleError)}
            helperText={titleError || undefined}
            slotProps={{
              htmlInput: {
                maxLength: 75,
              },
            }}
            sx={{
              [`& .${inputBaseClasses.root}`]: {
                bgcolor: 'transparent',
                px: 0,
                py: 0,
              },
              [`& .${inputBaseClasses.input}`]: {
                px: '0 !important',
                py: '0 !important',
                fontSize: { xs: 34, md: 40 },
                fontWeight: 700,
                lineHeight: 1.1,
              },
            }}
          />

          <StyledTextField
            fullWidth
            multiline
            minRows={2}
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Subtitle"
            slotProps={{
              htmlInput: {
                maxLength: 140,
              },
            }}
            sx={{
              [`.${inputBaseClasses.root}`]: {
                bgcolor: 'transparent',
                p: 0,
              },
              [`& .${inputBaseClasses.input}`]: {
                px: '0 !important',
                fontSize: 20,
                fontWeight: 500,
              },
            }}
          />

          <BlogRichTextEditor
            value={body}
            onChange={(nextValue) => {
              setBody(nextValue);
              if (bodyError) {
                setBodyError('');
              }
            }}
            placeholder="Write your story..."
          />

          {bodyError ? (
            <Typography variant="caption" color="error.main">
              {bodyError}
            </Typography>
          ) : null}
        </Stack>

        <Paper
          background={1}
          elevation={0}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button color="neutral" onClick={() => setIsEditingStory(false)} disabled={isBusy}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => setIsEditingStory(false)}
            disabled={isBusy}
            sx={{ minWidth: 200 }}
          >
            Save
          </Button>
        </Paper>
      </Stack>
    </Box>
  );

  const mainContent = (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1280, mx: 'auto' }}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <Typography variant="h4">{headerTitle}</Typography>

        {!currentUser ? <Alert severity="warning">{t('blog.editor.authRequired')}</Alert> : null}

        <Grid container columnSpacing={3} rowSpacing={5}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack direction="column" height={1}>
              <Stack
                direction="row"
                sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Preview
                </Typography>

                <Button
                  onClick={() => setIsEditingStory(true)}
                  variant="soft"
                  color="neutral"
                  size="small"
                  startIcon={
                    <IconifyIcon icon="material-symbols:edit-outline-rounded" fontSize={18} />
                  }
                >
                  Write Story
                </Button>
              </Stack>

              <Paper
                background={1}
                elevation={0}
                sx={{
                  width: 1,
                  minHeight: { xs: 400, lg: 560 },
                  flex: 1,
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Stack direction="column" gap={2} sx={{ overflowWrap: 'anywhere', flexWrap: 'wrap' }}>
                  {title ? (
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                  ) : null}

                  {subtitle ? (
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {subtitle}
                    </Typography>
                  ) : null}

                  {(title || subtitle) && body ? <Divider sx={{ my: 2 }} /> : null}

                  {body ? (
                    <BlogArticleContent
                      html={previewArticle.html}
                      sx={{
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          mb: 2,
                          mt: 3,
                          fontWeight: 700,
                        },
                        '& p, & li': {
                          color: 'text.secondary',
                          lineHeight: 1.8,
                        },
                        '& img': {
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          my: 2,
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No content yet. Click <strong>&quot;Write Story&quot;</strong> to start writing.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              {bodyError ? (
                <Typography variant="caption" color="error.main" sx={{ mt: 1, ml: 1 }}>
                  {bodyError}
                </Typography>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack direction="column" spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Title
                </Typography>

                <StyledTextField
                  fullWidth
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (titleError) {
                      setTitleError('');
                    }
                  }}
                  placeholder="Title"
                  error={Boolean(titleError)}
                  helperText={titleError || undefined}
                  slotProps={{
                    htmlInput: {
                      maxLength: 75,
                    },
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="right"
                  mt={0.5}
                  mr={1.5}
                >
                  {title.length}/75
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Sub-text
                </Typography>

                <StyledTextField
                  fullWidth
                  multiline
                  rows={3}
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  placeholder="Write the sub-text"
                  slotProps={{
                    htmlInput: {
                      maxLength: 140,
                    },
                  }}
                  sx={{ [`.${inputBaseClasses.root}`]: { p: 0 } }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="right"
                  mt={0.5}
                  mr={1.5}
                >
                  {subtitle.length}/140
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Thumbnail
                </Typography>

                <Paper
                  component="button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event: DragEvent<HTMLButtonElement>) => event.preventDefault()}
                  onDrop={(event: DragEvent<HTMLButtonElement>) =>
                    handleImageDrop(event as unknown as DragEvent<HTMLDivElement>)
                  }
                  sx={(theme) => ({
                    width: 1,
                    minHeight: { xs: 90, md: 72 },
                    borderRadius: 2,
                    border: `1px dashed ${theme.vars.palette.divider}`,
                    bgcolor: 'background.elevation2',
                    px: 2,
                    py: 2.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      borderColor: theme.vars.palette.primary.main,
                      bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06),
                    },
                  })}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
                    <IconifyIcon
                      icon="material-symbols:add-photo-alternate-outline-rounded"
                      fontSize={24}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {imagePreview ? 'Replace selected image' : 'Drag & Drop files here'}
                    </Typography>
                    <Typography variant="body1" color="primary.main">
                      or browse from device
                    </Typography>
                  </Stack>
                </Paper>

                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 2 }}>
                  <IconifyIcon
                    icon="material-symbols:info-outline-rounded"
                    fontSize={18}
                    color="info.main"
                    style={{ marginTop: 3 }}
                  />
                  <Typography variant="body2" color="info.main">
                    {THUMBNAIL_HELPER}
                  </Typography>
                </Stack>

                {imagePreview ? (
                  <Button
                    size="small"
                    color="error"
                    onClick={handleRemoveImage}
                    sx={{ mt: 1, px: 0 }}
                  >
                    Remove image
                  </Button>
                ) : null}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Topics
                </Typography>

                <Autocomplete
                  multiple
                  options={topicOptions}
                  value={selectedTopics}
                  onChange={(_, value) => setSelectedTopics(value)}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={option.title}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => <StyledTextField {...params} placeholder="Select" />}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.id}>
                      <Checkbox checked={selected} sx={{ mr: 1 }} />
                      {option.title}
                    </li>
                  )}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Canonical link
                </Typography>

                <StyledTextField
                  fullWidth
                  value={canonicalLink}
                  onChange={(event) => setCanonicalLink(event.target.value)}
                  placeholder="Link"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Tags
                </Typography>

                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={tags}
                  onChange={(_, value) => setTags(trimTags(value))}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={`${option}-${index}`}
                        label={option}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      placeholder={tags.length === 0 ? 'Type and press Enter' : ''}
                    />
                  )}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  mt={0.5}
                  mx={1.5}
                >
                  <IconifyIcon icon="material-symbols:info-outline" fontSize={14} />
                  Limit of 10
                </Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid size={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                    Accessibility
                  </Typography>

                  <StyledTextField
                    select
                    fullWidth
                    value={accessibility}
                    onChange={(event) => setAccessibility(event.target.value)}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </StyledTextField>
                </Grid>

                <Grid size={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                    Language
                  </Typography>

                  <StyledTextField
                    select
                    fullWidth
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="uzbek">Uzbek</MenuItem>
                    <MenuItem value="russian">Russian</MenuItem>
                  </StyledTextField>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  Target audience
                </Typography>

                <StyledTextField
                  select
                  fullWidth
                  value={targetAudience}
                  onChange={(event) => setTargetAudience(event.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="children">Children</MenuItem>
                  <MenuItem value="adults">Adults</MenuItem>
                </StyledTextField>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Paper
          background={1}
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {headerSubtitle}
          </Typography>

          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to={profileBlogUrl}
              color="neutral"
              disabled={isBusy}
            >
              Cancel
            </Button>

            <Button
              variant="soft"
              color="neutral"
              onClick={() => handlePersist('draft')}
              disabled={isBusy || !currentUser}
              startIcon={
                isCreating || isUpdating ? <CircularProgress color="inherit" size={18} /> : undefined
              }
            >
              {saveLabel}
            </Button>

            {currentStatus !== BlogStatus.Published && canSubmit ? (
              <Button
                variant="contained"
                onClick={() => handlePersist('submit')}
                disabled={submitDisabled || !currentUser}
                startIcon={isSubmitting ? <CircularProgress color="inherit" size={18} /> : undefined}
              >
                Submit for Review
              </Button>
            ) : null}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );

  return (
    <>
      <Fade in={!isEditingStory}>
        <Box sx={{ display: isEditingStory ? 'none' : 'block' }}>{mainContent}</Box>
      </Fade>

      <Fade in={isEditingStory}>
        <Box sx={{ display: !isEditingStory ? 'none' : 'block' }}>{storyEditor}</Box>
      </Fade>
    </>
  );
};

export default BlogEditorPage;
