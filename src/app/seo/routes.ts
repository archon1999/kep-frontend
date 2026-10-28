import { resources } from '../routes/resources.ts';

export const SITE_URL = 'https://kep.uz';
export const SITE_NAME = 'KEP.uz';

// Only public, durable entry points belong in the sitemap. Personal screens,
// filters, submissions and live workspaces are deliberately excluded.
export const publicSeoRoutes = [
  { path: resources.Home, key: 'home' },
  { path: resources.Problems, key: 'problems', paginated: true },
  { path: resources.ProblemsRating, key: 'problemsRating' },
  { path: resources.StudyPlans, key: 'studyPlans' },
  { path: resources.Projects, key: 'projects', paginated: true },
  { path: resources.ProjectsRating, key: 'projectsRating', paginated: true },
  { path: resources.Tests, key: 'tests' },
  { path: resources.Contests, key: 'contests', paginated: true },
  { path: resources.ContestsRating, key: 'contestsRating' },
  { path: resources.Challenges, key: 'challenges' },
  { path: resources.ChallengesRating, key: 'challengesRating' },
  { path: resources.Duels, key: 'duels' },
  { path: resources.DuelsRating, key: 'duelsRating' },
  { path: resources.Arena, key: 'arena', paginated: true },
  { path: resources.Tournaments, key: 'tournaments', paginated: true },
  { path: resources.Hackathons, key: 'hackathons', paginated: true },
  { path: resources.Blog, key: 'blog', paginated: true },
  { path: resources.Users, key: 'users', paginated: true },
  { path: resources.Calendar, key: 'calendar' },
  { path: resources.Games, key: 'games' },
  { path: resources.Kepcoin, key: 'kepcoin' },
  { path: resources.Shop, key: 'shop' },
] as const;

export type SeoSection = (typeof publicSeoRoutes)[number]['key'];

const publicDetails: Array<{ pattern: RegExp; key: SeoSection }> = [
  { pattern: /^\/problems\/\d+$/, key: 'problems' },
  { pattern: /^\/problems\/study-plan\/[^/]+$/, key: 'studyPlans' },
  { pattern: /^\/projects\/[^/]+$/, key: 'projects' },
  { pattern: /^\/tests\/\d+$/, key: 'tests' },
  {
    pattern: /^\/contests\/\d+(?:\/(?:problems|standings|rating-changes|statistics))?$/,
    key: 'contests',
  },
  { pattern: /^\/arena\/\d+$/, key: 'arena' },
  { pattern: /^\/tournaments\/\d+$/, key: 'tournaments' },
  { pattern: /^\/hackathons\/\d+(?:\/(?:projects|standings))?$/, key: 'hackathons' },
  { pattern: /^\/blog\/(?!new$)[^/]+$/, key: 'blog' },
  { pattern: /^\/users\/[^/]+$/, key: 'users' },
];

const isTrackingParameter = (key: string) => /^(utm_.+|gclid|fbclid|msclkid)$/.test(key);

export const resolveSeoRoute = (pathname: string, search = '') => {
  const path = pathname.replace(/\/+$/, '') || '/';
  const entry = publicSeoRoutes.find((route) => route.path === path);
  const detail = publicDetails.find((route) => route.pattern.test(path));
  const section = entry?.key ?? detail?.key ?? 'home';
  const query = new URLSearchParams(search);
  const page = query.get('page');
  const paginated = Boolean(entry && 'paginated' in entry && entry.paginated);
  const validPage = page !== null && /^[1-9]\d*$/.test(page) && Number.isSafeInteger(Number(page));
  const filtered = [...query.keys()].some(
    (key) => !isTrackingParameter(key) && !(key === 'page' && paginated && validPage),
  );
  const indexable = Boolean(entry || detail) && !filtered;
  const canonicalQuery = paginated && validPage && Number(page) > 1 ? `?page=${page}` : '';

  return {
    section,
    indexable,
    isEntry: Boolean(entry),
    isHome: path === '/',
    page: paginated && validPage ? Number(page) : 1,
    canonical: entry || detail ? `${SITE_URL}${path}${canonicalQuery}` : undefined,
    robots: indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
  };
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['KEP', 'KEP uz'],
  url: `${SITE_URL}/`,
  inLanguage: ['en', 'uz', 'ru'],
};
