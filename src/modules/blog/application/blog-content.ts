const EMPTY_PARAGRAPH = '<p><br></p>';

export const normalizeBlogHtml = (html?: string | null) => {
  const normalized = (html ?? '').trim();

  if (!normalized || normalized === EMPTY_PARAGRAPH) {
    return '';
  }

  return normalized;
};

export const stripBlogHtml = (html?: string | null) => {
  const text = normalizeBlogHtml(html).replace(/<[^>]+>/g, ' ');
  // Decode legacy HTML entities for plain-text excerpts; React escapes the result.
  const decoded =
    typeof DOMParser === 'undefined'
      ? text
      : (new DOMParser().parseFromString(text, 'text/html').body.textContent ?? '');
  return decoded.replace(/\s+/g, ' ').trim();
};

export const estimateBlogReadTime = (html?: string | null) => {
  const wordCount = stripBlogHtml(html).split(' ').filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
};
