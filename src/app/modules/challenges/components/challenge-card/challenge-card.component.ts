import { Component, Input } from '@angular/core';
import { Challenge } from '@challenges/models/challenges.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ChallengesUserViewComponent,
  ]
})
export class ChallengeCardComponent {
  @Input() challenge: Challenge;
}
