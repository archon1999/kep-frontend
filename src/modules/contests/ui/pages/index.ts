import { lazy } from 'react';

export const ContestAttemptsPage = lazy(() => import('./ContestAttemptsPage/ContestAttemptsPage'));
export const ContestPage = lazy(() => import('./ContestPage/ContestPage'));
export const ContestProblemPage = lazy(() => import('./ContestProblemPage/ContestProblemPage'));
export const ContestProblemsPage = lazy(() => import('./ContestProblemsPage/ContestProblemsPage'));
export const ContestQuestionsPage = lazy(
  () => import('./ContestQuestionsPage/ContestQuestionsPage'),
);
export const ContestRatingChangesPage = lazy(
  () => import('./ContestRatingChangesPage/ContestRatingChangesPage'),
);
export const ContestRegistrantsPage = lazy(
  () => import('./ContestRegistrantsPage/ContestRegistrantsPage'),
);
export const ContestsListPage = lazy(() => import('./ContestsListPage/ContestsListPage'));
export const ContestsRatingPage = lazy(() => import('./ContestsRatingPage/ContestsRatingPage'));
export const ContestStandingsPage = lazy(
  () => import('./ContestStandingsPage/ContestStandingsPage'),
);
export const ContestStatisticsPage = lazy(
  () => import('./ContestStatisticsPage/ContestStatisticsPage'),
);
export const ContestsUserStatisticsPage = lazy(
  () => import('./ContestsUserStatisticsPage/ContestsUserStatisticsPage'),
);
