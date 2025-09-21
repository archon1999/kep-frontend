import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Attempt } from '@problems/models/attempts.models';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { PageResult } from '@core/common/classes/page-result';
import { AttemptsFilterComponent } from '@problems/components/attempts-filter/attempts-filter.component';
import { AttemptsFilter } from '@problems/interfaces';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { Resources } from '@app/resources';
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Params } from "@angular/router";

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
    AttemptsFilterComponent,
    EmptyResultComponent,
    KepCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit, OnDestroy {
  override maxSize = 5;
  override defaultPageSize = 20;
  override pageOptions = [10, 20, 50];

  public filter: AttemptsFilter = this.createEmptyFilter();
  public initialFilter: AttemptsFilter = this.createEmptyFilter();

  override ngOnInit() {
    this.applyRouteFilters();
    super.ngOnInit();
  }

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
    this.filter = this.sanitizeFilter(filter);
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
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Problems',
            isLink: true,
            link: Resources.Problems
          }
        ]
      },
      refreshVisible: true,
    };
  }

  private applyRouteFilters() {
    const params = this.route.snapshot.queryParams as Params;
    const usernameParam = this.route.snapshot.paramMap.get('username');

    const routeFilter: Partial<AttemptsFilter> = {
      username: usernameParam ?? params['username'] ?? null,
      problemId: params['problemId'] ?? null,
      verdict: (params['verdict'] ?? null) as AttemptsFilter['verdict'],
      lang: params['lang'] ?? null,
    };

    this.initialFilter = this.sanitizeFilter(routeFilter);
    this.filter = {...this.initialFilter};
  }

  private sanitizeFilter(filter: Partial<AttemptsFilter>): AttemptsFilter {
    const problemId = filter.problemId !== undefined && filter.problemId !== null ? Number(filter.problemId) : null;
    return {
      username: filter.username ?? null,
      problemId: problemId !== null && !Number.isNaN(problemId) ? problemId : null,
      verdict: filter.verdict ?? null,
      lang: filter.lang ?? null,
    };
  }

  private createEmptyFilter(): AttemptsFilter {
    return {
      username: null,
      problemId: null,
      verdict: null,
      lang: null,
    };
  }
}
