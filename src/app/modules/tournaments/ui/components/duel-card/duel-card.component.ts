import { Component, Input } from '@angular/core';
import { ContestantViewModule } from "@contests/components/contestant-view/contestant-view.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { RouterLink } from "@angular/router";
import { Duel } from "@duels/domain/entities";
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'duel-card',
  templateUrl: './duel-card.component.html',
  styleUrls: ['./duel-card.component.scss'],
  standalone: true,
  imports: [
    ContestantViewModule,
    KepCardComponent,
    RouterLink,
    ResourceByIdPipe
  ]
})
export class DuelCardComponent {
  @Input() duel: Duel;
  protected readonly Resources = Resources;
}
