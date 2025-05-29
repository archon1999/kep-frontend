import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TournamentsService } from '../../../data-access/tournaments.service';
import { Tournament } from '../../../domain/entities/tournament.entity';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';

@Component({
  selector: 'app-tournament-duels',
  templateUrl: './tournament-duels.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContentHeaderModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    KepCardComponent,
    UserPopoverModule
  ]
})
export class TournamentDuelsPage extends BaseLoadComponent<Tournament> implements OnInit {
  public tournament: Tournament;
  protected tournamentsService = inject(TournamentsService);
  protected route = inject(ActivatedRoute);

  getData() {
    const id = this.route.snapshot.params['id'];
    return this.tournamentsService.getTournament(id);
  }

  afterLoadData(tournament: Tournament) {
    this.tournament = tournament;
    this.titleService.updateTitle(this.route, { tournamentTitle: tournament.title });
  }
} 