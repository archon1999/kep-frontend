import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-multiple-choice-question',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule],
  templateUrl: './multiple-choice-question.component.html',
})
export class MultipleChoiceQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
}
