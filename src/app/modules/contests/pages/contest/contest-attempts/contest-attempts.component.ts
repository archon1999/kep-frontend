import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { Attempt } from '@problems/models/attempts.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '@contests/contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestProblem } from '@contests/models/contest-problem';
import { ContestAttemptsFilter } from '@contests/models/contest-attempts-filter';
import { Contest } from '@contests/models/contest';
import { BaseTablePageComponent } from '@app/common';

const REFRESH_TIME = 30000;

@Component({
  selector: 'app-contest-attempts',
  templateUrl: './contest-attempts.component.html',
  styleUrls: ['./contest-attempts.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation()
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    AttemptsTableModule,
    KepPaginationComponent,
    ContestCardModule,
    NgSelectModule,
  ]
})
export class ContestAttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 10;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public verdicts: Array<any> = [];

  public filter: ContestAttemptsFilter = {
    userOnly: false,
    verdict: null,
    contestProblem: null,
  };

  constructor(
    public service: ContestsService,
    public problemsService: ProblemsApiService,
  ) {
    super();
  }

  get attempts() {
    return this.pageResult?.data || [];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
      this.reloadProblems();
      setTimeout(() => this.reloadPage());
    });

    this.problemsService.getVerdicts().subscribe((data: any) => {
      this.verdicts = data;
    });

    if (this.contest.status === ContestStatus.ALREADY) {
      interval(this.contest.userInfo.virtualContestPurchased ? REFRESH_TIME * 2 : REFRESH_TIME).pipe(
        takeUntil(this._unsubscribeAll)
      ).subscribe(
        () => {
          this.reloadPage();
        }
      );
    }
  }

  reloadProblems() {
    this.service.getContestProblems(this.contest.id).subscribe((result: any) => {
      this.contestProblems = result;
    });
  }

  getPage() {
    return this.service.getContestAttempts(
      {
        contestId: this.contest.id,
        filter: this.filter,
        pageSize: this.pageSize,
        page: this.pageNumber,
      }
    );
  }

  filterApply() {
    this.pageNumber = this.defaultPageNumber;
    this.reloadPage();
  }

  protected getContentHeader() {
    return {
      headerTitle: this.contest.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id + '',
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

}
