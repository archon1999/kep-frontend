import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TournamentsComponent } from './tournaments.component';
import { TournamentComponent } from './tournament/tournament.component';
import { TournamentBracketComponent } from './tournament/tournament-bracket/tournament-bracket.component';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TournamentResolver, TournamentsResolver } from './tournaments.resolver';
import { TournamentDuelsComponent } from './tournament/tournament-duels/tournament-duels.component';
import { TournamentScheduleComponent } from './tournament/tournament-schedule/tournament-schedule.component';
import { TournamentInfoComponent } from './tournament/tournament-info/tournament-info.component';
import { DuelCardComponent } from './tournament/tournament-duels/duel-card/duel-card.component';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentListCardComponent } from './tournament-list-card/tournament-list-card.component';
import { TournamentVersusComponent } from './tournament/tournament-versus/tournament-versus.component';


const routes: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    resolve: {
      tournaments: TournamentsResolver,
    },
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
    TournamentsComponent,
    TournamentComponent,
    TournamentBracketComponent,
    TournamentDuelsComponent,
    TournamentScheduleComponent,
    TournamentInfoComponent,
    DuelCardComponent,
    TournamentListCardComponent,
    TournamentVersusComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbNavModule,
    ContestantViewModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    NgbTooltipModule,
  ],
  providers: [
    TournamentsResolver,
    TournamentResolver,
  ]
})
export class TournamentsModule { }
