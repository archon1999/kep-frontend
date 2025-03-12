import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../../tournaments.models';
import { BaseUserComponent } from '@app/common';

@Component({
  selector: 'tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss'],
  standalone: false
})
export class TournamentInfoComponent extends BaseUserComponent {
  @Input() tournament: Tournament;
}
