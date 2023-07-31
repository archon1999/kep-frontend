import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DuelsComponent } from './duels.component';
import { DuelComponent } from './duel/duel.component';
import { DuelResolver } from './duels.resolver';
import { DuelCountdownComponent } from './duel/duel-countdown/duel-countdown.component';
import { CountdownModule } from '@ciri/ngx-countdown'
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';
import { ProblemBodyModule } from '../problems/elements/problem-body/problem-body.module';
import { ProblemListCardComponent } from './duel/problem-list-card/problem-list-card.component';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AttemptsTableModule } from '../problems/elements/attempts-table/attempts-table.module';


const routes: Routes = [
  {
    path: 'duel/:id',
    component: DuelComponent,
    data: {
      title: 'Duels.Duel',
    },
    resolve: {
      duel: DuelResolver,
    }
  }
];

@NgModule({
  declarations: [
    DuelsComponent,
    DuelComponent,
    DuelCountdownComponent,
    ProblemListCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CountdownModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    ContestantViewModule,
    ProblemBodyModule,
    CodeEditorModule,
    AttemptsTableModule,
    NgbTooltipModule,
  ],
  providers: [
    DuelResolver,
  ]
})
export class DuelsModule { }
