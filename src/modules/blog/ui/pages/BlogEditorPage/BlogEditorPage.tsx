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
  InputBase,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { toBackendLanguage } from 'app/locales/locale.ts';
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
} from 'modules/blog/application/queries';
import {
  BlogPost,
  BlogStatus,
  BlogTopic,
  BlogTranslations,
  BlogTranslationFields,
  BlogTranslationLocale,
} from 'modules/blog/domain/entities/blog.entity';
import BlogArticleContent from 'modules/blog/ui/shared/components/BlogArticleContent';
import BlogRichTextEditor from 'modules/blog/ui/shared/components/BlogRichTextEditor';
import { normalizeBlogHtml, prepareBlogArticle, stripBlogHtml } from 'modules/blog/ui/shared/lib/article-content';

const BLOG_TRANSLATION_LOCALES: BlogTranslationLocale[] = ['uz', 'ru', 'en'];
const LABEL_SX = { mb: 1, fontWeight: 700 } as const;

type TranslationErrors = Record<BlogTranslationLocale, { title: string; body: string }>;

const trimTags = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 10);

const createEmptyTranslations = (): BlogTranslations => ({
  uz: { title: '', subtitle: '', body: '' },
  ru: { title: '', subtitle: '', body: '' },
  en: { title: '', subtitle: '', body: '' },
});

const createEmptyTranslationErrors = (): TranslationErrors => ({
  uz: { title: '', body: '' },
  ru: { title: '', body: '' },
  en: { title: '', body: '' },
});

const hasVisibleBody = (value?: string | null) => Boolean(stripBlogHtml(value));

const hasTranslationContent = (translation: BlogTranslationFields) =>
  Boolean(translation.title.trim() || translation.subtitle.trim() || hasVisibleBody(translation.body));

const hasCompleteTranslation = (translation: BlogTranslationFields) =>
  Boolean(translation.title.trim() && hasVisibleBody(translation.body));

const pickInitialLocale = (
  translations: BlogTranslations,
  preferredLocale: BlogTranslationLocale,
) => {
  if (hasTranslationContent(translations[preferredLocale])) {
    return preferredLocale;
  }

  return BLOG_TRANSLATION_LOCALES.find((locale) => hasTranslationContent(translations[locale])) ?? 'uz';
};

const mergePostTranslations = (
  post: BlogPost | null | undefined,
  preferredLocale: BlogTranslationLocale,
) => {
  const nextTranslations = createEmptyTranslations();

  BLOG_TRANSLATION_LOCALES.forEach((locale) => {
    nextTranslations[locale] = {
      title: post?.translations?.[locale]?.title ?? '',
      subtitle: post?.translations?.[locale]?.subtitle ?? '',
      body: post?.translations?.[locale]?.body ?? '',
    };
  });

  if (
    post &&
    !BLOG_TRANSLATION_LOCALES.some((locale) => hasTranslationContent(nextTranslations[locale])) &&
    (post.title || post.subtitle || post.body)
  ) {
    nextTranslations[preferredLocale] = {
      title: post.title ?? '',
      subtitle: post.subtitle ?? '',
      body: post.body ?? '',
    };
  }

  return nextTranslations;
};

const getMutationErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const apiError = error as {
    data?: unknown;
  };

  if (typeof apiError.data === 'string' && apiError.data.trim()) {
    return apiError.data;
  }

  if (apiError.data && typeof apiError.data === 'object') {
    const values = Object.values(apiError.data as Record<string, unknown>);
    const firstValue = values[0];

    if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
      return firstValue[0];
    }

    if (typeof firstValue === 'string' && firstValue.trim()) {
      return firstValue;
    }
  }

  return fallback;
};

interface TranslationLocaleSelectProps {
  activeLocale: BlogTranslationLocale;
  onChange: (locale: BlogTranslationLocale) => void;
  translations: BlogTranslations;
}

