import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgSelectModule } from '../../shared/third-part-modules/ng-select/ng-select.module';

import { AuthGuard } from 'app/auth/helpers';
import { CountUpModule } from 'ngx-countup';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ClipboardModule } from '../../shared/components/clipboard/clipboard.module';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { ProblemBodyModule } from '../problems/elements/problem-body/problem-body.module';
import { MathjaxModule } from '../../shared/third-part-modules/mathjax/mathjax.module';
import { ContestGuard } from './contests.guard';
import { ContestProblemResolver, ContestProblemsResolver, ContestResolver, OngoingContestsResolver, UpcomingContestsResolver } from './contests.resolver';
import { ContestAttemptsTableComponent } from './pages/contest/contest-attempts/contest-attempts-table/contest-attempts-table.component';
import { ContestAttemptsComponent } from './pages/contest/contest-attempts/contest-attempts.component';
import { ContestOgImageComponent } from './pages/contest/contest-og-image/contest-og-image.component';
import { ContestProblemComponent } from './pages/contest/contest-problem/contest-problem.component';
import { ContestProblemsComponent } from './pages/contest/contest-problems/contest-problems.component';
import { ContestQuestionsComponent } from './pages/contest/contest-questions/contest-questions.component';
import { ContestRatingChangesComponent } from './pages/contest/contest-rating-changes/contest-rating-changes.component';
import { ContestStandingsComponent } from './pages/contest/contest-standings/contest-standings.component';
import { ContestTabComponent } from './pages/contest/contest-tab/contest-tab.component';
import { ContestComponent } from './pages/contest/contest.component';
import { ContestsTabComponent } from './pages/contests/contests-tab/contests-tab.component';
import { ContestsComponent } from './pages/contests/contests.component';
import { ContestsSectionCategoriesComponent } from './pages/contests/sections/contests-section-categories/contests-section-categories.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RatingComponent } from './pages/rating/rating.component';
import { ContestsTableModule } from './elements/contests-table/contests-table.module';
import { ContestCardModule } from './elements/contest-card/contest-card.module';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';


const routes: Routes = [
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
];


@NgModule({
  declarations: [
    ContestsComponent,
    ContestComponent,
    RatingComponent,
    ProfileComponent,
    ContestTabComponent,
    ContestsTabComponent,
    ContestsSectionCategoriesComponent,
    ContestOgImageComponent,
    ContestRatingChangesComponent,
    ContestStandingsComponent,
    ContestAttemptsComponent,
    ContestProblemComponent,
    ContestQuestionsComponent,
    ContestProblemsComponent,
    ContestAttemptsTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreDirectivesModule,
    CorePipesModule,
    TranslateModule,
    ContentHeaderModule,
    CorePipesModule,
    NgbNavModule,
    ContestsTableModule,
    ContestCardModule,
    ContestantViewModule,
    NgbTooltipModule,
    NgbPaginationModule,
    FormsModule,
    NgSelectModule,
    NgbDropdownModule,
    MathjaxModule,
    ClipboardModule,
    CodeEditorModule,
    MonacoEditorModule,
    MathjaxModule,
    UserPopoverModule,
    CountUpModule,
    NgxUsefulSwiperModule,
    NgbPopoverModule,
    ProblemBodyModule,
  ],
  providers: [
    ContestGuard,
    ContestProblemResolver,
    ContestProblemsResolver,
    ContestResolver,
    OngoingContestsResolver,
    UpcomingContestsResolver
  ]
})
export class ContestsModule { }
