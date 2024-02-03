import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@auth';
import { AuthService } from '@auth';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '../../../contests.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { sortContestProblems } from '../../../utils/sort-contest-problems';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import {
  ContestStandingsCountdownComponent
} from '@contests/pages/contest/contest-standings/contest-standings-countdown/contest-standings-countdown.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestProblem } from '@contests/models/contest-problem';
import { ContestProblemInfo } from '@contests/models/contest-problem-info';
import { Contest } from '@contests/models/contest';
import { Contestant } from '@contests/models/contestant';

@Component({
  selector: 'app-contest-standings',
  templateUrl: './contest-standings.component.html',
  styleUrls: ['./contest-standings.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestStandingsCountdownComponent,
    NgbTooltipModule,
    ContestantViewModule,
  ]
})
export class ContestStandingsComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];
  public contestants: Array<Contestant> = [];

  public currentUser: User;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public service: ContestsService,
    public authService: AuthService,
    public titleService: TitleService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest, contestProblems }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = sortContestProblems(contestProblems);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
      this.reloadContestants();
    });

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => this.currentUser = user);

    if (this.contest.status === ContestStatus.ALREADY) {
      this._intervalId = setInterval(() => {
        this.reloadPage();
      }, 60000);
    }
  }

  loadContentHeader() {
    this.contentHeader = {
      headerTitle: 'CONTESTS.STANDINGS',
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
            name: 'CONTESTS.STANDINGS',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  reloadContestants() {
    this.service.getContestants(this.contest.id).subscribe((result: any) => {
      this.contestants = result.map((data: any) => {
        return Contestant.fromJSON(data);
      });
      this.reassignRanks();
    });
  }

  reassignRanks() {
    for (let index = 0; index < this.contestants.length; index++) {
      if (index === 0) {
        this.contestants[index].rank = 1;
      } else {
        this.contestants[index].rank = this.contestants[index - 1].rank;
        if (this.contestants[index].points !== this.contestants[index - 1].points ||
          this.contestants[index].penalties !== this.contestants[index - 1].penalties) {
          this.contestants[index].rank = index + 1;
        }
      }
    }
  }

  reloadPage() {
    this.service.getContestProblems(this.contest.id).subscribe(
      (problems: any) => {
        this.contestProblems = sortContestProblems(problems);
      }
    );
    this.reloadContestants();
  }

  getProblemInfoBySymbol(
    problemsInfo: Array<ContestProblemInfo>,
    problemSymbol: string
  ): ContestProblemInfo | undefined {
    return problemsInfo.find(problemInfo => problemInfo.problemSymbol === problemSymbol);
  }

  ngOnDestroy() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
