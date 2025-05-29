import { Component, Input } from '@angular/core';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TranslatePipe } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { Tournament } from "@tournaments/domain";

@Component({
  selector: 'tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    TranslatePipe,
    DatePipe
  ]
})
export class TournamentScheduleComponent {
  @Input() tournament: Tournament;
}
