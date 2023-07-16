import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesUserViewComponent } from './challenges-user-view.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { UserPopoverModule } from '../user-popover/user-popover.module';


@NgModule({
  declarations: [
    ChallengesUserViewComponent
  ],
  imports: [
    CommonModule,
    CorePipesModule,
    UserPopoverModule,
  ],
  exports: [
    ChallengesUserViewComponent,
  ]
})
export class ChallengesUserViewModule { }
