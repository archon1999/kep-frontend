import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HomeService } from '../home.service';

@Component({
  selector: 'activity-section',
  templateUrl: './activity-section.component.html',
  styleUrls: ['./activity-section.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 3000 })]
})
export class ActivitySectionComponent implements OnInit, OnDestroy {

  public fromNow = 0;

  public currentUser: User;

  public statistics = {
    attempts: 0,
    problems: 0,
    dailyActivity: true,
    tests: 0,
    challenges: {
      wins: 0,
      draws: 0,
      losses: 0,
    },
    date: '',
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public service: HomeService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        if (user) {
          this.currentUser = user;
          this.loadStatistics(this.fromNow);
        }
      }
    )
  }

  loadStatistics(fromNow: number) {
    this.fromNow = fromNow;
    this.service.getUserDailyStatistics(this.currentUser.username, fromNow).subscribe(
      (statistics: any) => {
        this.statistics = statistics;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
