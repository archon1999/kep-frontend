export interface BlogArticleHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

const EMPTY_PARAGRAPH = '<p><br></p>';

export const normalizeBlogHtml = (html?: string | null) => {
  const normalized = (html ?? '').trim();

  if (!normalized || normalized === EMPTY_PARAGRAPH) {
    return '';
  }

  return normalized;
};

export const stripBlogHtml = (html?: string | null) =>
  normalizeBlogHtml(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const estimateBlogReadTime = (html?: string | null) => {
  const wordCount = stripBlogHtml(html)
    .split(' ')
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const collectHeadings = (document: Document) => {
  const seenIds = new Map<string, number>();
  const headings: BlogArticleHeading[] = [];

  document.body.querySelectorAll('h1, h2, h3').forEach((node) => {
    const text = node.textContent?.trim();

    if (!text) {
      return;
    }

    const level = Number(node.tagName.slice(1)) as BlogArticleHeading['level'];
    const baseId = slugify(text) || `section-${headings.length + 1}`;
    const duplicateCount = seenIds.get(baseId) ?? 0;
    const id = duplicateCount ? `${baseId}-${duplicateCount + 1}` : baseId;

    seenIds.set(baseId, duplicateCount + 1);
    node.setAttribute('id', id);
    headings.push({ id, text, level });
  });

  return headings;
};

export const prepareBlogArticle = (
  html?: string | null,
  tableOfContents: BlogArticleHeading[] = [],
) => {
  const normalizedHtml = normalizeBlogHtml(html);

  if (!normalizedHtml || typeof DOMParser === 'undefined') {
    return {
      html: normalizedHtml,
      headings: tableOfContents,
    };
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(normalizedHtml, 'text/html');
  const headingNodes = Array.from(document.body.querySelectorAll('h1, h2, h3'));
  const canReuseBackendHeadings =
    tableOfContents.length > 0 &&
    headingNodes.length === tableOfContents.length &&
    headingNodes.every(
      (node, index) =>
        Number(node.tagName.slice(1)) === tableOfContents[index]?.level,
    );

  if (canReuseBackendHeadings) {
    headingNodes.forEach((node, index) => {
      node.setAttribute('id', tableOfContents[index].id);
    });

    return {
      html: document.body.innerHTML,
      headings: tableOfContents,
    };
  }

  const headings = collectHeadings(document);

  return {
    html: document.body.innerHTML,
    headings,
  };
};
