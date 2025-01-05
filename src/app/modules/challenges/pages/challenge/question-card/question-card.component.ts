import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { TranslateModule } from '@ngx-translate/core';
import { randomInt, randomShuffle } from '@shared/utils';
import { randomChoice } from '@shared/utils/random';
import { AttemptLangs } from '@problems/constants';
import { LanguageService } from '@problems/services/language.service';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';
import { takeUntil } from 'rxjs/operators';
import { findAvailableLang } from '@problems/utils';
import { BaseComponent } from '@app/common';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { FormControl } from '@angular/forms';

export enum QuestionType {
  SINGLE_ANSWER_CHOICE = 1,
  MULTI_ANSWER_CHOICE = 2,
  ANSWER_INPUT = 3,
  CONFORMITY = 4,
  ORDERING = 5,
  CLASSIFICATION = 6,
  CUSTOM_CHECK = 7,
  PROBLEM = 8,
}

const cppTemplate = ``;

@Component({
  selector: 'question-card',
  standalone: true,
  imports: [
    CoreCommonModule,
    CoreDirectivesModule,
    DragulaModule,
    MathjaxModule,
    MonacoEditorComponent,
    TranslateModule,
    ProblemBodyComponent,
    NgSelectModule
  ],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() question: any;
  @Output() check = new EventEmitter<any>;

  public singleRadio = 0;
  public input = '';
  public langControl = new FormControl();
  public conformityGroupFirst: Array<string>;
  public conformityGroupSecond: Array<string>;
  public orderingList: Array<string>;
  public classificationGroups: any;
  public rnd = randomInt(1, 100000);

  protected readonly QuestionType = QuestionType;
  protected readonly AttemptLangs = AttemptLangs;

  constructor(
    protected dragulaService: DragulaService,
    protected langService: LanguageService,
  ) {
    super();
  }

  ngOnInit() {
    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.langControl.setValue(lang, { emitEvent: false });
        if (!findAvailableLang(this.question.problem.availableLanguages, lang)) {
          this.langService.setLanguage(this.question.problem.availableLanguages[0].lang);
        }
      }
    );
    this.langControl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang) => {
        this.langService.setLanguage(lang);
        if (lang === 'cpp' && this.input.trim() === '') {
          this.input = cppTemplate;
        }
      }
    );
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

    if (this.langControl.value === 'cpp') {
      this.input = cppTemplate;
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
    } else if (this.question.type === QuestionType.PROBLEM) {
      answer = { code: this.input, lang: this.langControl.value };
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
