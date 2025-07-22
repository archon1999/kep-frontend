import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TestingApiService } from '@testing/data-access/api/testing-api.service';
import { Test } from '@testing/domain/entities/test.entity';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
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
import { DragulaModule } from 'ng2-dragula';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepcoinSpendSwalModule } from "@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module";
import { SpinnerComponent } from "@shared/components/spinner/spinner.component";
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { Resources } from "@app/resources";

@Component({
  selector: 'page-test-detail',
  templateUrl: './test-detail.page.html',
  styleUrls: ['./test-detail.page.scss'],
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
    DragulaModule,
    KepCardComponent,
    SpinnerComponent
  ]
})
export class TestDetailPage extends BaseLoadComponent<Test> {
  public test: Test;
  public bestResults: Array<any> = [];
  public lastResults: Array<any> = [];
  public canStart = false;
  public metrics = [];

  protected readonly testingApiService = inject(TestingApiService);

  getData(): Observable<Test> {
    const testId = this.route.snapshot.params['testId'];
    return this.testingApiService.getTest(testId)
  }

  afterLoadData(test: Test) {
    this.test = test;
    this.titleService.updateTitle(this.route, {testTitle: test.title});
    this.loadResults();

    this.metrics = [
      {icon: 'question-circle', value: test.questionsCount, label: 'Questions'},
      {icon: 'clock', value: test.duration, label: 'Duration'},
      {icon: 'star', value: test.difficultyTitle, label: 'Difficulty'},
      {icon: 'people', value: test.passesCount, label: 'TestPassed'}
    ]
  }

  loadResults(): void {
    this.testingApiService.getTestBestResults(this.test.id)
      .subscribe((result: any) => {
        this.bestResults = result;
        this.cdr.markForCheck();
      });

    this.testingApiService.getTestLastResults(this.test.id)
      .subscribe((result: any) => {
        this.lastResults = result;
        this.cdr.markForCheck();
      });
  }

  startTest() {
    this.testingApiService.testStart(this.test.id).subscribe((result: any) => {
      if (result.success) {
        this.router.navigate(['/practice', 'tests', 'test-pass', result.testPassId]);
      }
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'PassTest',
      breadcrumb: {
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Tests',
            link: Resources.Tests,
            isLink: true
          },
        ]
      }
    };
  }
}
