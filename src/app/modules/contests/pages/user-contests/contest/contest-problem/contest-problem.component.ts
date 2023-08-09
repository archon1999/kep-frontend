import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Attempt } from '../../../../../problems/models/attempts.models';
import { Problem } from '../../../../../problems/models/problems.models';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest, ContestProblem } from '../../user-contests.models';
import { ContestsService } from '../../user-contests.service';

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 3000 }),
    fadeInRightAnimation({ duration: 2000 })
  ]
})
export class ContestProblemComponent implements OnInit, OnDestroy {

  public startAnimationState = false;
  public contentHeader: ContentHeader;
  
  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];
  
  public problemSymbol: string;
  public contestProblem: ContestProblem;
  public problem: Problem;

  public attempts: Array<Attempt> = [];

  public availableLang: any;
  public selectedLang: string;

  public totalAttemptsCount = 0;
  public currentPage = 1;

  public currentUser: User;

  public coreConfig: CoreConfig;

  private _unsubscribeAll = new Subject();

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    public titleService: TitleService,
    public authService: AuthenticationService,
    public coreConfigService: CoreConfigService,
    public translationService: TranslateService,
    public service: ContestsService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.startAnimationState = true, 0);
    this.route.data.subscribe(({ contest, contestProblem }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblem = contestProblem;
      this.problem = contestProblem.problem;
      this.titleService.updateTitle(this.route, {
        contestTitle: contest.title,
        problemSymbol: contestProblem.symbol,
        problemTitle: this.problem.title,
      });
      this.changeLang(localStorage.getItem('problems-selected-lang')||'py'); 
      this.updateContentHeader();
    });
  
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.reloadProblems();
    });

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))  
      .subscribe((config: any) => this.coreConfig = config);
  }

  updateContentHeader(){
    this.contentHeader = {
      headerTitle: this.problem.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.contest.title+'',
            isLink: true,
            link: '../../'
          },
          {
            name: 'CONTESTS.PROBLEMS',
            isLink: true,
            link: '../../problems'
          },
          {
            name: this.contestProblem.symbol,
            isLink: true,
            link: '.'
          },
        ]
      }
    };
  }

  changeLang(lang: string){
    this.selectedLang = lang;
    for(let availableLang of this.problem.availableLanguages){
      if(availableLang.lang == this.selectedLang){
        this.availableLang = availableLang;
      }
    }
    if(!this.availableLang){
      this.availableLang = this.problem.availableLanguages[0];
      this.selectedLang = this.availableLang.lang;
    }
    localStorage.setItem('problems-selected-lang', this.selectedLang);
  }

  reloadProblems(){
    this.service.getContestProblems(this.contest.id).subscribe((result: any) => {
      this.contestProblems = result.map((data: any) => {
        return ContestProblem.fromJSON(data);
      });
      this.sortProblems();
      this.reloadAttempts();
    })
  }

  sortProblems(){
    this.contestProblems = this.contestProblems.sort(function(a, b) {
      let s1 = a.symbol;
      let s2 = b.symbol;
      let a1 = "", a2 = "";
      let x1 = 0, x2 = 0;
      for(let c of s1){
        if(c >= '0' && c <= '9'){
          x1 = x1*10 + +c;
        } else {
          a1 += c;
        }
      }
      for(let c of s2){
        if(c >= '0' && c <= '9'){
          x2 = x2*10 + +c;
        } else {
          a2 += c;
        }
      }

      let x = a1 < a2 || (a1 == a2 && x1 < x2);
      if(x){
        return -1;
      } else {
        return 1;
      }
    });
  }

  getProblemBySymbol(symbol: string) : ContestProblem | undefined {
    for(let contestProblem of this.contestProblems){
      if(contestProblem.symbol == symbol){
        return contestProblem;
      }
    }
  }

  reloadAttempts(){
    let params = {'user_contest_id': this.contest.id,
                  'user_contest_problem': this.contestProblem.symbol,
                  'username': this.currentUser.username};
    this.api.get('attempts', params).subscribe((result: any) => {
      this.attempts = result.data;
      this.totalAttemptsCount = result.total;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
