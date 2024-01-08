import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenges.models';
import { CoreCommonModule } from '@core/common.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';

@Component({
  selector: 'challenge-results-card',
  templateUrl: './challenge-results-card.component.html',
  styleUrls: ['./challenge-results-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewModule,
  ]
})
export class ChallengeResultsCardComponent {
  @Input() challenge: Challenge;
}
