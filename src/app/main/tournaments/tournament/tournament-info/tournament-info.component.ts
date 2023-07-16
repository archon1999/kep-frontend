import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../../tournaments.models';

@Component({
  selector: 'tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss']
})
export class TournamentInfoComponent implements OnInit {

  @Input() tournament: Tournament;

  constructor() {}

  ngOnInit(): void {
  }

}
