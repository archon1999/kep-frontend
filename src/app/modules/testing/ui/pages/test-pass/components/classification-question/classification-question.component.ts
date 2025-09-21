import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ClassificationGroup } from '../../answers';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-classification-question',
  standalone: true,
  imports: [CommonModule, DragulaModule, MathjaxModule],
  templateUrl: './classification-question.component.html',
})
export class ClassificationQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
  @Input({ required: true }) classificationGroups: ClassificationGroup[] = [];
}
