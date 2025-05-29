import { Component, Input } from '@angular/core';
import { Tournament } from "@tournaments/domain";
import { DuelCardComponent } from "@tournaments/ui/components/duel-card/duel-card.component";

@Component({
  selector: 'tournament-duels',
  templateUrl: './tournament-duels.component.html',
  standalone: true,
  imports: [
    DuelCardComponent
  ]
})
export class TournamentDuelsComponent {
  @Input() tournament: Tournament;
}
