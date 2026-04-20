import { lazy } from 'react';

export const ChallengeDetailPage = lazy(() => import('./ChallengeDetailPage/ChallengeDetailPage'));
export const ChallengesListPage = lazy(() => import('./ChallengesListPage/ChallengesListPage'));
export const ChallengesRatingPage = lazy(
  () => import('./ChallengesRatingPage/ChallengesRatingPage'),
);
export const ChallengesUserStatisticsPage = lazy(
  () => import('./ChallengesUserStatisticsPage/ChallengesUserStatisticsPage'),
);
