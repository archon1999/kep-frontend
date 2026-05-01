export type RecentPage = {
  path: string;
  title: string;
};

const RECENT_PAGES_KEY = 'kep-recent-pages';
const MAX_RECENT_PAGES = 5;

const isBrowser = typeof window !== 'undefined';

const readRecentPages = (): RecentPage[] => {
  if (!isBrowser) return [];

  try {
    const rawValue = window.localStorage.getItem(RECENT_PAGES_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue) as RecentPage[];
    if (Array.isArray(parsedValue)) {
      return parsedValue.filter((page) => page?.path && page?.title);
    }
  } catch (error) {
    console.error('Failed to read recent pages', error);
  }

  return [];
};

const persistRecentPages = (pages: RecentPage[]) => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(pages));
  } catch (error) {
    console.error('Failed to save recent pages', error);
  }
};

export const getRecentPages = () => readRecentPages();

export const clearRecentPages = () => {
  if (!isBrowser) return;

  try {
    window.localStorage.removeItem(RECENT_PAGES_KEY);
  } catch (error) {
    console.error('Failed to clear recent pages', error);
  }
};

export const addRecentPage = (page: RecentPage) => {
  const pages = readRecentPages();

  const filteredPages = pages.filter((recentPage) => recentPage.path !== page.path);
  const updatedPages = [page, ...filteredPages].slice(0, MAX_RECENT_PAGES);

  persistRecentPages(updatedPages);

  return updatedPages;
};
