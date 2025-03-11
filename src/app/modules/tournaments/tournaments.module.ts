import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsComponent } from './tournaments.component';
import { TournamentComponent } from './tournament/tournament.component';
import { TournamentBracketComponent } from './tournament/tournament-bracket/tournament-bracket.component';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TournamentResolver } from './tournaments.resolver';
import { TournamentDuelsComponent } from './tournament/tournament-duels/tournament-duels.component';
import { TournamentScheduleComponent } from './tournament/tournament-schedule/tournament-schedule.component';
import { TournamentInfoComponent } from './tournament/tournament-info/tournament-info.component';
import { DuelCardComponent } from './tournament/tournament-duels/duel-card/duel-card.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentListCardComponent } from './tournament-list-card/tournament-list-card.component';
import { TournamentVersusComponent } from './tournament/tournament-versus/tournament-versus.component';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';


const routes: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    title: 'Tournaments.Tournaments',
  },
  {
    path: 'tournament/:id',
    component: TournamentComponent,
    resolve: {
      tournament: TournamentResolver,
    },
    data: {
      title: 'Tournaments.Tournament',
    }
  },
  {
    path: 'tournament/:id/versus',
    component: TournamentVersusComponent,
    resolve: {
      tournament: TournamentResolver,
    },
    data: {
      title: 'Tournaments.Tournament',
    }
  }
];

@NgModule({
  declarations: [
    TournamentComponent,
    TournamentBracketComponent,
    TournamentDuelsComponent,
    TournamentScheduleComponent,
    TournamentInfoComponent,
    DuelCardComponent,
    TournamentVersusComponent,
  ],
  imports: [
    TournamentListCardComponent,
    CommonModule,
    RouterModule.forChild(routes),
    NgbNavModule,
    ContestantViewModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    NgbTooltipModule,
    ContentHeaderModule,
    KepIconComponent,
    TournamentsComponent,
    KepCardComponent,
    UserPopoverModule,
  ],
  providers: [
    TournamentResolver,
  ]
})
export class TournamentsModule {}
