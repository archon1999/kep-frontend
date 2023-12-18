import { Route } from '@angular/router';
import { ContestsResolver, ProblemResolver, StudyPlanResolver, StudyPlansResolver } from '@problems/problems.resolver';
import { AttemptGuard, ProblemGuard } from '@problems/problems.guard';
import { AuthGuard } from '@auth/helpers';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/problems/problems.component').then(c => c.ProblemsComponent),
    title: 'Problems.Problems',
    resolve: {
      contests: ContestsResolver,
      studyPlans: StudyPlansResolver,
    }
  },
  {
    path: 'study-plan/:id',
    loadComponent: () => import('./pages/study-plan/study-plan.component').then(c => c.StudyPlanComponent),
    data: {
      title: 'Problems.StudyPlan',
    },
    resolve: {
      studyPlan: StudyPlanResolver,
    }
  },
  {
    path: 'problem/:id',
    loadComponent: () => import('./pages/problem/problem.component').then(c => c.ProblemComponent),
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/attempts',
    loadComponent: () => import('./pages/problem/problem.component').then(c => c.ProblemComponent),
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/hacks',
    loadComponent: () => import('./pages/problem/problem.component').then(c => c.ProblemComponent),
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/og-image',
    loadComponent: () => import('./pages/problem/problem-og-image/problem-og-image.component').then(c => c.ProblemOgImageComponent),
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'attempts',
    loadComponent: () => import('./pages/attempts/attempts.component').then(c => c.AttemptsComponent),
    data: { animation: 'attempts' },
    title: 'Problems.Attempts',
  },
  {
    path: 'attempts/:id',
    loadComponent: () => import('./pages/attempts/attempts.component').then(c => c.AttemptsComponent),
    data: { animation: 'attempt', title: 'Problems.Attempt' },
    canActivate: [AttemptGuard],
  },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics.component').then(c => c.StatisticsComponent),
    title: 'Problems.Statistics',
    data: { animation: 'statistics' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rating',
    loadComponent: () => import('./pages/rating/rating.component').then(c => c.RatingComponent),
    title: 'Problems.Rating',
    data: { animation: 'problems-rating' }
  },
  {
    path: 'rating/history',
    loadComponent: () => import('./pages/rating/rating-history/rating-history.component').then(c => c.RatingHistoryComponent),
    title: 'Problems.RatingHistory',
    data: { animation: 'problems-rating-history' }
  },
  {
    path: 'hacks',
    loadComponent: () => import('./pages/hack-attempts/hack-attempts.component').then(c => c.HackAttemptsComponent),
    data: { animation: 'hack-attempts' },
    title: 'Problems.HackAttempts',
  },
] satisfies Route[];
