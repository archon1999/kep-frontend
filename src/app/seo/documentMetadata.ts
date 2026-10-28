export type DocumentMetadata = {
  title: string;
  description: string;
  language: string;
  robots: string;
  canonical?: string;
  structuredData?: Record<string, unknown>;
};

export const applyDocumentMetadata = (document: Document, metadata: DocumentMetadata) => {
  document.title = metadata.title;
  document.documentElement.lang = metadata.language.split('-')[0];

  const meta = (attribute: 'name' | 'property', key: string, content: string) => {
    const selector = `meta[${attribute}="${key}"]`;
    const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(selector));
    const element = matches.shift() ?? document.createElement('meta');
    matches.forEach((duplicate) => duplicate.remove());
    element.setAttribute(attribute, key);
    element.content = content;
    if (!element.parentNode) document.head.appendChild(element);
  };

  meta('name', 'description', metadata.description);
  meta('name', 'robots', metadata.robots);
  meta('property', 'og:title', metadata.title);
  meta('property', 'og:description', metadata.description);
  meta('property', 'og:site_name', 'KEP.uz');
  meta('property', 'og:type', 'website');
  meta('property', 'og:locale', metadata.language.replace('-', '_'));
  meta('name', 'twitter:card', 'summary');
  meta('name', 'twitter:title', metadata.title);
  meta('name', 'twitter:description', metadata.description);

  document.head
    .querySelectorAll('link[rel="canonical"], meta[property="og:url"]')
    .forEach((node) => node.remove());
  if (metadata.canonical) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = metadata.canonical;
    document.head.appendChild(link);
    meta('property', 'og:url', metadata.canonical);
  }

  document.getElementById('kep-website-schema')?.remove();
  if (metadata.structuredData) {
    const schema = document.createElement('script');
    schema.id = 'kep-website-schema';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(metadata.structuredData);
    document.head.appendChild(schema);
  }
};
