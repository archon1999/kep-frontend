import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapter, Test } from '@testing/domain';
import { TestingApiService } from '@testing/data-access';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepcoinSpendSwalModule } from "@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module";
import {
  ChapterWithTestsCardComponent
} from "@testing/ui/components/chapter-with-tests-card/chapter-with-tests-card.component";
import { BaseTablePageComponent } from "@app/common";
import { PageResult } from "@app/common/classes/page-result";

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.page.html',
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
    SpinnerComponent,
    ChapterWithTestsCardComponent
  ]
})
export class TestsListPage extends BaseTablePageComponent<Test> {
  override defaultPageSize = 50;

  public chapters: Array<Chapter> = [];

  protected readonly testingApiService = inject(TestingApiService);

  get tests() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Test>> {
    return this.testingApiService.getTests(this.pageable);
  }

  afterLoadPage(pageResult: PageResult<Test>) {
    const chapters: { [key: number | string]: Array<Test> } = {};
    for (const test of pageResult.data) {
      if (!chapters[test.chapter.id]) {
        chapters[test.chapter.id] = [];
      }
      chapters[test.chapter.id].push(test);
    }
    for (const chapterId of Object.keys(chapters)) {
      const chapter = chapters[chapterId][0].chapter;
      chapter.tests = chapters[chapterId];
      this.chapters.push(chapter);
    }
    this.chapters = this.chapters.sort((a, b) => a.id - b.id);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Tests',
      breadcrumb: {
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Tests',
            isLink: false,
          },
        ]
      }
    };
  }
}
