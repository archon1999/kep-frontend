import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '@problems/models/problems.models';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { DEFAULT_FILTER, ProblemsFilterService } from '@problems/services/problems-filter.service';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@shared/components/classes/page-result';
import { ProblemsService } from '@problems/services/problems.service';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';

@Component({
  selector: 'section-problems-table',
  templateUrl: './section-problems-table.component.html',
  styleUrls: ['./section-problems-table.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })],
  standalone: true,
  imports: [
    CoreCommonModule,
    SpinnerComponent,
    EmptyResultComponent,
    TableOrderingModule,
    ProblemDifficultyColorPipe,
    KepPaginationComponent,
    KepTableComponent,
    NgSelectModule,
  ]
})
export class SectionProblemsTableComponent extends BaseTablePageComponent<Problem> implements OnInit, OnDestroy {
  override defaultPageSize = 20;
  override defaultOrdering = 'id';
  override maxSize = 5;
  override pageOptions = [10, 20, 50];

  public filter: ProblemsFilter = DEFAULT_FILTER;

  constructor(
    public service: ProblemsService,
    public filterService: ProblemsFilterService,
  ) {
    super();
  }

  get problems(): Problem[] {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.filterService.getFilter().pipe(
      debounceTime(500),
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (filter: ProblemsFilter) => {
        this.filter = filter;
        this.pageNumber = 1;
        this.reloadPage();
        this.updateQueryParams(filter, {
          replaceUrl: true,
        });
      }
    );
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<Problem>> {
    return this.service.getProblems({
      page: this.pageNumber,
      pageSize: this.pageSize,
      ordering: this.ordering,
      ...this.filter,
    });
  }

  tagOnClick(tagId: number) {
    const tags = this.filter.tags;
    const index = this.filter.tags.indexOf(tagId);
    if (index === -1) {
      tags.push(tagId);
    } else {
      tags.splice(index, 1);
    }
    this.filterService.updateFilter({ tags: tags });
  }

}
