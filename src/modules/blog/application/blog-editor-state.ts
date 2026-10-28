import { stripBlogHtml } from 'modules/blog/application/blog-content';
import {
  BlogPost,
  BlogTranslationFields,
  BlogTranslationLocale,
  BlogTranslations,
} from 'modules/blog/domain/entities/blog.entity';

const BLOG_TRANSLATION_LOCALES: BlogTranslationLocale[] = ['uz', 'ru', 'en'];

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
  Boolean(
    translation.title.trim() || translation.subtitle.trim() || hasVisibleBody(translation.body),
  );

const hasCompleteTranslation = (translation: BlogTranslationFields) =>
  Boolean(translation.title.trim() && hasVisibleBody(translation.body));

const pickInitialLocale = (
  translations: BlogTranslations,
  preferredLocale: BlogTranslationLocale,
) => {
  if (hasTranslationContent(translations[preferredLocale])) {
    return preferredLocale;
  }

  return (
    BLOG_TRANSLATION_LOCALES.find((locale) => hasTranslationContent(translations[locale])) ?? 'uz'
  );
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

export {
  BLOG_TRANSLATION_LOCALES,
  trimTags,
  createEmptyTranslations,
  createEmptyTranslationErrors,
  hasVisibleBody,
  hasTranslationContent,
  hasCompleteTranslation,
  pickInitialLocale,
  mergePostTranslations,
  getMutationErrorMessage,
};
export type { TranslationErrors };
