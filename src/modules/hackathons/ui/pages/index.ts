import { lazy } from 'react';

export const HackathonAttemptsPage = lazy(
  () => import('./HackathonAttemptsPage/HackathonAttemptsPage'),
);
export const HackathonPage = lazy(() => import('./HackathonPage/HackathonPage'));
export const HackathonProjectPage = lazy(
  () => import('./HackathonProjectPage/HackathonProjectPage'),
);
export const HackathonProjectsPage = lazy(
  () => import('./HackathonProjectsPage/HackathonProjectsPage'),
);
export const HackathonRegistrantsPage = lazy(
  () => import('./HackathonRegistrantsPage/HackathonRegistrantsPage'),
);
export const HackathonsListPage = lazy(() => import('./HackathonsListPage/HackathonsListPage'));
export const HackathonStandingsPage = lazy(
  () => import('./HackathonStandingsPage/HackathonStandingsPage'),
);
