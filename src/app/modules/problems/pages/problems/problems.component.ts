import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { Problem, ProblemFilter } from '../../models/problems.models';
import { ProblemsService } from '../../problems.service';
import { ProblemsStatisticsService } from '../../problems-statistics.service';

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

  public activeTopic = 0;
  public filter: ProblemFilter;

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
  ) { }

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

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )

    this._problemsReloader.pipe(debounceTime(500)).subscribe(() => this._reloadProblems());
    this._problemsReloader.next();
  }

  reloadProblems() {
    if(!this.isFirst){
      let currentScrollHeight = window.pageYOffset;
      this.router.navigate([], 
        {
          relativeTo: this.route,
          queryParams: { page: this.currentPage },
        }
      ).then(() => window.scrollTo({ top: currentScrollHeight }));
    }

    this.isFirst = false;

    this._problemsReloader.next();
  }

  _reloadProblems(){
    this.service.getProblems(this.filter, this.activeTopic, this.currentPage, 20).subscribe(
      (result: any) => {
        this.problems = result.data;
        this.problemsCount = result.total;
      }
    );
  }

  tagClick(tagId: number){
    var index = this.filter.tags.indexOf(tagId);
    if (index == -1) {
      this.filter.tags.push(tagId);
    } else {
      this.filter.tags.splice(index, 1);
    }
    this.reloadProblems();
  }

  topicClick(topicId: number){
    this.activeTopic = topicId;
    this.reloadProblems();
  }

  filterChange(filter: ProblemFilter){
    this.filter = filter;
    this.currentPage = 1;
    this.reloadProblems();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
