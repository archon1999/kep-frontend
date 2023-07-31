import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserContestsComponent } from './user-contests.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ContestsTableComponent } from './contests-table/contests-table.component';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { NgbDatepickerModule, NgbNavModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestCreateComponent } from './contest-create/contest-create.component';
import { ContestEditComponent } from './contest-edit/contest-edit.component';
import { ContestCreateGuard, ContestGuard } from './user-contests.guard';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '../../../../shared/third-part-modules/ng-select/ng-select.module';
import { ContestComponent } from './contest/contest.component';
import { ContestProblemResolver, ContestProblemsResolver, ContestResolver } from './user-contests.resolver';
import { ContestTabComponent } from './contest/contest-tab/contest-tab.component';
import { ContestCardComponent } from './contest/contest-card/contest-card.component';
import { ContestCountdownComponent } from './contest/contest-countdown/contest-countdown.component';
import { CountdownModule } from '@ciri/ngx-countdown'
import { ContestProblemsComponent } from './contest/contest-problems/contest-problems.component';
import { ContestCardCountdownComponent } from './contest/contest-card-countdown/contest-card-countdown.component';
import { ContestProblemComponent } from './contest/contest-problem/contest-problem.component';
import { MathjaxModule } from '../../../../shared/third-part-modules/mathjax/mathjax.module';
import { ContestStandingsComponent } from './contest/contest-standings/contest-standings.component';
import { CodeEditorModule } from '../../../../shared/components/code-editor/code-editor.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ContestAttemptsComponent } from './contest/contest-attempts/contest-attempts.component';
import { ContestAttemptsTableComponent } from './contest/contest-attempts/contest-attempts-table/contest-attempts-table.component';
import { ContestantViewModule } from '../../../../shared/components/contestant-view/contestant-view.module';
import { ProblemBodyModule } from '../../../problems/elements/problem-body/problem-body.module';
const routes: Routes = [
  {
    path: '',
    component: UserContestsComponent,
    data: { animation: 'user-contests' },
    title: 'Contests.MyContests',
  },
  {
    path: 'create',
    component: ContestCreateComponent,
    data: {
      animation: 'user-contest-create',
    },
    title: 'Contests.CreateContest',
    canActivate: [ContestCreateGuard],
  },
  {
    path: 'contest/:contestId',
    component: ContestComponent,
    data: {
      title: 'Contests.Contest',
    },
    resolve: {
      contest: ContestResolver,
    }
  },
  {
    path: 'contest/:contestId/problems',
    component: ContestProblemsComponent,
    data: {
      title: 'Contests.ContestProblems',
    },
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    },
    canActivate: [ContestGuard],
  },
  {
    path: 'contest/:contestId/attempts',
    component: ContestAttemptsComponent,
    data: {
      title: 'Contests.ContestAttempts',
    },
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    },
    canActivate: [ContestGuard],
  },
  {
    path: 'contest/:contestId/problem/:symbol',
    component: ContestProblemComponent,
    data: {
      title: 'Contests.ContestProblem',
    },
    resolve: {
      contest: ContestResolver,
      contestProblem: ContestProblemResolver,
    },
    canActivate: [ContestGuard],
  },
  {
    path: 'contest/:contestId/standings',
    data: {
      animation: 'user-contests-standings',
      title: 'Contests.ContestStandings',
    },
    component: ContestStandingsComponent,
    resolve: {
      contest: ContestResolver,
      contestProblems: ContestProblemsResolver,
    },
    canActivate: [ContestGuard],
  },
];

@NgModule({
  declarations: [
    UserContestsComponent,
    ContestsTableComponent,
    ContestCreateComponent,
    ContestEditComponent,
    ContestComponent,
    ContestTabComponent,
    ContestCardComponent,
    ContestCountdownComponent,
    ContestProblemsComponent,
    ContestCardCountdownComponent,
    ContestProblemComponent,
    ContestStandingsComponent,
    ContestAttemptsComponent,
    ContestAttemptsTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    ContentHeaderModule,
    KepcoinSpendSwalModule,
    NgbNavModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgSelectModule,
    CountdownModule,
    MathjaxModule,
    CodeEditorModule,
    MonacoEditorModule,
    ContestantViewModule,
    ProblemBodyModule,
  ],
  providers: [
    ContestCreateGuard,
    ContestResolver,
    ContestProblemsResolver,
    ContestProblemResolver,
    ContestGuard,
  ]
})
export class UserContestsModule { }
