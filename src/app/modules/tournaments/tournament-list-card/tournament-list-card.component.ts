import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../tournaments.models';

@Component({
  selector: 'tournament-list-card',
  templateUrl: './tournament-list-card.component.html',
  styleUrls: ['./tournament-list-card.component.scss']
})
export class TournamentListCardComponent implements OnInit {

  @Input() tournament: Tournament;

  constructor() { }

  ngOnInit(): void {
  }

}
