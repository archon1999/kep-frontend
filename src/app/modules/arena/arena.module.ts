import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ArenaComponent } from './arena.component';
import { ArenaTournamentComponent } from './arena-tournament/arena-tournament.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ArenaResolver } from './arena.resolver';
import { ArenaListCardComponent } from './components/arena-list-card/arena-list-card.component';
import { CountdownModule } from '@ciri/ngx-countdown';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ChallengesUserViewModule } from '../../shared/components/challenges-user-view/challenges-user-view.module';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ArenaPlayerStatisticsComponent } from './components/arena-player-statistics/arena-player-statistics.component';
import { PaginationModule } from 'app/shared/components/pagination/pagination.module';

const routes: Routes = [
  {
    path: '',
    component: ArenaComponent,
    title: 'Arena.Arena',
  },
  {
    path: 'tournament/:id',
    component: ArenaTournamentComponent,
    resolve: {
      arena: ArenaResolver,
    },
    data: {
      title: 'Arena.Tournament'
    }
  }
];

@NgModule({
  declarations: [
    ArenaComponent,
    ArenaTournamentComponent,
    ArenaListCardComponent,
    ArenaPlayerStatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    NgbTooltipModule,
    CountdownModule,
    ContentHeaderModule,
    ChallengesUserViewModule,
    NgbAlertModule,
    UserPopoverModule,
    PaginationModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [ArenaResolver]
})
export class ArenaModule { }
