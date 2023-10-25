import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '@problems/models/problems.models';
import { ProblemsService } from '@problems/services/problems.service';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { ProblemsFilterService } from '@problems/services/problems-filter.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { PageResult } from 'app/shared/page-result';
import { CoreSidebarService } from '../../../../../@core/components/core-sidebar/core-sidebar.service';
import { SwipeService } from '@shared/services/swipe.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss'],
  animations: [
    fadeInRightAnimation({ duration: 2000 }),
    fadeInLeftAnimation({ duration: 2000 }),
    fadeInAnimation({ anchor: 'mobile', duration: 1000 }),
  ]
})
export class ProblemsComponent extends BaseComponent implements OnInit, OnDestroy {
  public startAnimationState = false;
  public startAnimationMobileState = false;

  public problems: Array<Problem> = [];

  public filter: ProblemsFilter;
  public page: number;
  public pageSize: number;
  public problemsTotal: number;

  constructor(
    public service: ProblemsService,
    public statisticsService: ProblemsStatisticsService,
    public route: ActivatedRoute,
    public router: Router,
    public problemsFilterService: ProblemsFilterService,
    public coreSidebarService: CoreSidebarService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    setTimeout(() => {
      if (window.innerWidth < 768) {
        this.startAnimationMobileState = true;
      } else {
        this.startAnimationState = true;
      }
    }, 10);

    this.problemsFilterService.getFilter().pipe(
      debounceTime(500),
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (filter: ProblemsFilter) => {
        this.filter = filter;
        this.reloadProblems();
      }
    );

  }

  reloadProblems() {
    this.service.getProblems(this.filter).subscribe(
      (result: PageResult<Problem>) => {
        this.problems = result.data;
        this.page = result.page;
        this.pageSize = result.pageSize;
        this.problemsTotal = result.total;
      }
    );
  }

  pageChange(page: number) {
    this.page = page;
    this.updateQueryParams({ page: page });
    this.problemsFilterService.updateFilter({ page: page });
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.updateQueryParams({ pageSize: pageSize });
    this.problemsFilterService.updateFilter({ pageSize: pageSize });
  }

  toggleSidebar(key): void {
    this.coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

}
