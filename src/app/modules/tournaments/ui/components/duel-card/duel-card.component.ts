import { Component, Input } from '@angular/core';
import { ContestantViewModule } from "@contests/components/contestant-view/contestant-view.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { RouterLink } from "@angular/router";
import { Duel } from "@duels/domain/entities";

@Component({
  selector: 'duel-card',
  templateUrl: './duel-card.component.html',
  styleUrls: ['./duel-card.component.scss'],
  standalone: true,
  imports: [
    ContestantViewModule,
    KepCardComponent,
    RouterLink
  ]
})
export class DuelCardComponent {
  @Input() duel: Duel;
}
