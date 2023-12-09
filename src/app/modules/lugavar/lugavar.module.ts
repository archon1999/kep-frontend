import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LugavarComponent } from './lugavar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { ClipboardModule } from '../../shared/components/clipboard/clipboard.module';
import { LikeButtonComponent } from './like-button/like-button.component';
import { NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { DailyInterestingFactResolver, DailyQuestionResolver, DailyTrickResolver } from './lugavar.resolver';
import { FormsModule } from '@angular/forms';
import { DictionaryTrainingComponent } from './dictionary-training/dictionary-training.component';


const routes: Routes = [
  {
    path: '',
    component: LugavarComponent,
    resolve: {
      dailyTrick: DailyTrickResolver,
      dailyQuestion: DailyQuestionResolver,
      dailyInterestingFact: DailyInterestingFactResolver,
    },
    title: 'Lugavar',
  }
];

@NgModule({
  declarations: [
    LugavarComponent,
    LikeButtonComponent,
    DictionaryTrainingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CorePipesModule,
    CoreDirectivesModule,
    ClipboardModule,
    NgbProgressbarModule,
    CodeEditorModule,
    NgbPaginationModule,
    NgbTooltipModule,
    FormsModule,
  ],
  providers: [
    DailyQuestionResolver,
    DailyTrickResolver,
    DailyInterestingFactResolver,
  ]
})
export class LugavarModule { }
