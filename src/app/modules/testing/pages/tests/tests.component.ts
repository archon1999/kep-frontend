import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapter, Test } from '../../testing.models';
import { TestingApiService } from '../../testing-api.service';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { PageResult } from '@app/common/classes/page-result';

@Component({
  selector: 'app-testing',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
  animations: [],
})
export class TestsComponent extends BaseTablePageComponent<Test> implements OnInit {
  override defaultPageSize = 50;

  public chapters: Array<Chapter> = [];

  constructor(
    public service: TestingApiService,
  ) {
    super();
  }

  get tests() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Test>> {
    return this.service.getTests(this.pageable);
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
            name: this.coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
