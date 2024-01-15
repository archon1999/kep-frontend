import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from 'core/services/config.service';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '../../../contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestQuestionCardComponent } from '@contests/pages/contest/contest-questions/contest-question-card/contest-question-card.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestQuestion } from '@contests/models/contest-question';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'app-contest-questions',
  templateUrl: './contest-questions.component.html',
  styleUrls: ['./contest-questions.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1500 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestQuestionCardComponent,
    NgSelectModule,
    ContestCardModule,
  ]
})
export class ContestQuestionsComponent implements OnInit {

  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public currentUser: User = this.authService.currentUserValue;

  public selectedProblem: string;
  public question: string;

  public questions: Array<ContestQuestion> = [];

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ContestsService,
    public titleService: TitleService,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest, contestProblems }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = contestProblems;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title } );
      this.sortProblems();
      this.reloadQuestions();
    })
  
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.currentUser = user;
      })
  }

  submit(){
    this.service.newQuestion(this.contest.id, this.selectedProblem, this.question).subscribe(
      () => {
        this.reloadQuestions();
      }
    )
  }

  reloadQuestions(){
    this.service.getContestQuestions(this.contest.id).subscribe(
      (questions: any) => {
        this.questions = questions;
      }
    )
  }

  loadContentHeader(){
    this.contentHeader = {
      headerTitle: 'Questions',
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
          }
        ]
      }
    };
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

  ngOnDestroy(): void {
    
  }
}
