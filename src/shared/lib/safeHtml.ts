import DOMPurify, { type Config } from 'dompurify';

const richHtmlConfig: Config = {
  USE_PROFILES: {
    html: true,
    svg: true,
    mathMl: true,
  },
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['srcdoc'],
  ALLOW_ARIA_ATTR: true,
  ALLOW_DATA_ATTR: true,
  RETURN_TRUSTED_TYPE: false,
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sanitizeRichHtml = (value?: string | null) => {
  const html = value ?? '';

  if (!DOMPurify.isSupported || typeof DOMPurify.sanitize !== 'function') {
    return escapeHtml(html);
  }

  return DOMPurify.sanitize(html, richHtmlConfig);
};

export const createSafeHtml = (value?: string | null) => ({
  __html: sanitizeRichHtml(value),
});