const TranslationLocaleSelect = ({
  activeLocale,
  onChange,
  translations,
}: TranslationLocaleSelectProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={1}
    >
      <Typography variant="subtitle2" fontWeight={700}>
        {t('blog.editor.translationLabel')}
      </Typography>

      <StyledTextField
        select
        size="small"
        value={activeLocale}
        onChange={(event) => onChange(event.target.value as BlogTranslationLocale)}
      >
        {BLOG_TRANSLATION_LOCALES.map((locale) => (
          <MenuItem key={locale} value={locale}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: hasTranslationContent(translations[locale])
                    ? theme.vars.palette.success.main
                    : cssVarRgba(theme.vars.palette.text.primaryChannel, 0.22),
                })}
              />
              <span>{t(`blog.editor.fields.languageOptions.${locale}`)}</span>
            </Stack>
          </MenuItem>
        ))}
      </StyledTextField>
    </Stack>
  );
};

interface EditorialFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  minRows?: number;
  error?: string;
}

const EditorialField = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  multiline = false,
  minRows = 1,
  error,
}: EditorialFieldProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" fontWeight={700}>
      {label}
    </Typography>

    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${cssVarRgba(theme.vars.palette.text.primaryChannel, 0.12)}`,
        pb: 1.25,
        transition: 'border-color 0.2s ease',
        '&:focus-within': {
          borderColor: theme.vars.palette.primary.main,
        },
      })}
    >
      <InputBase
        fullWidth
        multiline={multiline}
        minRows={minRows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputProps={{ maxLength, 'aria-label': label }}
        sx={(theme) => ({
          alignItems: 'flex-start',
          color: 'text.primary',
          caretColor: theme.vars.palette.primary.main,
          '& input, & textarea': {
            p: 0,
            fontWeight: multiline ? 500 : 700,
            fontSize: multiline ? { xs: 24, md: 28 } : { xs: 40, md: 52 },
            lineHeight: multiline ? 1.35 : 1.05,
            letterSpacing: multiline ? '-0.01em' : '-0.03em',
            '&::placeholder': {
              color: cssVarRgba(theme.vars.palette.text.primaryChannel, 0.32),
              opacity: 1,
            },
            '&::selection': {
              backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24),
            },
          },
          '& textarea': {
            resize: 'none',
          },
        })}
      />
    </Box>

    {error ? (
      <Typography variant="caption" color="error.main">
        {error}
      </Typography>
    ) : null}
  </Stack>
);

const BlogEditorPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isCreateMode = !id;
  const appLocale = toBackendLanguage(i18n.resolvedLanguage) as BlogTranslationLocale;

  const { data: post, isLoading } = useBlogPost(id);
  const { data: topicOptions = [] } = useBlogTopics();
  const { trigger: createPost, isMutating: isCreating } = useBlogCreate();
  const { trigger: updatePost, isMutating: isUpdating } = useBlogUpdate(id);
  const { trigger: submitForReview, isMutating: isSubmitting } = useBlogSubmitForReview(id);

  const [translations, setTranslations] = useState<BlogTranslations>(createEmptyTranslations());
  const [translationErrors, setTranslationErrors] = useState<TranslationErrors>(createEmptyTranslationErrors());
  const [activeLocale, setActiveLocale] = useState<BlogTranslationLocale>(appLocale);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<BlogTopic[]>([]);
  const [canonicalLink, setCanonicalLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
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
      if (!hasInitialized) {
        setActiveLocale(appLocale);
        setHasInitialized(true);
      }
      return;
    }

    if (!post || hasInitialized) {
      return;
    }

    const nextTranslations = mergePostTranslations(post, appLocale);
    setTranslations(nextTranslations);
    setActiveLocale(pickInitialLocale(nextTranslations, appLocale));
    setTags(post.tags);
    setSelectedTopics(post.topics ?? []);
    setCanonicalLink(post.canonicalLink ?? '');
    setImagePreview(post.image ?? null);
    setCurrentPost(post);
    setHasInitialized(true);
  }, [appLocale, hasInitialized, isCreateMode, post]);

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

  const activeTranslation = translations[activeLocale];
  const titleError = translationErrors[activeLocale].title;
  const bodyError = translationErrors[activeLocale].body;
  const previewArticle = useMemo(
    () => prepareBlogArticle(activeTranslation.body),
    [activeTranslation.body],
  );

  const updateActiveTranslation = (patch: Partial<BlogTranslationFields>) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        ...patch,
      },
    }));
  };

  const clearLocaleError = (locale: BlogTranslationLocale, field: 'title' | 'body') => {
    setTranslationErrors((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: '',
      },
    }));
  };

  const validate = () => {
    const nextErrors = createEmptyTranslationErrors();
    const hasValidLocale = BLOG_TRANSLATION_LOCALES.some((locale) =>
      hasCompleteTranslation(translations[locale]),
    );

    if (hasValidLocale) {
      setTranslationErrors(nextErrors);
      return true;
    }

    const localeToHighlight =
      BLOG_TRANSLATION_LOCALES.find((locale) => hasTranslationContent(translations[locale])) ??
      activeLocale;
    const translation = translations[localeToHighlight];

    nextErrors[localeToHighlight] = {
      title: translation.title.trim() ? '' : t('blog.editor.validation.titleRequired'),
      body: hasVisibleBody(translation.body) ? '' : t('blog.editor.validation.bodyRequired'),
    };

    setActiveLocale(localeToHighlight);
    setTranslationErrors(nextErrors);
    return false;
  };

  const revalidateBlogData = async () => {
    await globalMutate((key) => Array.isArray(key) && key[0] === blogKeys.all[0]);
  };

  const buildPayload = () => ({
    translations: BLOG_TRANSLATION_LOCALES.reduce((acc, locale) => {
      acc[locale] = {
        title: translations[locale].title.trim(),
        subtitle: translations[locale].subtitle.trim(),
        body: normalizeBlogHtml(translations[locale].body),
      };
      return acc;
    }, createEmptyTranslations()),
    tags: trimTags(tags),
    topicIds: selectedTopics.map((topic) => topic.id),
    canonicalLink: canonicalLink.trim(),
    imageFile,
    removeImage: removeImage && !imageFile,
  });

  const syncEditorStateFromPost = (nextPost: BlogPost) => {
    const nextTranslations = mergePostTranslations(nextPost, appLocale);
    setTranslations(nextTranslations);
    setCurrentPost(nextPost);
    setTags(nextPost.tags);
    setSelectedTopics(nextPost.topics ?? []);
    setCanonicalLink(nextPost.canonicalLink ?? '');
    setImagePreview(nextPost.image ?? null);
  };

  const handlePersist = async (mode: 'draft' | 'submit') => {
    if (!validate()) {
      toast.error(t('blog.editor.validation.translationRequired'));
      return;
    }

    try {
      const payload = buildPayload();
      let persistedPost = effectivePost;

      if (isCreateMode) {
        persistedPost = await createPost(payload);
        syncEditorStateFromPost(persistedPost);
        await revalidateBlogData();

        if (mode === 'draft') {
          toast.success(t('blog.messages.saved'));
          navigate(getResourceById(resources.BlogEdit, persistedPost.id), { replace: true });
          return;
        }
      } else if (id) {
        persistedPost = await updatePost(payload);
        syncEditorStateFromPost(persistedPost);
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
      syncEditorStateFromPost(submittedPost);
      await revalidateBlogData();
      toast.success(t('blog.messages.submittedForReview'));
      navigate(profileBlogUrl);
    } catch (error) {
      toast.error(
        getMutationErrorMessage(
          error,
          mode === 'submit' ? t('blog.messages.submitFailed') : t('blog.messages.saveFailed'),
        ),
      );
    }
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
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1040, mx: 'auto' }}>
      <Stack spacing={3}>
        <TranslationLocaleSelect
          activeLocale={activeLocale}
          onChange={setActiveLocale}
          translations={translations}
        />

        <Stack spacing={3.5}>
          <EditorialField
            label={t('blog.editor.fields.title')}
            value={activeTranslation.title}
            onChange={(value) => {
              updateActiveTranslation({ title: value });
              if (titleError) {
                clearLocaleError(activeLocale, 'title');
              }
            }}
            placeholder={t('blog.editor.fields.titlePlaceholder')}
            maxLength={75}
            error={titleError}
          />

          <EditorialField
            label={t('blog.editor.fields.subText')}
            value={activeTranslation.subtitle}
            onChange={(value) => updateActiveTranslation({ subtitle: value })}
            placeholder={t('blog.editor.fields.subTextPlaceholder')}
            maxLength={140}
            multiline
            minRows={2}
          />

          <BlogRichTextEditor
            key={activeLocale}
            value={activeTranslation.body}
            onChange={(nextValue) => {
              updateActiveTranslation({ body: nextValue });
              if (bodyError) {
                clearLocaleError(activeLocale, 'body');
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
            {t('blog.editor.actions.cancel')}
          </Button>

          <Button
            variant="contained"
            onClick={() => setIsEditingStory(false)}
            disabled={isBusy}
            sx={{ minWidth: 200 }}
          >
            {t('blog.editor.actions.saveChanges')}
          </Button>
        </Paper>
      </Stack>
    </Box>
  );

  const mainContent = (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1280, mx: 'auto' }}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <Typography variant="h4">{headerTitle}</Typography>

        <Grid container columnSpacing={3} rowSpacing={5}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack direction="column" height={1}>
              <Stack
                direction="row"
                sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t('blog.editor.previewLabel')}
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
                  {t('blog.editor.actions.writeStory')}
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
                  {imagePreview ? (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt={activeTranslation.title || t('blog.editor.fields.coverImage')}
                      sx={{
                        width: 1,
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                  ) : null}

                  {activeTranslation.title ? (
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {activeTranslation.title}
                    </Typography>
                  ) : null}

                  {activeTranslation.subtitle ? (
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {activeTranslation.subtitle}
                    </Typography>
                  ) : null}

                  {(activeTranslation.title || activeTranslation.subtitle) && hasVisibleBody(activeTranslation.body) ? (
                    <Divider sx={{ my: 2 }} />
                  ) : null}

                  {hasVisibleBody(activeTranslation.body) ? (
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
                      {t('blog.editor.previewEmptyState')}
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
              <TranslationLocaleSelect
                activeLocale={activeLocale}
                onChange={setActiveLocale}
                translations={translations}
              />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  {t('blog.editor.fields.title')}
                </Typography>

                <StyledTextField
                  fullWidth
                  value={activeTranslation.title}
                  onChange={(event) => {
                    updateActiveTranslation({ title: event.target.value });
                    if (titleError) {
                      clearLocaleError(activeLocale, 'title');
                    }
                  }}
                  placeholder={t('blog.editor.fields.titlePlaceholder')}
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
                  {activeTranslation.title.length}/75
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  {t('blog.editor.fields.subText')}
                </Typography>

                <StyledTextField
                  fullWidth
                  multiline
                  rows={3}
                  value={activeTranslation.subtitle}
                  onChange={(event) => updateActiveTranslation({ subtitle: event.target.value })}
                  placeholder={t('blog.editor.fields.subTextPlaceholder')}
                  slotProps={{
                    htmlInput: {
                      maxLength: 140,
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
                  {activeTranslation.subtitle.length}/140
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  {t('blog.editor.fields.coverImage')}
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
                      {imagePreview
                        ? t('blog.editor.fields.coverImageReplace')
                        : t('blog.editor.fields.coverImageDrop')}
                    </Typography>
                    <Typography variant="body1" color="primary.main">
                      {t('blog.editor.fields.coverImageBrowse')}
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
                    {t('blog.editor.fields.coverImageHelper')}
                  </Typography>
                </Stack>

                {imagePreview ? (
                  <Button
                    size="small"
                    color="error"
                    onClick={handleRemoveImage}
                    sx={{ mt: 1, px: 0 }}
                  >
                    {t('blog.editor.actions.removeImage')}
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
                  {t('blog.editor.fields.topics')}
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
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      placeholder={selectedTopics.length === 0 ? t('blog.editor.fields.topicsPlaceholder') : ''}
                    />
                  )}
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
                  {t('blog.editor.fields.canonicalLink')}
                </Typography>

                <StyledTextField
                  fullWidth
                  value={canonicalLink}
                  onChange={(event) => setCanonicalLink(event.target.value)}
                  placeholder={t('blog.editor.fields.canonicalLinkPlaceholder')}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={LABEL_SX}>
                  {t('blog.editor.fields.tags')}
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
                      placeholder={tags.length === 0 ? t('blog.editor.fields.tagsPlaceholder') : ''}
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
                  {t('blog.editor.fields.tagsLimit')}
                </Typography>
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
              {t('blog.editor.actions.cancel')}
            </Button>

            <Button
              variant="soft"
              color="neutral"
              onClick={() => handlePersist('draft')}
              disabled={isBusy}
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
                disabled={submitDisabled}
                startIcon={isSubmitting ? <CircularProgress color="inherit" size={18} /> : undefined}
              >
                {t('blog.editor.actions.submitForReview')}
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
