import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChallengesComponent } from './challenges.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '../third-part-modules/ng-select/ng-select.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '../elements/user-popover/user-popover.module';
import { ChallengesUserViewModule } from '../elements/challenges-user-view/challenges-user-view.module';
import { ChallengeCallCardComponent } from './challenge-call-card/challenge-call-card.component';
import { ChallengeCardComponent } from './challenge-card/challenge-card.component';
import { NewChallengeButtonComponent } from './new-challenge-button/new-challenge-button.component';
import { NouisliderModule } from '../third-part-modules/nouislider/nouislider.module';
import { ChallengeComponent } from './challenge/challenge.component';
import { ChallengeResolver } from './challenges.resolver';
import { SweetAlertModule } from '../third-part-modules/sweet-alert/sweet-alert.module';
import { CodeEditorModule } from '../elements/code-editor/code-editor.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ChallengeResultsCardComponent } from './challenge/challenge-results-card/challenge-results-card.component';
import { CountdownModule } from '@ciri/ngx-countdown'
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '../third-part-modules/mathjax/mathjax.module';


const routes: Routes = [
  {
    path: '',
    component: ChallengesComponent,
    title: 'Challenges.Challenges',
  },
  {
    path: 'challenge/:id',
    component: ChallengeComponent,
    data: { title: 'Challenges.Challenge' },
    resolve: {
      challenge: ChallengeResolver,
    }
  }
];

@NgModule({
  declarations: [
    ChallengesComponent,
    ChallengeCallCardComponent,
    ChallengeCardComponent,
    NewChallengeButtonComponent,
    ChallengeComponent,
    ChallengeResultsCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    NgbTooltipModule,
    UserPopoverModule,
    ChallengesUserViewModule,
    NouisliderModule,
    SweetAlertModule,
    CodeEditorModule,
    MonacoEditorModule,
    CountdownModule,
    DragulaModule.forRoot(),
    MathjaxModule,
  ],
  providers: [ChallengeResolver],
})
export class ChallengesModule { }
