import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '../../../contests.service';
import { sortContestProblems } from '../../../utils/sort-contest-problems';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import {
  ContestStandingsCountdownComponent
} from '@contests/pages/contest/contest-standings/contest-standings-countdown/contest-standings-countdown.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';
import { Contestant } from '@contests/models/contestant';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { BaseTablePageComponent } from '@app/common';
import { interval } from 'rxjs';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import {
  ContestStandingsTableComponent
} from '@contests/pages/contest/contest-standings/contest-standings-table/contest-standings-table.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';

@Component({
  selector: 'app-contest-standings',
  templateUrl: './contest-standings.component.html',
  styleUrls: ['./contest-standings.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestStandingsCountdownComponent,
    NgbTooltipModule,
    ContestantViewModule,
    ContestClassesPipe,
    KepPaginationComponent,
    ContestStandingsTableComponent,
    NgSelectModule,
  ],
})
export class ContestStandingsComponent extends BaseTablePageComponent<Contestant> {
  override maxSize = 3;
  override pageOptions = [10, 20, 50, 100];
  override defaultPageSize = 20;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public firstLoad = true;
  public contestFilters = [];
  public selectedFilter: number;

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  get contestants(): Contestant[] {
    return this.pageResult?.data || [];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({contest, contestProblems}) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = sortContestProblems(contestProblems);
      this.titleService.updateTitle(this.route, {contestTitle: contest.title});
      setTimeout(() => this.reloadPage());

      this.service.getContestFilters(this.contest.id).subscribe(
        (filters) => {
          this.contestFilters = filters;
        }
      );
    });

    if (this.contest.status === ContestStatus.ALREADY) {
      interval(30000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
        () => {
          this.reloadPage();
          this.updateContestProblems();
        }
      );
    }
  }

  getPage() {
    if (this.isAuthenticated &&
      this.pageNumber === this.defaultPageNumber &&
      this.pageSize === this.defaultPageSize &&
      this.firstLoad) {
      this.firstLoad = false;
      return this.service.getNewContestants(this.contest.id, {filter: this.selectedFilter});
    }
    this.firstLoad = false;
    return this.service.getNewContestants(this.contest.id, {
      ...this.pageable,
      filter: this.selectedFilter,
    });
  }

  updateContestProblems() {
    this.service.getContestProblems(this.contest.id).subscribe(
      (contestProblems) => {
        this.contestProblems = sortContestProblems(contestProblems);
      }
    );
  }

  filterChange() {
    this.pageNumber = 1;
    this.reloadPage();
  }
}
