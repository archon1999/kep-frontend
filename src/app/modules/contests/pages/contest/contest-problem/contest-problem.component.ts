import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Attempt } from '../../../../problems/models/attempts.models';
import { Problem } from '../../../../problems/models/problems.models';
import { TitleService } from 'app/shared/services/title.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest, Contestant, ContestProblem, ContestProblemInfo } from '../../../contests.models';
import { ContestsService } from '../../../contests.service';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { findAvailableLang } from 'app/modules/problems/utils';
import { AttemptLangs } from 'app/modules/problems/constants';

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1000 })
  ]
})
export class ContestProblemComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;
  
  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];
  
  public problemSymbol: string;
  public contestProblem: ContestProblem;
  public problem: Problem;

  public attempts: Array<Attempt> = [];

  public selectedAvailableLang: any;
  public selectedLang: string;

  public totalAttemptsCount = 0;
  public currentPage = 1;

  public currentUser: User;

  public contestant: Contestant | null;

  public coreConfig: CoreConfig;

  public resultsVisible = true;

  private _unsubscribeAll = new Subject();
  private _intervalId: any;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    public titleService: TitleService,
    public authService: AuthenticationService,
    public coreConfigService: CoreConfigService,
    public translationService: TranslateService,
    public service: ContestsService,
    public langService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest, contestProblem }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblem = contestProblem;
      this.problem = contestProblem.problem;
      this.titleService.updateTitle(this.route, {
        contestTitle: contest.title,
        problemSymbol: contestProblem.symbol,
        problemTitle: this.problem.title,
      });
      this.updateContentHeader();

      this.service.getMe(this.contest.id).subscribe(
        (contestant: Contestant | null) => {
          if(contestant){
            this.contestant = Contestant.fromJSON(contestant);
            if(this.contest.status == 0){
              this._intervalId = setInterval(() => {
                this.updateContestant();
              }, 30000);
            }
          }
        }
      )

      this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (lang: AttemptLangs) => {          
          this.selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);
          this.selectedLang = lang;
          if(!this.selectedAvailableLang){
            this.langService.setLanguage(this.problem.availableLanguages[0].lang);
          }  
        }
      )
  
      this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (user: User | null) => {
          this.currentUser = user;
          this.reloadProblems();
        }
      );  
    });

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))  
      .subscribe((config: any) => this.coreConfig = config);
  }

  updateContestant(){
    this.service.getMe(this.contest.id).subscribe(
      (contestant: Contestant | null) => {
        this.contestant = contestant;
      }
    )
  }

  updateContentHeader(){
    this.contentHeader = {
      headerTitle: this.problem.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../../../'
          },
          {
            name: this.contest.id+'',
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

  reloadProblems(){
    this.api.get(`contests/${this.contest.id}/problems`).subscribe((result: any) => {
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

  getProblemInfoBySymbol(
    problemsInfo: Array<ContestProblemInfo>,
    problemSymbol: string
  ) : ContestProblemInfo | undefined {
    return problemsInfo.find((problemInfo: any) => problemInfo.problemSymbol == problemSymbol);
  }

  reloadAttempts(){
    let params = {'contest_id': this.contest.id,
                  'contest_problem': this.contestProblem.symbol,
                  'username': this.currentUser.username};
    this.api.get('attempts', params).subscribe((result: any) => {
      this.attempts = result.data;
      this.totalAttemptsCount = result.total;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    if(this._intervalId){
      clearInterval(this._intervalId);
    }
  }
}
