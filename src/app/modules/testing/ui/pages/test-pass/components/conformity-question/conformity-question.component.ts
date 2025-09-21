import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-conformity-question',
  standalone: true,
  imports: [CommonModule, DragulaModule, MathjaxModule],
  templateUrl: './conformity-question.component.html',
})
export class ConformityQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
  @Input({ required: true }) groupOne: string[] = [];
  @Input({ required: true }) groupTwo: string[] = [];
}
