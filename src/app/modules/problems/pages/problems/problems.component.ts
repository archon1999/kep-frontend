import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject, asyncScheduler } from 'rxjs';
import { auditTime, debounceTime, delay, sampleTime, takeUntil, throttleTime } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '../../models/problems.models';
import { ProblemsService } from '../../services/problems.service';
import { ProblemsStatisticsService } from '../../services/problems-statistics.service';
import { ProblemsFilterService } from '../../services/problems-filter.service';

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
export class ProblemsComponent implements OnInit, OnDestroy {
  public startAnimationState = false;
  public startAnimationMobileState = false;

  public problems: Array<Problem> = [];

  public filter: ProblemsFilter;

  public currentPage: number = 1;
  public problemsCount: number = 0;

  public currentUser: User;
  public coreConfig: CoreConfig;

  public isFirst = true;

  @ViewChild('sectionProblemsTable') sectionProblemsTable: ElementRef;

  private _problemsReloader = new Subject();
  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public service: ProblemsService,
    public authService: AuthenticationService,
    public statisticsService: ProblemsStatisticsService,
    public route: ActivatedRoute,
    public router: Router,
    public problemsFilterService: ProblemsFilterService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if(window.innerWidth < 768){
        this.startAnimationMobileState = true;
      } else {
        this.startAnimationState = true;
      }
    }, 10);

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        if(queryParams['page']){
          this.currentPage = queryParams['page'];
        }
      }
    )
    
    this._problemsReloader.pipe(
      sampleTime(500)
    ).subscribe(
      () => this._reloadProblems()
    );

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        this.reloadProblems();
      }
    )

    this.problemsFilterService.getFilter().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (filter: ProblemsFilter) => {   
        this.filter = filter;
        this.currentPage = 1;
        this.reloadProblems();
      }
    )

  }

  reloadProblems() {   
    /*
    if(this.isFirst){
      this.isFirst = false;
      let currentScrollHeight = window.pageYOffset;
      this.router.navigate([], 
        {
          relativeTo: this.route,
          queryParams: { page: this.currentPage },
        }
      ).then(() => window.scrollTo({ top: currentScrollHeight }));
      return;
    }
    
    */    
    this._problemsReloader.next();
  }

  _reloadProblems(){    
    this.service.getProblems(this.filter, this.currentPage, 20).subscribe(
      (result: any) => {
        this.problems = result.data;
        this.problemsCount = result.total;
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
