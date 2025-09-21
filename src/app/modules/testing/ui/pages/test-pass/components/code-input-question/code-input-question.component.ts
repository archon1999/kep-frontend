import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-code-input-question',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, MonacoEditorComponent],
  templateUrl: './code-input-question.component.html',
})
export class CodeInputQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;
}
