import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Attempt } from '../../../../../problems/models/attempts.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestAttemptsFilter, ContestStatus } from '../../../../../contests/contests.models';
import { Contest, ContestProblem } from '../../user-contests.models';
import { ContestsService } from '../../user-contests.service';

@Component({
  selector: 'app-contest-attempts',
  templateUrl: './contest-attempts.component.html',
  styleUrls: ['./contest-attempts.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 3000 }),
    fadeInRightAnimation({ duration: 2000 })
  ]
})
export class ContestAttemptsComponent implements OnInit, OnDestroy {
  
  public startAnimationState = false;
  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public attempts: Array<Attempt> = [];
  public currentPage = 1;
  public totalAttemptsCount = 0;

  public verdicts: Array<any> = [];

  public filter: ContestAttemptsFilter = {
    userOnly: false,
    verdict: null,
    contestProblem: null,
  };

  public currentUser: User;

  public refreshTime: number = 30;
  
  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: ContestsService,
    public problemsService: ProblemsService,
    public authService: AuthenticationService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.startAnimationState = true, 0);
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title } );
    })
    
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))  
      .subscribe((user: any) => {
        this.currentUser = user;
        this.reloadPage();
      })

    this.problemsService.getVerdicts().subscribe((data: any) => {
      this.verdicts = data;
    })

    if(this.contest.status == ContestStatus.ALREADY){
      this._intervalId = setInterval(() => {
        this.reloadAttempts();
      }, 30000);
    }
  }

  loadContentHeader(){
    this.contentHeader = {
      headerTitle: this.contest.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id+'',
            isLink: true,
            link: '..'
          },
          {
            name: 'ATTEMPTS',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  reloadPage(){
    this.reloadAttempts();
    this.reloadProblems();
  }

  reloadProblems(){
    this.service.getContestProblems(this.contest.id).subscribe((result: any) => {
      this.contestProblems = result.map((data: any) => ContestProblem.fromJSON(data))
    })
  }
  
  reloadAttempts(){
    this.service.getContestAttempts(
      this.contest.id, this.currentPage, 20
    ).subscribe((result: any) => {
      this.attempts = result.data.map((attempt: any) => Attempt.fromJSON(attempt));
      this.totalAttemptsCount = result.total;
    });
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
