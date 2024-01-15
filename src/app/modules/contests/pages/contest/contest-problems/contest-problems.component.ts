import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from 'core/services/config.service';
import { CoreConfig } from 'core/types';
import { fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem } from '../../../../problems/models/problems.models';
import { ContestsService } from '../../../contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestProblemCardComponent } from '@contests/pages/contest/contest-problems/contest-problem-card/contest-problem-card.component';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'app-contest-problems',
  templateUrl: './contest-problems.component.html',
  styleUrls: ['./contest-problems.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 1000 }),
    fadeInRightAnimation({ duration: 1000 })
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestProblemCardComponent,
    ContestCardModule,
  ]
})
export class ContestProblemsComponent implements OnInit, OnDestroy {

  public startAnimationState = false;
  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public currentUser: User = this.authService.currentUserValue;

  public coreConfig: CoreConfig;

  public problemShow = new Map<string, boolean>();
  public problems = new Map<string, Problem>();

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
    setTimeout(() => this.startAnimationState = true, 0);
    this.route.data.subscribe(({ contest, contestProblems }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = contestProblems;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
      this.sortProblems();
    });

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        if (this.currentUser != user) {
          this.reloadProblems();
        }
        this.currentUser = user;
      });

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: CoreConfig) => this.coreConfig = config);
  }

  loadContentHeader() {
    this.contentHeader = {
      headerTitle: 'CONTESTS.PROBLEMS',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest?.id.toString(),
            isLink: true,
            link: '..'
          },
          {
            name: 'Problems',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  reloadProblems() {
    this.service.getContestProblems(this.contest?.id).subscribe((result: any) => {
      this.contestProblems = result;
      this.sortProblems();
    });
  }

  sortProblems() {
    this.contestProblems = this.contestProblems.sort(function (a, b) {
      let s1 = a.symbol;
      let s2 = b.symbol;
      let a1 = '', a2 = '';
      let x1 = 0, x2 = 0;
      for (let c of s1) {
        if (c >= '0' && c <= '9') {
          x1 = x1 * 10 + +c;
        } else {
          a1 += c;
        }
      }
      for (let c of s2) {
        if (c >= '0' && c <= '9') {
          x2 = x2 * 10 + +c;
        } else {
          a2 += c;
        }
      }

      let x = a1 < a2 || (a1 == a2 && x1 < x2);
      if (x) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  ngOnDestroy(): void {

  }
}
