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
import { VerdictsSelectComponent } from '@problems/components/attempts-filter/verdicts-select/verdicts-select.component';
import { AttemptsFilterComponent } from '@problems/components/attempts-filter/attempts-filter.component';
import { AttemptsFilter } from '@problems/interfaces';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';

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
    VerdictsSelectComponent,
    AttemptsFilterComponent,
    EmptyResultComponent,
  ]
})
export class AttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit, OnDestroy {
  override maxSize = 7;
  override defaultPageSize = 20;
  override pageOptions = [10, 20, 50];

  public filter: AttemptsFilter;

  get attempts() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Attempt>> {
    return this.api.get('attempts', {
      ...this.pageable,
      ...this.filter,
    });
  }

  filterChange(filter: AttemptsFilter) {
    this.filter = filter;
    this.pageNumber = this.defaultPageNumber;
    this.reloadPage();
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
