import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../../tournaments.models';

@Component({
  selector: 'tournament-duels',
  templateUrl: './tournament-duels.component.html',
  styleUrls: ['./tournament-duels.component.scss'],
  standalone: false,
})
export class TournamentDuelsComponent implements OnInit {

  @Input() tournament: Tournament;

  constructor() { }

  ngOnInit(): void {
  }

}
