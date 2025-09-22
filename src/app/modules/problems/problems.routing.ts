import { Route } from '@angular/router';
import { ProblemResolver } from "@problems/problems.resolver";
import { ProblemGuard } from "@problems/problems.guard";
import { AuthGuard } from "@auth";

export default [
  {
    path: '',
    loadComponent: () => import('./pages/problems/problems.component').then(c => c.ProblemsComponent),
    title: 'Problems.Problems',
    data: { title: 'Problems.Problems' },
  },
  // {
  //   path: 'study-plan/:id',
  //   loadComponent: () => import('./pages/study-plan/study-plan.component').then(c => c.StudyPlanComponent),
  //   data: {
  //     title: 'Problems.StudyPlan',
  //   },
  //   resolve: {
  //     studyPlan: StudyPlanResolver,
  //   }
  // },
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
  // {
  //   path: 'problem/:id/og-image',
  //   loadComponent: () => import('./pages/problem/problem-og-image/problem-og-image.component').then(c => c.ProblemOgImageComponent),
  //   resolve: {
  //     problem: ProblemResolver,
  //   },
  //   canActivate: [ProblemGuard],
  // },
  {
    path: 'attempts',
    loadComponent: () => import('./pages/attempts/attempts.component').then(c => c.AttemptsComponent),
    data: {animation: 'attempts', title: 'Problems.Attempts'},
    title: 'Problems.Attempts',
  },
  {
    path: 'attempts/:username',
    loadComponent: () => import('./pages/attempts/attempts.component').then(c => c.AttemptsComponent),
    data: {animation: 'attempts', title: 'Problems.Attempts'},
    title: 'Problems.Attempts',
  },
  // {
  //   path: 'attempts/:id',
  //   loadComponent: () => import('./pages/attempts/attempts.component').then(c => c.AttemptsComponent),
  //   data: { animation: 'attempt', title: 'Problems.Attempt' },
  //   canActivate: [AttemptGuard],
  // },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics.component').then(c => c.StatisticsComponent),
    title: 'Problems.Statistics',
    data: {animation: 'statistics', title: 'Problems.Statistics'},
    canActivate: [AuthGuard],
  },
  {
    path: 'rating',
    loadComponent: () => import('./pages/rating/rating.component').then(c => c.RatingComponent),
    title: 'Problems.Rating',
    data: {animation: 'problems-rating', title: 'Problems.Rating'}
  },
  {
    path: 'rating/history',
    loadComponent: () => import('./pages/rating/rating-history/rating-history.component').then(c => c.RatingHistoryComponent),
    title: 'Problems.RatingHistory',
    data: {animation: 'problems-rating-history', title: 'Problems.RatingHistory'}
  },
  {
    path: 'hacks',
    loadComponent: () => import('./pages/hack-attempts/hack-attempts.component').then(c => c.HackAttemptsComponent),
    data: {animation: 'hack-attempts', title: 'Problems.HackAttempts'},
    title: 'Problems.HackAttempts',
  },
  {
    path: ':category',
    loadComponent: () => import('./pages/problems/category/category.component').then(c => c.CategoryComponent),
    title: 'Problems.Problems',
    data: { title: 'Problems.Problems' },
  },
] satisfies Route[];
