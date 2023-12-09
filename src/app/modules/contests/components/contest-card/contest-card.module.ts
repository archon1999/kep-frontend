import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ContestCardSmallComponent } from './contest-card-small/contest-card-small.component';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ContestStandingsCountdownComponent
} from '@contests/pages/contest/contest-standings/contest-standings-countdown/contest-standings-countdown.component';
import { ContestCardCountdownComponent } from './contest-card-countdown/contest-card-countdown.component';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { ContestCountdownComponent } from '@contests/components/contest-card/contest-card/contest-countdown/contest-countdown.component';

@NgModule({
  declarations: [
    ContestCardSmallComponent,
    ContestStandingsCountdownComponent,
    ContestCardCountdownComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    CorePipesModule,
    CoreDirectivesModule,
    KepcoinSpendSwalModule,
    NgbTooltipModule,
    ContestantViewModule,
    CountdownComponent,
    ContestCountdownComponent
  ],
  exports: [
    ContestCardSmallComponent,
    ContestStandingsCountdownComponent,
    ContestCardCountdownComponent,
  ]
})
export class ContestCardModule {
}
