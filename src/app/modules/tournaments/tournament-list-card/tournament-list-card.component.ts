import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../tournaments.models';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'tournament-list-card',
  templateUrl: './tournament-list-card.component.html',
  styleUrls: ['./tournament-list-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class TournamentListCardComponent {
  @Input() tournament: Tournament;
}
