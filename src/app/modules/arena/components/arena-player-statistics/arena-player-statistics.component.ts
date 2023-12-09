import { Component, Input, OnInit } from '@angular/core';
import { ArenaPlayerStatistics } from '../../arena.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';

@Component({
  selector: 'arena-player-statistics',
  templateUrl: './arena-player-statistics.component.html',
  styleUrls: ['./arena-player-statistics.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ChallengesUserViewModule,
  ]
})
export class ArenaPlayerStatisticsComponent {
  @Input() statistics: ArenaPlayerStatistics;
  @Input() withOpponents = true;
}
