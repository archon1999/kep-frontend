import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapter, Test } from '../../testing.models';
import { TestingApiService } from '../../testing-api.service';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { PageResult } from '@shared/components/classes/page-result';

@Component({
  selector: 'app-testing',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
  animations: [],
})
export class TestsComponent extends BaseTablePageComponent<Test> implements OnInit {

  public chapters: Array<Chapter> = [];

  constructor(
    public service: TestingApiService,
  ) {
    super();
  }

  get tests() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    this.route.data.subscribe(({ chapters }) => {
      this.chapters = chapters;
    });

    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<Test>> {
    return this.service.getTests(this.pageable);
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
