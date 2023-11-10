import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CodeRushComponent } from './pages/code-rush/code-rush.component';
import { CodeRushResolver } from './code-rush.resolver';
import { CodeRushCountdownComponent } from './components/code-rush-countdown/code-rush-countdown.component';
import { CountdownModule } from '@ciri/ngx-countdown';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';
import { ProblemBodyModule } from '../problems/components/problem-body/problem-body.module';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AttemptsTableModule } from '../problems/components/attempts-table/attempts-table.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CodeRushResultsTableComponent } from './components/code-rush-results-table/code-rush-results-table.component';


const routes: Routes = [
  {
    path: ':id',
    component: CodeRushComponent,
    data: {
      title: 'CodeRush.CodeRush',
    },
    resolve: {
      codeRush: CodeRushResolver,
    }
  }
];

@NgModule({
  declarations: [
    CodeRushComponent,
    CodeRushCountdownComponent,
    CodeRushResultsTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // CountdownModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    ContestantViewModule,
    ProblemBodyModule,
    CodeEditorModule,
    AttemptsTableModule,
    NgbTooltipModule,
    ContentHeaderModule,
  ],
  providers: [
    CodeRushResolver,
  ]
})
export class CodeRushModule { }
