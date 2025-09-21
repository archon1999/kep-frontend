import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { randomShuffle } from '@shared/utils';
import { randomChoice } from '@shared/utils/random';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { DragulaService } from 'ng2-dragula';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { TestingApiService } from '@testing/data-access';
import { Test, TestPass, QuestionType } from '@testing/domain';

import {
  buildClassificationAnswer,
  buildCodeInputAnswer,
  buildConformityAnswer,
  buildMultipleChoiceAnswer,
  buildOrderingAnswer,
  buildSingleChoiceAnswer,
  buildTextInputAnswer,
  ClassificationGroup,
} from './answers';
import { ClassificationQuestionComponent } from './components/classification-question/classification-question.component';
import { CodeInputQuestionComponent } from './components/code-input-question/code-input-question.component';
import { ConformityQuestionComponent } from './components/conformity-question/conformity-question.component';
import { MultipleChoiceQuestionComponent } from './components/multiple-choice-question/multiple-choice-question.component';
import { OrderingQuestionComponent } from './components/ordering-question/ordering-question.component';
import { SingleChoiceQuestionComponent } from './components/single-choice-question/single-choice-question.component';
import { TextInputQuestionComponent } from './components/text-input-question/text-input-question.component';
import { TestPassQuestion } from './test-pass-question.type';

@Component({
  selector: 'app-test-detail-pass',
  templateUrl: './test-pass.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContentHeaderModule,
    CorePipesModule,
    CoreDirectivesModule,
    UserPopoverModule,
    KepcoinSpendSwalModule,
    NgbTooltipModule,
    TranslateModule,
    CountdownComponent,
    KepCardComponent,
    SpinnerComponent,
    SingleChoiceQuestionComponent,
    MultipleChoiceQuestionComponent,
    TextInputQuestionComponent,
    ConformityQuestionComponent,
    OrderingQuestionComponent,
    ClassificationQuestionComponent,
    CodeInputQuestionComponent
  ],
  styleUrls: ['./test-pass.page.scss'],
})
export class TestPassPage extends BaseLoadComponent<TestPass> implements OnInit, OnDestroy {
  public readonly QuestionType = QuestionType;

  public testPass: TestPass;
  public test: Test;
  public question: TestPassQuestion | null = null;
  public questions: TestPassQuestion[] = [];
  public selectedOption = -1;
  public leftTime = 0;
  public conformityGroupOne: string[] = [];
  public conformityGroupTwo: string[] = [];
  public orderingList: string[] = [];
  public classificationGroups: ClassificationGroup[] = [];

  protected testingApiService = inject(TestingApiService);
  protected dragulaService = inject(DragulaService);

  ngOnInit(): void {
    this.dragulaService.createGroup('handle-list', {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });

    super.ngOnInit();
  }

  getData(): Observable<TestPass> {
    const testPassId = this.route.snapshot.params['testPassId'];
    return this.testingApiService.getTestPass(testPassId);
  }

  afterLoadData(testPass: TestPass) {
    this.testPass = testPass;
    this.titleService.updateTitle(this.route, {testTitle: testPass.test.title});
    this.test = testPass.test;
    const duration = this.test.duration.split(':');
    const time = +duration[0] * 60 * 60 + +duration[1] * 60 + +duration[2];
    this.leftTime = time * 1000 - (Date.now() - new Date(testPass.started).valueOf());
    this.questions = (this.test.questions ?? []) as TestPassQuestion[];
    this.changeQuestion(0);
  }

  changeQuestion(index: number) {
    if (!this.questions.length) {
      return;
    }

    const normalizedIndex = ((index % this.questions.length) + this.questions.length) % this.questions.length;
    const currentQuestion = this.questions[normalizedIndex];

    this.selectedOption = -1;
    this.conformityGroupOne = [];
    this.conformityGroupTwo = [];
    this.orderingList = [];
    this.classificationGroups = [];

    this.question = currentQuestion;

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice: {
        this.selectedOption = currentQuestion.options?.findIndex((option: any) => option.selected) ?? -1;
        break;
      }
      case QuestionType.Conformity: {
        const groupOne = currentQuestion.options?.map((option: any) => option.optionMain) ?? [];
        const groupTwo = currentQuestion.options?.map((option: any) => option.optionSecondary) ?? [];
        this.conformityGroupOne = randomShuffle(groupOne);
        this.conformityGroupTwo = randomShuffle(groupTwo);
        break;
      }
      case QuestionType.Ordering: {
        const orderingList = (currentQuestion.options ?? []).map((option: any) => option.option);
        this.orderingList = randomShuffle(orderingList);
        break;
      }
      case QuestionType.Classification: {
        const classificationGroups = new Map<string, Array<string>>();
        const keys: string[] = [];

        for (const option of currentQuestion.options ?? []) {
          keys.push(option.optionMain);
          classificationGroups.set(option.optionMain, []);
        }

        for (const option of currentQuestion.options ?? []) {
          const randomKey = randomChoice(keys);
          const values = classificationGroups.get(randomKey) ?? [];
          values.push(option.optionSecondary);
          classificationGroups.set(randomKey, values);
        }

        this.classificationGroups = Array.from(classificationGroups.entries()).map(([key, values]) => ({
          key,
          values,
        }));
        break;
      }
    }
  }

  answerSubmit() {
    if (!this.question) {
      return;
    }

    const currentQuestion = this.question;
    let result;

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice:
        result = buildSingleChoiceAnswer(this.selectedOption);
        break;
      case QuestionType.MultipleChoice:
        result = buildMultipleChoiceAnswer(currentQuestion.options);
        break;
      case QuestionType.TextInput:
        result = buildTextInputAnswer(currentQuestion.input);
        break;
      case QuestionType.Conformity:
        result = buildConformityAnswer(this.conformityGroupOne, this.conformityGroupTwo);
        break;
      case QuestionType.Ordering:
        result = buildOrderingAnswer(this.orderingList);
        break;
      case QuestionType.Classification:
        result = buildClassificationAnswer(this.classificationGroups);
        break;
      case QuestionType.CodeInput:
        result = buildCodeInputAnswer(currentQuestion.input);
        break;
      default:
        result = null;
    }

    if (result && !result.isEmpty) {
      this.testingApiService.answerSubmit(this.testPass.id, currentQuestion.number, result.answer).subscribe(
        () => {
          currentQuestion.answered = true;
        }
      );
    }

    this.changeQuestion(currentQuestion.number);
  }

  testPassFinish() {
    this.testingApiService.testPassFinish(this.testPass.id).subscribe(
      (data: any) => {
        if (data.success) {
          let result = data.result;
          let router = this.router;
          let testId = this.test.id;
          let questionCount = this.questions.length;
          Swal.fire({
            title: 'Test yakunlandi',
            html: `<b>Natija</b>: <span class="text-success">${result}</span>/${questionCount}`,
            icon: 'info',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-success',
            }
          }).then(function (result) {
            router.navigate(['/practice', 'tests', 'test', testId]);
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('handle-list');
    super.ngOnDestroy();
  }
}
