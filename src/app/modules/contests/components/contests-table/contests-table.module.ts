import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContestsTableComponent } from "./contests-table.component";
import { ContestStandingsPopoverComponent } from "./contest-standings-popover/contest-standings-popover.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { CorePipesModule } from "../../../../../@core/pipes/pipes.module";
import { CoreDirectivesModule } from "../../../../../@core/directives/directives";
import { ContestantViewModule } from "../../../../shared/components/contestant-view/contestant-view.module";
import { CountUpModule } from "ngx-countup";

@NgModule({
  declarations: [
    ContestsTableComponent,
    ContestStandingsPopoverComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    NgbPopoverModule,
    CorePipesModule,
    CoreDirectivesModule,
    ContestantViewModule,
    CountUpModule,
  ],
  exports: [    
    ContestsTableComponent,
    ContestStandingsPopoverComponent,
  ]
})
export class ContestsTableModule {}
