import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../../tournaments.models';

@Component({
  selector: 'tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss'],
  standalone: false,
})
export class TournamentScheduleComponent implements OnInit {

  @Input() tournament: Tournament;

  constructor() { }

  ngOnInit(): void {
  }

}
