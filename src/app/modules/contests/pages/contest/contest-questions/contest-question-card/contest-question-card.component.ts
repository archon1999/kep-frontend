import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ContestQuestion } from '@contests/models/contest-question';
import { Contest } from '@contests/models/contest';

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
