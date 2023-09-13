import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestantViewComponent } from './contestant-view.component';
import { UserPopoverModule } from '../user-popover/user-popover.module';
import { ContestsRatingImageComponent } from './contests-rating-image/contests-rating-image.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsPipesModule } from '../../../modules/problems/pipes/problems-pipes.module';


@NgModule({
  declarations: [
    ContestantViewComponent,
    ContestsRatingImageComponent
  ],
  imports: [
    CommonModule,
    UserPopoverModule,
    NgbTooltipModule,
    ProblemsPipesModule,
  ],
  exports: [
    ContestantViewComponent,
    ContestsRatingImageComponent,
  ]
})
export class ContestantViewModule { }
