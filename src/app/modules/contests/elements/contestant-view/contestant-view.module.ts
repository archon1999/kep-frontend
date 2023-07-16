import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { ContestantViewComponent } from "./contestant-view.component";
import { ContestsRatingImageComponent } from "./contests-rating-image/contests-rating-image.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    ContestantViewComponent,
    ContestsRatingImageComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
    CorePipesModule,
    CoreDirectivesModule,
  ],
  exports: [
    ContestantViewComponent,
    ContestsRatingImageComponent,
  ]
})
export class ContestViewModuleModule { }
