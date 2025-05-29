import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Tournament } from "@app/modules/tournaments/domain";

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
