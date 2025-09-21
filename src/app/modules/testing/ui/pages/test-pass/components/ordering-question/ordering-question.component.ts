import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-ordering-question',
  standalone: true,
  imports: [CommonModule, DragulaModule, MathjaxModule],
  templateUrl: './ordering-question.component.html',
})
export class OrderingQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
  @Input({ required: true }) orderingList: string[] = [];
}
