import { Component, Input, OnInit } from '@angular/core';
import { Duel } from "@app/modules/duels/duels.interfaces";
import { ContestantViewModule } from "@contests/components/contestant-view/contestant-view.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { RouterLink } from "@angular/router";

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
