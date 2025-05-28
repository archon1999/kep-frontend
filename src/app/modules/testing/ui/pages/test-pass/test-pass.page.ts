import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestingApiService } from '@testing/data-access';
import { Test, TestPass } from '@testing/domain';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import Swal from 'sweetalert2';
import { fadeInLeftAnimation, fadeInRightAnimation, fadeInUpAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { randomShuffle } from '@shared/utils';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { randomChoice } from '@shared/utils/random';
import { CommonModule } from '@angular/common';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { SweetAlertModule } from '@shared/third-part-modules/sweet-alert/sweet-alert.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { KepcoinSpendSwalModule } from "@app/modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { SpinnerComponent } from "@shared/components/spinner/spinner.component";

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
    FormsModule,
    CodeEditorModule,
    MathjaxModule,
    SweetAlertModule,
    MonacoEditorComponent,
    DragulaModule,
    CountdownComponent,
    KepCardComponent,
    SpinnerComponent
  ],
  styleUrls: ['./test-pass.page.scss'],
  animations: [
    fadeInLeftAnimation({duration: 1500}),
    fadeInRightAnimation({duration: 1000}),
    fadeInUpAnimation({duration: 1000}),
  ],
})
export class TestPassPage extends BaseLoadComponent<TestPass> implements OnInit, OnDestroy {
  public testPass: TestPass;
  public test: Test;
  public question: any;
  public questions = [];
  public selectedOption: number;
  public leftTime = 0;
  public conformityGroupOne: Array<string>;
  public conformityGroupTwo: Array<string>;
  public orderingList: Array<string>;
  public classificationGroups: Array<any>;

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
    this.questions = this.test.questions;
    this.changeQuestion(0);
  }

  changeQuestion(index: number) {
    index %= this.questions.length;
    this.question = this.questions[index];
    if (this.question.type === 1) {
      this.selectedOption = this.question.options.findIndex((option: any) => option.selected);
    } else if (this.question.type === 4) {
      let a = [], b = [];
      for (let option of this.question.options) {
        a.push(option.optionMain);
        b.push(option.optionSecondary);
      }
      this.conformityGroupOne = randomShuffle(a);
      this.conformityGroupTwo = randomShuffle(b);
    } else if (this.question.type == 5) {
      this.orderingList = [];
      for (let option of this.question.options) {
        this.orderingList.push(option.option);
      }
      this.orderingList = randomShuffle(this.orderingList);
    } else if (this.question.type === 6) {
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

  answerSubmit() {
    let answer: any;
    let isEmpty = false;
    let question = this.question;
    if (this.question.type == 1) {
      answer = this.selectedOption;
      if (answer == -1) {
        isEmpty = true;
      }
    } else if (this.question.type == 2) {
      answer = [];
      for (let i = 0; i < this.question.options.length; i++) {
        if (this.question.options[i].selected) {
          answer.push(i);
        }
      }
      if (answer.length === 0) {
        isEmpty = true;
      }
    } else if (this.question.type === 3 || this.question.type === 7) {
      answer = this.question.input;
      if (!answer) {
        isEmpty = true;
      }
    } else if (this.question.type === 6) {
      answer = {classification_groups: this.classificationGroups};
    }

    if (!isEmpty) {
      this.testingApiService.answerSubmit(this.testPass.id, this.question.number, answer).subscribe(
        () => {
          question.answered = true;
        }
      );
    }
    this.changeQuestion(this.question.number);
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
