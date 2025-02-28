import { Component, Input } from '@angular/core';
import { ArenaPlayerStatistics } from '../../arena.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'arena-player-statistics',
  templateUrl: './arena-player-statistics.component.html',
  styleUrls: ['./arena-player-statistics.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ChallengesUserViewComponent,
  ]
})
export class ArenaPlayerStatisticsComponent {
  @Input() statistics: ArenaPlayerStatistics;
  @Input() withOpponents = true;
}
