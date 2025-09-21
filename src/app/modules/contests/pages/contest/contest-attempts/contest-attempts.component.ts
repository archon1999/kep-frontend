import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Attempt } from '@problems/models/attempts.models';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '@contests/contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestAttemptsFilter } from '@contests/models/contest-attempts-filter';
import { Contest } from '@contests/models/contest';
import { BaseTablePageComponent } from '@core/common';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import {
  ContestAttemptsFilterComponent
} from '@contests/pages/contest/contest-attempts/filter/contest-attempts-filter.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

const REFRESH_TIME = 30000;

@Component({
  selector: 'app-contest-attempts',
  templateUrl: './contest-attempts.component.html',
  styleUrls: ['./contest-attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    AttemptsTableModule,
    KepPaginationComponent,
    ContestCardModule,
    NgSelectModule,
    ContestClassesPipe,
    ContestAttemptsFilterComponent,
    EmptyResultComponent,
    KepCardComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ContestAttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 10;

  public contest: Contest;

  public filter: ContestAttemptsFilter = {
    userOnly: false,
    verdict: null,
    contestProblem: null,
  };

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  get attempts() {
    return this.pageResult?.data || [];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({contest}) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, {contestTitle: contest.title});
      setTimeout(() => this.reloadPage());
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

  getPage() {
    return this.service.getContestAttempts(
      {
        contestId: this.contest.id,
        filter: this.filter,
        pageSize: this.pageSize,
        page: this.pageNumber,
        username: this.filter.userOnly ? this.currentUser?.username : null,
      }
    );
  }

  filterApply(filter: ContestAttemptsFilter) {
    this.filter = filter;
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
            name: 'Contests.Contests',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id + '',
            isLink: true,
            link: '..'
          },
          {
            name: 'Attempts',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }
}
