import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { TranslateModule } from '@ngx-translate/core';
import { randomShuffle } from '@shared/utils';
import { randomChoice } from '@shared/utils/random';
import { AttemptLangs } from '@problems/constants';

export enum QuestionType {
  SINGLE_ANSWER_CHOICE = 1,
  MULTI_ANSWER_CHOICE = 2,
  ANSWER_INPUT = 3,
  CONFORMITY = 4,
  ORDERING = 5,
  CLASSIFICATION = 6,
  CUSTOM_CHECK = 7,
}

@Component({
  selector: 'question-card',
  standalone: true,
  imports: [
    CoreCommonModule,
    CoreDirectivesModule,
    DragulaModule,
    MathjaxModule,
    MonacoEditorComponent,
    TranslateModule
  ],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() question: any;
  @Output() check = new EventEmitter<any>;

  public singleRadio = 0;
  public input = '';
  public conformityGroupFirst: Array<string>;
  public conformityGroupSecond: Array<string>;
  public orderingList: Array<string>;
  public classificationGroups: any;

  protected readonly QuestionType = QuestionType;
  protected readonly AttemptLangs = AttemptLangs;

  constructor(private dragulaService: DragulaService) {}

  ngOnInit() {
    this.dragulaService.createGroup('handle-list', {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  update() {
    this.singleRadio = 0;
    this.input = '';
    if (this.question.type === QuestionType.SINGLE_ANSWER_CHOICE || this.question.type === QuestionType.MULTI_ANSWER_CHOICE) {
      this.question.options = randomShuffle(this.question.options);
    } else if (this.question.type === QuestionType.CONFORMITY) {
      const a = [], b = [];
      for (const option of this.question.options) {
        a.push(option.optionMain);
        b.push(option.optionSecondary);
      }
      this.conformityGroupFirst = randomShuffle(a);
      this.conformityGroupSecond = randomShuffle(b);
    } else if (this.question.type === QuestionType.ORDERING) {
      this.orderingList = [];
      for (const option of this.question.options) {
        this.orderingList.push(option.option);
      }
      this.orderingList = randomShuffle(this.orderingList);
    } else if (this.question.type === QuestionType.CLASSIFICATION) {
      const classificationGroups = new Map<string, Array<string>>();
      const keys = [];
      this.classificationGroups = [];
      for (const option of this.question.options) {
        keys.push(option.optionMain);
        classificationGroups.set(option.optionMain, []);
      }
      for (const option of this.question.options) {
        const randomKey = randomChoice(keys);
        const arr = classificationGroups.get(randomKey);
        arr.push(option.optionSecondary);
        classificationGroups.set(randomKey, arr);
      }

      for (const key of classificationGroups.keys()) {
        const values = classificationGroups.get(key);
        this.classificationGroups.push({
          key: key,
          values: values,
        });
      }
    }
  }

  checkAnswer() {
    let answer: any;
    if (this.question.type === QuestionType.SINGLE_ANSWER_CHOICE) {
      answer = [this.singleRadio];
    } else if (this.question.type === QuestionType.MULTI_ANSWER_CHOICE) {
      answer = [];
      for (const option of this.question.options) {
        if (option.selected) {
          answer.push(option.id);
        }
      }
    } else if (this.question.type === QuestionType.ANSWER_INPUT) {
      answer = { input: this.input };
    } else if (this.question.type === QuestionType.CONFORMITY) {
      answer = {
        group_one: this.conformityGroupFirst,
        group_two: this.conformityGroupSecond
      };
    } else if (this.question.type === QuestionType.ORDERING) {
      answer = { ordering_list: this.orderingList };
    } else if (this.question.type === QuestionType.CLASSIFICATION) {
      answer = { classification_groups: this.classificationGroups };
    } else if (this.question.type === QuestionType.CUSTOM_CHECK) {
      answer = { code: this.input };
    }
    this.check.emit(answer);
  }

  conformityGroupSecondDown(index: number) {
    if (index + 1 !== this.conformityGroupSecond.length) {
      [this.conformityGroupSecond[index], this.conformityGroupSecond[index + 1]] =
        [this.conformityGroupSecond[index + 1], this.conformityGroupSecond[index]];
    }
  }

  conformityGroupSecondUp(index: number) {
    if (index !== 0) {
      [this.conformityGroupSecond[index], this.conformityGroupSecond[index - 1]] =
        [this.conformityGroupSecond[index - 1], this.conformityGroupSecond[index]];
    }
  }

  ngOnDestroy() {
    this.dragulaService.destroy('handle-list');
  }
}
