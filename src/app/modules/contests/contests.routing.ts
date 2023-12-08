import { Route } from '@angular/router';
import { ContestsComponent } from '@contests/pages/contests/contests.component';
import { RatingComponent } from '@contests/pages/rating/rating.component';
import { ProfileComponent } from '@contests/pages/profile/profile.component';
import { AuthGuard } from '@auth/helpers';
import { ContestComponent } from '@contests/pages/contest/contest.component';
import { ContestProblemResolver, ContestProblemsResolver, ContestResolver } from '@contests/contests.resolver';
import { ContestProblemsComponent } from '@contests/pages/contest/contest-problems/contest-problems.component';
import { ContestGuard } from '@contests/contests.guard';
import { ContestQuestionsComponent } from '@contests/pages/contest/contest-questions/contest-questions.component';
import { ContestProblemComponent } from '@contests/pages/contest/contest-problem/contest-problem.component';
import { ContestAttemptsComponent } from '@contests/pages/contest/contest-attempts/contest-attempts.component';
import { ContestStandingsComponent } from '@contests/pages/contest/contest-standings/contest-standings.component';
import { ContestRatingChangesComponent } from '@contests/pages/contest/contest-rating-changes/contest-rating-changes.component';
import { ContestOgImageComponent } from '@contests/pages/contest/contest-og-image/contest-og-image.component';

export default [
  {
    path: '',
    component: ContestsComponent,
    title: 'Contests.Contests'
  },
  {
    path: 'rating',
    component: RatingComponent,
    data: { animation: 'contests-rating' },
    title: 'Contests.ContestsRating',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { animation: 'contests-profile' },
    canActivate: [AuthGuard],
    title: 'Contests.ContestsProfile',
  },
  {
    path: 'contest/:id',
    component: ContestComponent,
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
    component: ContestProblemsComponent,
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
    component: ContestQuestionsComponent,
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
    component: ContestProblemComponent,
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
    component: ContestAttemptsComponent,
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
    component: ContestStandingsComponent,
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
    path: 'contest/:id/rating-changes',
    component: ContestRatingChangesComponent,
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
    component: ContestOgImageComponent,
    resolve: {
      contest: ContestResolver,
    },
  },
  {
    path: 'user-contests',
    loadChildren: () => import('./pages/user-contests/user-contests.module').then(m => m.UserContestsModule)
  },
]  satisfies Route[];
