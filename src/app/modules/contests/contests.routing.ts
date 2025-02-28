import { Route } from '@angular/router';
import { AuthGuard } from '@auth';
import { ContestProblemResolver, ContestProblemsResolver, ContestResolver } from '@contests/contests.resolver';
import { ContestCreateGuard, ContestGuard } from '@contests/contests.guard';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/contests/contests.component').then(c => c.ContestsComponent),
    title: 'Contests.Contests'
  },
  {
    path: 'rating',
    loadComponent: () => import('./pages/rating/rating.component').then(c => c.RatingComponent),
    data: {animation: 'contests-rating'},
    title: 'Contests.ContestsRating',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
    data: {animation: 'contests-profile'},
    canActivate: [AuthGuard],
    title: 'Contests.ContestsProfile',
  },
  {
    path: 'contest/:id',
    loadComponent: () => import('./pages/contest/contest.component').then(c => c.ContestComponent),
    data: {
      title: 'Contests.Contest',
    },
    canActivate: [],
    resolve: {
      contest: ContestResolver,
    },
  },
  {
    path: 'contest/:id/problems',
    loadComponent: () => import('./pages/contest/contest-problems/contest-problems.component').then(c => c.ContestProblemsComponent),
    data: {
      title: 'Contests.ContestProblems',
    },
    canActivate: [ContestGuard],
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    }
  },
  {
    path: 'contest/:id/questions',
    loadComponent: () => import('./pages/contest/contest-questions/contest-questions.component').then(c => c.ContestQuestionsComponent),
    data: {
      title: 'Contests.ContestQuestions',
    },
    canActivate: [ContestGuard],
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    }
  },
  {
    path: 'contest/:id/problem/:symbol',
    loadComponent: () => import('./pages/contest/contest-problem/contest-problem.component').then(c => c.ContestProblemComponent),
    data: {
      title: 'Contests.ContestProblem',
    },
    canActivate: [ContestGuard],
    resolve: {
      contest: ContestResolver,
      contestProblem: ContestProblemResolver,
    }
  },
  {
    path: 'contest/:id/attempts',
    loadComponent: () => import('./pages/contest/contest-attempts/contest-attempts.component').then(c => c.ContestAttemptsComponent),
    data: {
      title: 'Contests.ContestAttempts',
    },
    canActivate: [ContestGuard],
    resolve: {
      contest: ContestResolver,
    }
  },
  {
    path: 'contest/:id/standings',
    loadComponent: () => import('./pages/contest/contest-standings/contest-standings.component').then(c => c.ContestStandingsComponent),
    data: {
      animation: 'contest-standings',
      title: 'Contests.ContestStandings',
    },
    canActivate: [ContestGuard],
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    }
  },
  {
    path: 'contest/:id/registrants',
    loadComponent: () => import('./pages/contest/contest-registrants/contest-registrants.component').then(c => c.ContestRegistrantsComponent),
    data: {
      animation: 'contest-registrants',
      title: 'Contests.ContestRegistrants',
    },
    resolve: {
      contest: ContestResolver,
    }
  },
  {
    path: 'contest/:id/rating-changes',
    loadComponent: () => import('./pages/contest/contest-rating-changes/contest-rating-changes.component').then(
      c => c.ContestRatingChangesComponent
    ),
    data: {
      animation: 'contest-rating-changes',
      title: 'Contests.ContestRatingChanges',
    },
    resolve: {
      contest: ContestResolver,
    },
  },
  {
    path: 'contest/:id/og-image',
    loadComponent: () => import('./pages/contest/contest-og-image/contest-og-image.component').then(c => c.ContestOgImageComponent),
    resolve: {
      contest: ContestResolver,
    },
  },
  {
    path: 'user-contests',
    loadComponent: () => import('./pages/user-contests/user-contests.component').then(c => c.UserContestsComponent),
    data: {animation: 'user-contests'},
    title: 'Contests.MyContests',
  },
  {
    path: 'user-contests/create',
    loadComponent: () => import('./pages/user-contests/contest-create/contest-create.component').then(c => c.ContestCreateComponent),
    data: {
      animation: 'user-contest-create',
    },
    title: 'Contests.CreateContest',
    canActivate: [ContestCreateGuard],
  },
]  satisfies Route[];
