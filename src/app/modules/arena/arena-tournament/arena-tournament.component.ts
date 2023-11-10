import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bounceOnEnterAnimation, fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Challenge } from '../../challenges/models/challenges.models';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Arena, ArenaPlayer, ArenaPlayerStatistics } from '../arena.models';
import { ArenaService } from '../arena.service';

@Component({
  selector: 'app-arena-tournament',
  templateUrl: './arena-tournament.component.html',
  styleUrls: ['./arena-tournament.component.scss'],
  animations: [
    bounceOnEnterAnimation({ anchor: 'bounce3', delay: 1000, duration: 1000 }),
    bounceOnEnterAnimation({ anchor: 'bounce2', delay: 2000, duration: 1000 }),
    bounceOnEnterAnimation({ anchor: 'bounce1', delay: 3000, duration: 1000 }),
    fadeInAnimation({ duration: 3000 }),
    fadeInLeftAnimation({ duration: 3000 }),
    fadeInRightAnimation({ duration: 3000 }),
  ]
})
export class ArenaTournamentComponent implements OnInit, OnDestroy {
  public startAnimationState = false;

  public arena: Arena;

  public arenaPlayers: Array<ArenaPlayer> = [];
  public pageNumber = 1;
  public total = 0;
  public me = false;

  public arenaChallenges: Array<Challenge> = [];
  public arenaChallengesPage = 1;
  public arenaChallengesPageSize = 8;
  public arenaChallengesTotal = 0;

  public arenaStatistics = {
    averageRating: 0,
    challenges: 0,
  };
  public arenaPlayerStatistics: ArenaPlayerStatistics;
  public top3: Array<ArenaPlayerStatistics> = [];

  public leftTime: number = 0;

  public currentUser: User;

  private _unsubscribeAll = new Subject();
  private _intervalId: any;
  private _intervalId2: any;

  public remainingTime: number;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: ArenaService,
    public authService: AuthenticationService,
    public titleService: TitleService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => this.startAnimationState = true);
    this.route.data.subscribe(({ arena }) => {
      this.arena = arena;
      this.titleService.updateTitle(this.route, { arenaTitle: arena.title });
      this.updateArenaChallenges();
      this.updateArenaPlayers();
      if (this.arena.status == -1) {
        this.leftTime = new Date(arena.startTime).valueOf() - Date.now();
      } else if (this.arena.status == 0) {
        this.leftTime = new Date(arena.finishTime).valueOf() - Date.now();
        this._intervalId = setInterval(() => {
          if (this.arena.isRegistrated) {
            this.nextChallenge();
          }
          this.updateArenaPlayers();
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
      }
    });

    if (this.arena.status == 0) {
      this.updateRemainingTime();
      this._intervalId2 = setInterval(() => {
        this.updateRemainingTime();
      }, 5000);
    }

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
        if (this.currentUser && this.arena.status != -1) {
          this.loadArenaPlayerStatistics(user.username);
        }
      }
    );
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

  updateArenaPlayers() {
    if (!this.me) {
      this.me = true;
      if (this.arena.isRegistrated) {
        this.service.getStandingsPage(this.arena.id).subscribe(
          (result: any) => {
            this.total = result.total;
            this.pageNumber = result.page;
            this.updateArenaPlayers();
          }
        );
      } else {
        this.me = true;
        this.pageNumber = 1;
        this.updateArenaPlayers();
      }
    } else {
      this.service.getArenaPlayers(this.arena.id, this.pageNumber).subscribe(
        (result: any) => {
          this.arenaPlayers = result.data;
          this.total = result.total;
        }
      );
    }
  }

  updateArenaChallenges() {
    this.service.getArenaChallenges(this.arena.id).subscribe(
      (challenges: any) => {
        this.arenaChallenges = challenges;
      }
    );
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
      }, (err: any) => {
      }
    );
  }

  register() {
    this.service.arenaRegistration(this.arena.id).subscribe((result) => {
      this.arena.isRegistrated = true;
      this.arena.pause = true;
    });
  }

  arenaPause() {
    this.service.arenaPause(this.arena.id).subscribe((result: any) => {
      this.arena.pause = true;
    });
  }

  arenaStart() {
    this.service.arenaStart(this.arena.id).subscribe((result: any) => {
      this.arena.pause = false;
    });
  }

  refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    if (this._intervalId2) {
      clearInterval(this._intervalId2);
    }
  }

}
