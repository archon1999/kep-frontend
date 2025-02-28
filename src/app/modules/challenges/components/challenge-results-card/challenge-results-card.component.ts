import { Component, Input } from '@angular/core';
import { Challenge } from '@challenges/models';
import { CoreCommonModule } from '@core/common.module';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'challenge-results-card',
  templateUrl: './challenge-results-card.component.html',
  styleUrls: ['./challenge-results-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewComponent,
  ]
})
export class ChallengeResultsCardComponent {
  @Input() challenge: Challenge;
}
