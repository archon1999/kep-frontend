import { Component, Input } from '@angular/core';
import { Tournament } from '../tournaments.models';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'tournament-list-card',
  templateUrl: './tournament-list-card.component.html',
  styleUrls: ['./tournament-list-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent]
})
export class TournamentListCardComponent {
  @Input() tournament: Tournament;
}
