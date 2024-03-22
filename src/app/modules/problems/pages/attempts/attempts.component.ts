import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Attempt } from '@problems/models/attempts.models';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { PageResult } from '@app/common/classes/page-result';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.component.html',
  styleUrls: ['./attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SpinnerComponent,
    AttemptsTableModule,
    KepPaginationComponent,
    ContentHeaderModule,
    KepTableComponent,
  ]
})
export class AttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit, OnDestroy {
  override maxSize = 7;
  override defaultPageSize = 20;
  override pageOptions = [10, 20, 50];

  public myAttempts = false;

  get attempts() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    this.reloadPage();
  }

  getPage(): Observable<PageResult<Attempt>> {
    const params: any = { page: this.pageNumber };
    if (this.myAttempts && this.currentUser) {
      params.username = this.currentUser.username;
    }
    return this.api.get('attempts', params);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Attempts',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Problems',
            isLink: true,
            link: '/practice/problems'
          }
        ]
      },
      refreshVisible: true,
    };
  }
}
