import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-text-input-question',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule],
  templateUrl: './text-input-question.component.html',
})
export class TextInputQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
}
