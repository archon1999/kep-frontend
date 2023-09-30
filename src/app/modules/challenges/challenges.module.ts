import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChallengesComponent } from './pages/challenges/challenges.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '../../shared/third-part-modules/ng-select/ng-select.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { ChallengesUserViewModule } from './components/challenges-user-view/challenges-user-view.module';
import { ChallengeCallCardComponent } from './components/challenge-call-card/challenge-call-card.component';
import { ChallengeCardComponent } from './components/challenge-card/challenge-card.component';
import { NewChallengeButtonComponent } from './components/new-challenge-button/new-challenge-button.component';
import { NouisliderModule } from '../../shared/third-part-modules/nouislider/nouislider.module';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { ChallengeResolver } from './challenges.resolver';
import { SweetAlertModule } from '../../shared/third-part-modules/sweet-alert/sweet-alert.module';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ChallengeResultsCardComponent } from './components/challenge-results-card/challenge-results-card.component';
import { CountdownModule } from '@ciri/ngx-countdown'
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '../../shared/third-part-modules/mathjax/mathjax.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';


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
    NgxSkeletonLoaderModule.forRoot(),
    PaginationModule,
  ],
  providers: [ChallengeResolver],
})
export class ChallengesModule { }
