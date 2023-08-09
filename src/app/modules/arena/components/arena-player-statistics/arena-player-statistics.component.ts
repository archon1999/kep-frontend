import { Component, Input, OnInit } from '@angular/core';
import { ArenaPlayerStatistics } from '../../arena.models';

@Component({
  selector: 'arena-player-statistics',
  templateUrl: './arena-player-statistics.component.html',
  styleUrls: ['./arena-player-statistics.component.scss']
})
export class ArenaPlayerStatisticsComponent implements OnInit {

  @Input() statistics: ArenaPlayerStatistics;
  @Input() withOpponents = true;

  constructor() { }

  ngOnInit(): void {
  }

}
