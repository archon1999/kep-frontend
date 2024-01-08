import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChallengesComponent } from './pages/challenges/challenges.component';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ChallengesUserViewModule } from './components/challenges-user-view/challenges-user-view.module';
import { ChallengeCallCardComponent } from './components/challenge-call-card/challenge-call-card.component';
import { ChallengeCardComponent } from './components/challenge-card/challenge-card.component';
import { NewChallengeButtonComponent } from './components/new-challenge-button/new-challenge-button.component';
import { NouisliderModule } from '@shared/third-part-modules/nouislider/nouislider.module';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { ChallengeResolver } from './challenges.resolver';
import { SweetAlertModule } from '@shared/third-part-modules/sweet-alert/sweet-alert.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ChallengeResultsCardComponent } from './components/challenge-results-card/challenge-results-card.component';
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ChallengesRatingComponent } from './pages/challenges-rating/challenges-rating.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ChallengesProfileComponent } from './pages/challenges-profile/challenges-profile.component';
import { AuthGuard } from '@auth/helpers';
import { SectionProfileComponent } from './pages/challenges-profile/section-profile/section-profile.component';
import { SectionRatingChangesComponent } from './pages/challenges-profile/section-rating-changes/section-rating-changes.component';
import { SectionLastChallengesComponent } from './pages/challenges-profile/section-last-challenges/section-last-challenges.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';


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
  },
  {
    path: 'rating',
    component: ChallengesRatingComponent,
    title: 'Challenges.ChallengesRating',
  },
  {
    path: 'profile',
    component: ChallengesProfileComponent,
    title: 'Challenges.ChallengesProfile',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    ChallengesComponent,
    ChallengeCallCardComponent,
    ChallengeCardComponent,
    NewChallengeButtonComponent,
    ChallengeComponent,
    ChallengeResultsCardComponent,
    ChallengesProfileComponent,
    SectionProfileComponent,
    SectionRatingChangesComponent,
    SectionLastChallengesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CorePipesModule,
    ChallengesRatingComponent,
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
    MonacoEditorComponent,
    DragulaModule.forRoot(),
    MathjaxModule,
    NgxSkeletonLoaderModule.forRoot(),
    KepPaginationComponent,
    ContentHeaderModule,
    ContestantViewModule,
    ApexChartModule,
    CountdownComponent,
    SpinnerComponent,
    KepIconComponent,
    ResourceByIdPipe,
  ],
  providers: [ChallengeResolver],
  exports: [
    SectionProfileComponent
  ]
})
export class ChallengesModule {
}
