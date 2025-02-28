import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { Arena, ArenaPlayerStatistics, ArenaStatistics, ArenaStatus } from '../../arena.models';
import { ArenaService } from '../../arena.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ArenaPlayerStatisticsComponent
} from '../../components/arena-player-statistics/arena-player-statistics.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { ArenaChallengesComponent } from '@arena/pages/arena-tournament/arena-challenges/arena-challenges.component';
import { interval } from 'rxjs';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { takeUntil } from 'rxjs/operators';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ArenaCardComponent } from '@arena/components/arena-card/arena-card.component';
import { ArenaChaptersComponent } from '@arena/pages/arena-tournament/arena-chapters/arena-chapters.component';
import { ArenaCountdownComponent } from '@arena/pages/arena-tournament/arena-countdown/arena-countdown.component';
import { ArenaStatisticsComponent } from '@arena/pages/arena-tournament/arena-statistics/arena-statistics.component';
import { ArenaWinnersComponent } from '@arena/pages/arena-tournament/arena-winners/arena-winners.component';
import { ArenaPlayersComponent } from '@arena/pages/arena-tournament/arena-players/arena-players.component';
import { BaseComponent } from '@app/common';
import { getResourceById, Resources } from '@app/resources';
import { ArenaInfoComponent } from '@arena/pages/arena-tournament/arena-info/arena-info.component';

@Component({
  selector: 'app-arena-tournament',
  templateUrl: './arena-tournament.component.html',
  styleUrls: ['./arena-tournament.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ArenaPlayerStatisticsComponent,
    NgxSkeletonLoaderModule,
    NgbAlertModule,
    KepPaginationComponent,
    CountdownComponent,
    ChallengesUserViewComponent,
    ArenaChallengesComponent,
    KepTableComponent,
    ArenaCardComponent,
    ArenaChaptersComponent,
    ArenaCountdownComponent,
    ArenaStatisticsComponent,
    ArenaWinnersComponent,
    ArenaPlayersComponent,
    ArenaInfoComponent,
  ]
})
export class ArenaTournamentComponent extends BaseComponent implements OnInit {

  public arena: Arena;

  public arenaStatistics: ArenaStatistics;
  public arenaPlayerStatistics: ArenaPlayerStatistics;

  public remainingTime: number;

  protected readonly ArenaStatus = ArenaStatus;
  private _intervalId: any;

  constructor(public service: ArenaService) {
    super();
  }

  ngOnInit(): void {
    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        this.updateRemainingTime();
      }
    );

    this.route.data.subscribe(({arena}) => {
      this.arena = arena;
      this.titleService.updateTitle(this.route, {arenaTitle: arena.title});
      if (this.arena.status === ArenaStatus.Already) {
        this._intervalId = setInterval(
          () => {
            if (this.arena.isRegistrated) {
              this.nextChallenge();
            }
          },
          3000
        );
        if (this.currentUser) {
          this.loadArenaPlayerStatistics(this.currentUser.username);
        }
      } else if (this.arena.status === ArenaStatus.Finished) {
        if (this.currentUser) {
          this.loadArenaPlayerStatistics(this.currentUser.username);
        }
      }
    });
  }

  updateRemainingTime() {
    this.remainingTime = new Date(this.arena.finishTime).valueOf() - Date.now();
  }

  loadArenaPlayerStatistics(arenaPlayerUsername: string) {
    this.service.getArenaPlayerStatistics(this.arena.id, arenaPlayerUsername).subscribe(
      (result: any) => {
        this.arenaPlayerStatistics = result;
      }
    );
  }

  nextChallenge() {
    this.service.nextChallenge(this.arena.id).subscribe(
      (result: any) => {
        if (result.challengeId) {
          this.router.navigate(
            [getResourceById(Resources.Challenge, result.challengeId)],
            {queryParams: {'arena': this.arena.id}}
          );
        }
      }
    );
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

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }
}
