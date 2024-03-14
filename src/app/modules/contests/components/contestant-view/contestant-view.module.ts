import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestantViewComponent } from './contestant-view.component';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ContestsRatingImageComponent } from './contests-rating-image/contests-rating-image.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';


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
    TranslateModule,
    KepIconComponent,
  ],
  exports: [
    ContestantViewComponent,
    ContestsRatingImageComponent,
  ]
})
export class ContestantViewModule {}
