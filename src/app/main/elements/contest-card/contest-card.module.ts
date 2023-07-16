import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CountdownModule } from '@ciri/ngx-countdown'
import { UserPopoverModule } from '../user-popover/user-popover.module';
import { ContestCardComponent } from './contest-card.component';
import { ContestCardSmallComponent } from './contest-card-small/contest-card-small.component';
import { RouterModule } from '@angular/router';
import { ContestantViewModule } from '../contestant-view/contestant-view.module';
import { KepcoinSpendSwalModule } from 'app/main/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ContestCountdownComponent } from './contest-countdown/contest-countdown.component';
import { ContestStandingsCountdownComponent } from './contest-standings-countdown/contest-standings-countdown.component';
import { ContestCardBigComponent } from './contest-card-big/contest-card-big.component';

@NgModule({
  declarations: [
    ContestCardComponent,
    ContestCardSmallComponent,
    ContestCountdownComponent,
    ContestStandingsCountdownComponent,
    ContestCardBigComponent
  ],
  imports: [
    CommonModule,
    CountdownModule,
    CoreDirectivesModule,
    NgbAccordionModule,
    TranslateModule,
    CorePipesModule,
    NgbTooltipModule,
    UserPopoverModule,
    RouterModule,
    ContestantViewModule,
    KepcoinSpendSwalModule,
    NgbTooltipModule
  ],
  exports: [
    ContestCardComponent,
    ContestCardSmallComponent,
    ContestCountdownComponent,
    ContestStandingsCountdownComponent,
    ContestCardBigComponent,
  ]
})
export class ContestCardModule { }
