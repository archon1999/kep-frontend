import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesUserViewComponent } from './challenges-user-view.component';
import { CorePipesModule } from '../../../../../@core/pipes/pipes.module';
import { UserPopoverModule } from '../../../../shared/components/user-popover/user-popover.module';
import { ChallengesRankBadgeComponent } from './challenges-rank-badge/challenges-rank-badge.component';


@NgModule({
  declarations: [
    ChallengesUserViewComponent,
    ChallengesRankBadgeComponent
  ],
  imports: [
    CommonModule,
    CorePipesModule,
    UserPopoverModule,
  ],
  exports: [
    ChallengesUserViewComponent,
    ChallengesRankBadgeComponent,
  ]
})
export class ChallengesUserViewModule { }
