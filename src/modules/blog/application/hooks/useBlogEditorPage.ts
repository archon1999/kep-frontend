import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toBackendLanguage } from 'app/locales/locale.ts';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { normalizeBlogHtml } from 'modules/blog/application/blog-content';
import {
  BLOG_TRANSLATION_LOCALES,
  TranslationErrors,
  createEmptyTranslationErrors,
  createEmptyTranslations,
  getMutationErrorMessage,
  hasCompleteTranslation,
  hasTranslationContent,
  hasVisibleBody,
  mergePostTranslations,
  pickInitialLocale,
  trimTags,
} from 'modules/blog/application/blog-editor-state';
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
  BlogTranslationFields,
  BlogTranslationLocale,
  BlogTranslations,
} from 'modules/blog/domain/entities/blog.entity';
import { toast } from 'sonner';
import { mutate as globalMutate } from 'swr';

export const useBlogEditorPage = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();

  const { currentUser } = useAuth();

  const isCreateMode = !id;

  const appLocale = toBackendLanguage(i18n.resolvedLanguage) as BlogTranslationLocale;

  const { data: post, isLoading } = useBlogPost(id);

  const { data: topicOptions = [] } = useBlogTopics();

  const { trigger: createPost, isMutating: isCreating } = useBlogCreate();

  const { trigger: updatePost, isMutating: isUpdating } = useBlogUpdate(id);

  const { trigger: submitForReview, isMutating: isSubmitting } = useBlogSubmitForReview(id);

  const [translations, setTranslations] = useState<BlogTranslations>(createEmptyTranslations());

  const [translationErrors, setTranslationErrors] = useState<TranslationErrors>(
    createEmptyTranslationErrors(),
  );

  const [activeLocale, setActiveLocale] = useState<BlogTranslationLocale>(appLocale);

  const [tags, setTags] = useState<string[]>([]);

  const [selectedTopics, setSelectedTopics] = useState<BlogTopic[]>([]);

  const [canonicalLink, setCanonicalLink] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [removeImage, setRemoveImage] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  const isBusy = isCreating || isUpdating || isSubmitting;

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
      navigate(getResourceById(resources.BlogEdit, submittedPost.id), { replace: true });
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
  return {
    currentUser,
    post,
    isLoading,
    topicOptions,
    isCreating,
    isUpdating,
    isSubmitting,
    isCreateMode,
    isBusy,
    currentStatus,
    canSubmit,
    submitDisabled,
    saveLabel,
    headerTitle,
    headerSubtitle,
    translations,
    tags,
    setTags,
    selectedTopics,
    setSelectedTopics,
    canonicalLink,
    setCanonicalLink,
    setImageFile,
    setRemoveImage,
    handlePersist,
    attachImage,
    hasInitialized,
    activeLocale,
    setActiveLocale,
    imagePreview,
    setImagePreview,
    activeTranslation,
    titleError,
    bodyError,
    updateActiveTranslation,
    clearLocaleError,
  };
};
