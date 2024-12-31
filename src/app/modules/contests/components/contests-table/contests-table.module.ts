import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContestsTableComponent } from './contests-table.component';
import { ContestStandingsPopoverComponent } from './contest-standings-popover/contest-standings-popover.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { CountUpModule } from 'ngx-countup';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';

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
    KepPaginationComponent,
    ContestClassesPipe,
    KepTableComponent,
  ],
  exports: [    
    ContestsTableComponent,
    ContestStandingsPopoverComponent,
  ]
})
export class ContestsTableModule {}
