import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DuelsComponent } from './pages/duels/duels.component';
import { DuelComponent } from './pages/duel/duel.component';
import { DuelResolver } from './duels.resolver';
import { DuelCountdownComponent } from './components/duel-countdown/duel-countdown.component';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { ProblemListCardComponent } from './components/problem-list-card/problem-list-card.component';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';


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
    // CountdownModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    ContestantViewModule,
    ProblemBodyComponent,
    CodeEditorModule,
    AttemptsTableModule,
    NgbTooltipModule,
    CountdownComponent,
  ],
  providers: [
    DuelResolver,
  ]
})
export class DuelsModule {}
