import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreConfigService } from '@core/services/config.service';
import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '@problems/models/problems.models';
import { ProblemsService } from '@problems/services/problems.service';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { ProblemsFilterService } from '@problems/services/problems-filter.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { PageResult } from 'app/shared/page-result';
import { deepCopy } from '@shared/utils';
import { CoreSidebarService } from '../../../../../@core/components/core-sidebar/core-sidebar.service';

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

  defaultTouch = { x: 0, y: 0, time: 0 };

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event) {
    let touch = event.touches[0] || event.changedTouches[0];

    // check the events
    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulte a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 240) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.doSwipeRight(event);
          } else {
            this.doSwipeLeft(event);
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.doSwipeDown(event);
          } else {
            this.doSwipeUp(event);
          }
        }
      }
    }
  }

  doSwipeLeft(event) {
    if (!this.coreSidebarService.getSidebarRegistry('problemsSidebar').isOpened) {
      this.coreSidebarService.getSidebarRegistry('problemsSidebar').toggleOpen();
    }
  }

  doSwipeRight(event) {
    if (this.coreSidebarService.getSidebarRegistry('problemsSidebar').isOpened) {
      this.coreSidebarService.getSidebarRegistry('problemsSidebar').toggleOpen();
    }
  }

  doSwipeUp(event) {
    console.log('swipe up', event);
  }

  doSwipeDown(event) {
    console.log('swipe down', event);
  }
}
