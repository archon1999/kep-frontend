import { Routes } from '@angular/router';
import { ProblemsComponent } from '@problems/pages/problems/problems.component';
import { ContestsResolver, ProblemResolver, StudyPlanResolver, StudyPlansResolver } from '@problems/problems.resolver';
import { StudyPlanComponent } from '@problems/pages/study-plan/study-plan.component';
import { ProblemComponent } from '@problems/pages/problem/problem.component';
import { AttemptGuard, ProblemGuard } from '@problems/problems.guard';
import { ProblemOgImageComponent } from '@problems/pages/problem/problem-og-image/problem-og-image.component';
import { AttemptsComponent } from '@problems/pages/attempts/attempts.component';
import { AttemptComponent } from '@problems/pages/attempt/attempt.component';
import { ProfileComponent } from '@problems/pages/profile/profile.component';
import { AuthGuard } from '@auth/helpers';
import { RatingComponent } from '@problems/pages/rating/rating.component';
import { RatingHistoryComponent } from '@problems/pages/rating/rating-history/rating-history.component';
import { HackAttemptsComponent } from '@problems/pages/hack-attempts/hack-attempts.component';

export const routes: Routes = [
  {
    path: '',
    component: ProblemsComponent,
    title: 'Problems.Problems',
    resolve: {
      contests: ContestsResolver,
      studyPlans: StudyPlansResolver,
    }
  },
  {
    path: 'study-plan/:id',
    component: StudyPlanComponent,
    data: {
      title: 'Problems.StudyPlan',
    },
    resolve: {
      studyPlan: StudyPlanResolver,
    }
  },
  {
    path: 'problem/:id',
    component: ProblemComponent,
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
    component: ProblemComponent,
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
    component: ProblemComponent,
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
    component: ProblemOgImageComponent,
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'attempts',
    component: AttemptsComponent,
    data: { animation: 'attempts' },
    title: 'Problems.Attempts',
  },
  {
    path: 'attempts/:id',
    component: AttemptComponent,
    data: { animation: 'attempt', title: 'Problems.Attempt' },
    canActivate: [AttemptGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Problems.Profile',
    data: { animation: 'profile' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rating',
    component: RatingComponent,
    title: 'Problems.Rating',
    data: { animation: 'problems-rating' }
  },
  {
    path: 'rating/history',
    component: RatingHistoryComponent,
    title: 'Problems.RatingHistory',
    data: { animation: 'problems-rating-history' }
  },
  {
    path: 'hacks',
    component: HackAttemptsComponent,
    data: { animation: 'hack-attempts' },
    title: 'Problems.HackAttempts',
  },
];
