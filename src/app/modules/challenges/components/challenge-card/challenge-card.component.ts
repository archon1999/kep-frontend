import { Component, Input } from '@angular/core';
import { Challenge } from '@challenges/models/challenges.models';
import { CoreCommonModule } from '@core/common.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewModule,
    NgbTooltipModule,
  ]
})
export class ChallengeCardComponent {
  @Input() challenge: Challenge;
}
