import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TestPassQuestion } from '../../test-pass-question.type';

@Component({
  selector: 'app-single-choice-question',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule],
  templateUrl: './single-choice-question.component.html',
})
export class SingleChoiceQuestionComponent {
  @Input({ required: true }) question!: TestPassQuestion;

  private _selectedOption = -1;

  @Input()
  set selectedOption(value: number | null) {
    this._selectedOption = value ?? -1;
  }

  get selectedOption(): number {
    return this._selectedOption;
  }

  @Output() readonly selectedOptionChange = new EventEmitter<number>();

  onSelectionChange(value: number) {
    this._selectedOption = value;
    this.selectedOptionChange.emit(value);
  }
}
