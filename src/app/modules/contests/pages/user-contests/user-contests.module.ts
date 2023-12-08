import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from 'core/directives/directives';
import { CorePipesModule } from 'core/pipes/pipes.module';
import { NgbDatepickerModule, NgbNavModule, NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ProblemBodyModule } from '@problems/components/problem-body/problem-body.module';
import { ContestCreateComponent } from './contest-create/contest-create.component';
import { ContestEditComponent } from './contest-edit/contest-edit.component';
import { UserContestsComponent } from './user-contests.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { ContestsTableModule } from '@contests/components/contests-table/contests-table.module';
import { ContestCreateGuard } from '@contests/contests.guard';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';

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
];

@NgModule({
  declarations: [
    UserContestsComponent,
    ContestCreateComponent,
    ContestEditComponent,
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
    MathjaxModule,
    CodeEditorModule,
    ContestantViewModule,
    ProblemBodyModule,
    AttemptsTableModule,
    NgbTooltipModule,
    MonacoEditorComponent,
    ContestsTableModule,
    KepPaginationComponent,
    KepTableComponent,
    EmptyResultComponent,
  ],
  providers: []
})
export class UserContestsModule {
}
