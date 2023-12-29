import { Component, Input } from '@angular/core';
import { Contest, ContestQuestion } from '@contests/contests.models';
import { CoreCommonModule } from '@core/common.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';

@Component({
  selector: 'contest-question-card',
  standalone: true,
  imports: [CoreCommonModule, MathjaxModule],
  templateUrl: './contest-question-card.component.html',
  styleUrl: './contest-question-card.component.scss'
})
export class ContestQuestionCardComponent {
  @Input() contest: Contest;
  @Input() question: ContestQuestion;
}
