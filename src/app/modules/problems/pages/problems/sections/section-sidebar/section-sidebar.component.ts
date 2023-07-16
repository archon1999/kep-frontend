import { Component, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '../../../../models/attempts.models';
import { ProblemsService } from '../../../../../problems/problems.service';
import { ProblemsStatisticsService } from '../../../../../problems/problems-statistics.service';

export interface TopRating {
  username: string;
  ratingTitle: string;
  solved: number;
}

@Component({
  selector: 'section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.scss'],
})
export class SectionSidebarComponent implements OnInit {

  public activityChart: any;
  public activityDays = 7;
  public activitySolved = 0;

  public chartTheme: {
    mode: string,
  };

  public topRatingOption = 0;
  public topRating: Array<TopRating> = [];

  public lastAttempts: Array<Attempt> = [];

  public solvedText: string;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ProblemsService,
    public translateService: TranslateService,
    public authService: AuthenticationService,
    public statisticsService: ProblemsStatisticsService,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        if (this.currentUser) {
          this.service
            .getUserAttempts(this.currentUser.username, 1, 10)
            .subscribe((result: any) => this.lastAttempts = result.data);
        } else {
          this.lastAttempts = [];
        }
        this.loadTopRating(this.topRatingOption);
      }
    )

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        if (config.layout.skin == 'dark') {
          this.chartTheme = {
            mode: 'dark',
          }
        } else {
          this.chartTheme = {
            mode: 'light',
          }
        }
      }
    );

    this.translateService.get('Solved').subscribe(
      (text: string) => {
        this.solvedText = text;
      }
    )

    this.activityDataUpdate(this.activityDays);

  }

  loadTopRating(option: number) {
    if (option == 0) {
      this.service.getProblemsRating(1, 10).subscribe((result: any) => {
        this.topRating = result.data.map((rating: any) => {
          return {
            username: rating.user.username,
            solved: rating.solved,
            ratingTitle: rating.user.ratingTitle,
          }
        });
      })
    } else {
      let obs;
      if (option == 1) {
        obs = this.service.getProblemsRatingToday();
      } else if (option == 2) {
        obs = this.service.getProblemsRatingWeek();
      } else {
        obs = this.service.getProblemsRatingMonth();
      }
      obs.subscribe((result: any) => {
        this.topRating = result;
      })
    }
  }


  activityDataUpdate(days: number) {
    if (!this.currentUser) return;
    let username = this.currentUser.username;
    this.statisticsService.getLastDays(username, days).subscribe((result: any) => {
      this.activitySolved = result.solved;
      let data = [];
      let days = 0;
      for (let y of result.series) {
        let dt = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
        data.push({
          x: dt.toDateString(),
          y: y,
        });
        days++;
      }
      this.activityChart = {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          }
        },
        colors: ['#7367F0'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 5
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            gradientToColors: ['#A9A2F6'],
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function (val) {
              return val + "";
            },
          }
        },
        series: [
          {
            name: this.solvedText,
            data: data,
          }
        ],
        tooltip: {
          x: { show: false }
        }
      };

    })
  }

}
