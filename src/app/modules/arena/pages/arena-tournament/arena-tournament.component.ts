import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  bounceOnEnterAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation
} from 'angular-animations';
import { Arena, ArenaPlayer, ArenaPlayerStatistics, ArenaStatus } from '../../arena.models';
import { ArenaService } from '../../arena.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ArenaPlayerStatisticsComponent } from '../../components/arena-player-statistics/arena-player-statistics.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { ArenaChallengesComponent } from '@arena/pages/arena-tournament/arena-challenges/arena-challenges.component';
import { Observable } from 'rxjs';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { PageResult } from '@shared/components/classes/page-result';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-arena-tournament',
  templateUrl: './arena-tournament.component.html',
  styleUrls: ['./arena-tournament.component.scss'],
  animations: [
    bounceOnEnterAnimation({ anchor: 'bounce3', delay: 1000, duration: 1000 }),
    bounceOnEnterAnimation({ anchor: 'bounce2', delay: 2000, duration: 1000 }),
    bounceOnEnterAnimation({ anchor: 'bounce1', delay: 3000, duration: 1000 }),
    fadeInOnEnterAnimation({ duration: 1500 }),
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1500 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ArenaPlayerStatisticsComponent,
    NgxSkeletonLoaderModule,
    NgbAlertModule,
    KepPaginationComponent,
    ChallengesUserViewModule,
    CountdownComponent,
    ArenaChallengesComponent,
    KepTableComponent,
  ]
})
export class ArenaTournamentComponent extends BaseTablePageComponent<ArenaPlayer> implements OnInit, OnDestroy {
  override defaultPageNumber = 1;
  override pageSize = 10;
  override maxSize = 5;

  public arena: Arena;
  public me = false;

  public arenaStatistics = {
    averageRating: 0,
    challenges: 0,
  };
  public arenaPlayerStatistics: ArenaPlayerStatistics;
  public top3: Array<ArenaPlayerStatistics> = [];

  public leftTime = 0;
  public remainingTime: number;

  public _intervalId1: any;
  public _intervalId2: any;

  constructor(public service: ArenaService) {
    super();
  }

  get arenaPlayers(): ArenaPlayer[] {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ arena }) => {
      this.arena = arena;
      this.titleService.updateTitle(this.route, { arenaTitle: arena.title });
      this.reloadPage();
      if (this.arena.status === ArenaStatus.NotStarted) {
        this.leftTime = new Date(arena.startTime).valueOf() - Date.now();
      } else if (this.arena.status === ArenaStatus.Already) {
        this.leftTime = new Date(arena.finishTime).valueOf() - Date.now();
        this._intervalId1 = setInterval(() => {
          if (this.arena.isRegistrated) {
            this.nextChallenge();
          }
          if (this.currentUser) {
            this.loadArenaPlayerStatistics(this.currentUser.username);
          }
          this.reloadPage();
        }, 5000);
      } else {
        this.service.getTop3(this.arena.id).subscribe(
          (result: any) => {
            this.top3 = result;
          }
        );
        this.service.getArenaStatistics(this.arena.id).subscribe(
          (result: any) => {
            this.arenaStatistics = result;
          }
        );
        if (this.currentUser) {
          this.loadArenaPlayerStatistics(this.currentUser.username);
        }
      }
    });

    if (this.arena.status === ArenaStatus.Already) {
      this._intervalId2 = setInterval(() => {
        this.updateRemainingTime();
      }, 5000);
    }
  }

  updateRemainingTime() {
    this.remainingTime = new Date(this.arena.finishTime).valueOf() - Date.now();
  }

  loadArenaPlayerStatistics(username: string) {
    this.service.getArenaPlayerStatistics(this.arena.id, username).subscribe(
      (result: any) => {
        this.arenaPlayerStatistics = result;
      }
    );
  }

  getPage(): Observable<PageResult<ArenaPlayer>> {
    if (!this.me) {
      this.me = true;
      if (this.arena.isRegistrated) {
        return this.service.getStandingsPage(this.arena.id).pipe(
          switchMap((result: any) => {
            this.pageNumber = result.page;
            return this.service.getArenaPlayers(this.arena.id, this.pageNumber);
          })
        );
      }
    }
    return this.service.getArenaPlayers(this.arena.id, this.pageNumber);
  }

  nextChallenge() {
    this.service.nextChallenge(this.arena.id).subscribe(
      (result: any) => {
        if (result.success) {
          this.router.navigate(
            ['/practice', 'challenges', 'challenge', result.challengeId],
            { queryParams: { 'arena': this.arena.id } }
          );
        }
      }
    );
  }

  register() {
    this.service.arenaRegistration(this.arena.id).subscribe(() => {
      this.arena.isRegistrated = true;
      this.arena.pause = true;
    });
  }

  arenaPause() {
    this.service.arenaPause(this.arena.id).subscribe(() => {
      this.arena.pause = true;
    });
  }

  arenaStart() {
    this.service.arenaStart(this.arena.id).subscribe(() => {
      this.arena.pause = false;
    });
  }

  refreshPage() {
    setTimeout(() => window.location.reload(), 1000);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._intervalId1) {
      clearInterval(this._intervalId1);
    }
    if (this._intervalId2) {
      clearInterval(this._intervalId2);
    }
  }

}
