import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CountdownModule } from '@ciri/ngx-countdown';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbDatepickerModule, NgbNavModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AttemptsTableModule } from '../../../problems/components/attempts-table/attempts-table.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CodeEditorModule } from '../../../../shared/components/code-editor/code-editor.module';
import { ContestantViewModule } from '../../../../shared/components/contestant-view/contestant-view.module';
import { MathjaxModule } from '../../../../shared/third-part-modules/mathjax/mathjax.module';
import { NgSelectModule } from '../../../../shared/third-part-modules/ng-select/ng-select.module';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ProblemBodyModule } from '../../../problems/components/problem-body/problem-body.module';
import { ContestCreateComponent } from './contest-create/contest-create.component';
import { ContestEditComponent } from './contest-edit/contest-edit.component';
import { ContestAttemptsComponent } from './contest/contest-attempts/contest-attempts.component';
import { ContestCardCountdownComponent } from './contest/contest-card-countdown/contest-card-countdown.component';
import { ContestCardComponent } from './contest/contest-card/contest-card.component';
import { ContestCountdownComponent } from './contest/contest-countdown/contest-countdown.component';
import { ContestProblemComponent } from './contest/contest-problem/contest-problem.component';
import { ContestProblemsComponent } from './contest/contest-problems/contest-problems.component';
import { ContestStandingsComponent } from './contest/contest-standings/contest-standings.component';
import { ContestTabComponent } from './contest/contest-tab/contest-tab.component';
import { ContestComponent } from './contest/contest.component';
import { ContestsTableComponent } from './contests-table/contests-table.component';
import { UserContestsComponent } from './user-contests.component';
import { ContestCreateGuard, ContestGuard } from './user-contests.guard';
import { ContestProblemResolver, ContestProblemsResolver, ContestResolver } from './user-contests.resolver';
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
    AttemptsTableModule,
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
