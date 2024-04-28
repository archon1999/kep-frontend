import { ChallengeResolver } from '@challenges/challenges.resolver';
import { AuthGuard } from '@auth';
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/challenges/challenges.component').then(c => c.ChallengesComponent),
    title: 'Challenges.Challenges',
  },
  {
    path: 'challenge/:id',
    loadComponent: () => import('./pages/challenge/challenge.component').then(c => c.ChallengeComponent),
    data: { title: 'Challenges.Challenge' },
  },
  {
    path: 'rating',
    loadComponent: () => import('./pages/challenges-rating/challenges-rating.component').then(c => c.ChallengesRatingComponent),
    title: 'Challenges.ChallengesRating',
  },
  {
    path: 'user-statistics',
    loadComponent: () => import('./pages/user-statistics/user-statistics.component').then(c => c.UserStatisticsComponent),
    title: 'Challenges.UserStatistics',
    canActivate: [AuthGuard],
  },
] satisfies Routes;
