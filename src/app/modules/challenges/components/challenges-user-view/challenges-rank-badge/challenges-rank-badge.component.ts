import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'challenges-rank-badge',
  templateUrl: './challenges-rank-badge.component.html',
  styleUrls: ['./challenges-rank-badge.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
  ]
})
export class ChallengesRankBadgeComponent {
  @Input() title: string;
  @Input() rating?: number;
}
