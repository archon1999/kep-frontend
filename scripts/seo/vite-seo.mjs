import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  SITE_NAME,
  SITE_URL,
  publicSeoRoutes,
  resolveSeoRoute,
  websiteStructuredData,
} from '../../src/app/seo/routes.ts';

const start = '<!-- kep:metadata -->';
const end = '<!-- /kep:metadata -->';
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

export default function seoDocuments() {
  let config;
  let copy;
  let pageTitles;

  const head = (pathname, search = '', fallback = false) => {
    const route = resolveSeoRoute(pathname, search);
    const entry = copy[route.section];
    const title =
      !fallback && route.isEntry ? `${pageTitles[route.section]} - ${SITE_NAME}` : SITE_NAME;
    const canonical = !fallback && route.canonical;
    const schema =
      !fallback && route.isHome && route.indexable
        ? `<script id="kep-website-schema" type="application/ld+json">${JSON.stringify(websiteStructuredData).replace(/</g, '\\u003c')}</script>`
        : '';

    return `${start}
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(entry.description)}" />
    <meta name="robots" content="${fallback ? 'index, follow' : route.robots}" />
    <meta property="og:site_name" content="${escape(SITE_NAME)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(entry.description)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(entry.description)}" />
    ${canonical ? `<link rel="canonical" href="${escape(canonical)}" /><meta property="og:url" content="${escape(canonical)}" />` : ''}
    ${schema}
    ${end}`;
  };

  const replaceHead = (html, metadata) =>
    html.replace(/<!-- kep:metadata -->[\s\S]*?<!-- \/kep:metadata -->/, metadata);

  return {
    name: 'kep-seo-documents',
    async configResolved(resolved) {
      config = resolved;
      const localeDirectory = path.join(config.root, 'src/app/locales/langs/en');
      const [descriptions, titles] = await Promise.all([
        readFile(path.join(localeDirectory, 'seo.json'), 'utf8'),
        readFile(path.join(localeDirectory, 'page-titles.json'), 'utf8'),
      ]);
      copy = JSON.parse(descriptions).seo;
      pageTitles = JSON.parse(titles).pageTitles;
    },
    transformIndexHtml(html, context) {
      const url = new URL(context.originalUrl || context.path || '/', SITE_URL);
      const pathname = url.pathname === '/index.html' ? '/' : url.pathname;
      return replaceHead(html, head(pathname, url.search));
    },
    async closeBundle() {
      if (config.command !== 'build' || !config.build.write) return;
      const output = path.resolve(config.root, config.build.outDir);
      const html = await readFile(path.join(output, 'index.html'), 'utf8');

      // Detail routes must not inherit the home page's canonical or WebSite markup.
      await writeFile(path.join(output, 'app.html'), replaceHead(html, head('/', '', true)));
      for (const route of publicSeoRoutes) {
        const directory = path.join(output, route.path.slice(1));
        await mkdir(directory, { recursive: true });
        await writeFile(path.join(directory, 'index.html'), replaceHead(html, head(route.path)));
      }
      await writeFile(path.join(output, '404.html'), replaceHead(html, head('/404')));
      await writeFile(
        path.join(output, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /ws/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      );
      const urls = publicSeoRoutes
        .map(({ path: route }) => `  <url><loc>${escape(SITE_URL + route)}</loc></url>`)
        .join('\n');
      await writeFile(
        path.join(output, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', SITE_URL);
        if (!req.headers.accept?.includes('text/html') || /\.[a-z0-9]+$/i.test(url.pathname))
          return next();
        const route = resolveSeoRoute(url.pathname, url.search);
        const file =
          publicSeoRoutes.find((entry) => entry.path === url.pathname) && !url.search
            ? `${url.pathname === '/' ? '' : url.pathname.slice(1) + '/'}index.html`
            : url.pathname === '/404'
              ? '404.html'
              : 'app.html';
        try {
          const html = await readFile(path.resolve(config.root, config.build.outDir, file), 'utf8');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          if (!route.indexable) res.setHeader('X-Robots-Tag', 'noindex, follow');
          res.statusCode = url.pathname === '/404' ? 404 : 200;
          res.end(html);
        } catch {
          next();
        }
      });
    },
  };
}
