import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'new-challenge-button',
  templateUrl: './new-challenge-button.component.html',
  styleUrls: ['./new-challenge-button.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
  ]
})
export class NewChallengeButtonComponent {
  @Input() timeSeconds: number;
  @Input() questionsCount: number;
}
