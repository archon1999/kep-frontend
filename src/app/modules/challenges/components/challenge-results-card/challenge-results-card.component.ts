import { Component, Input } from '@angular/core';
import { Challenge } from '@challenges/models';
import { CoreCommonModule } from '@core/common.module';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'challenge-results-card',
  templateUrl: './challenge-results-card.component.html',
  styleUrls: ['./challenge-results-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewComponent,
    KepCardComponent,
  ]
})
export class ChallengeResultsCardComponent {
  @Input() challenge: Challenge;
}
