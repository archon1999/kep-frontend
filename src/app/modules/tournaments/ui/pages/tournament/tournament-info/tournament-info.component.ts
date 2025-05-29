import { Component, Input } from '@angular/core';
import { BaseUserComponent } from '@app/common';
import { Tournament } from "@tournaments/domain";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TranslatePipe } from "@ngx-translate/core";
import { ContestantViewModule } from "@contests/components/contestant-view/contestant-view.module";
import { NgClass } from "@angular/common";

@Component({
  selector: 'tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss'],
  imports: [
    KepCardComponent,
    TranslatePipe,
    ContestantViewModule,
    NgClass
  ],
  standalone: true
})
export class TournamentInfoComponent extends BaseUserComponent {
  @Input() tournament: Tournament;
}
