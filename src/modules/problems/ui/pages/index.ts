import { lazy } from 'react';

export const ProblemDetailPage = lazy(() => import('./ProblemDetailPage/ProblemDetailPage'));
export const ProblemsAttemptsPage = lazy(
  () => import('./ProblemsAttemptsPage/ProblemsAttemptsPage'),
);
export const ProblemsListPage = lazy(() => import('./ProblemsListPage/ProblemsListPage'));
export const ProblemsRatingHistoryPage = lazy(
  () => import('./ProblemsRatingHistoryPage/ProblemsRatingHistoryPage'),
);
export const ProblemsRatingPage = lazy(() => import('./ProblemsRatingPage/ProblemsRatingPage'));
export const ProblemsUserStatisticsPage = lazy(
  () => import('./ProblemsUserStatisticsPage/ProblemsUserStatisticsPage'),
);
export const StudyPlanPage = lazy(() => import('./StudyPlanPage/StudyPlanPage'));
export const StudyPlansPage = lazy(() => import('./StudyPlansPage/StudyPlansPage'));
