import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'app/auth/models';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { BaseComponent } from '@shared/components/classes/base.component';

export interface TopRating {
  username: string;
  ratingTitle: string;
  solved: number;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.scss'],
})
export class SectionSidebarComponent extends BaseComponent implements OnInit {

  public activityChart: ChartOptions;
  public activityDays = 7;
  public activitySolved = 0;

  public topRatingOption = 0;
  public topRating: Array<TopRating> = [];

  public lastAttempts: Array<Attempt> = [];

  public solvedText: string;

  constructor(
    public service: ProblemsService,
    public translateService: TranslateService,
    public statisticsService: ProblemsStatisticsService,
  ) {
    super();
  }

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
    );

    this.translateService.get('Solved').subscribe(
      (text: string) => {
        this.solvedText = text;
      }
    );

    this.activityDataUpdate(this.activityDays);
  }

  loadTopRating(option: number) {
    if (option === 0) {
      this.service.getProblemsRating(1, 10).subscribe((result: any) => {
        this.topRating = result.data.map((rating: any) => {
          return {
            username: rating.user.username,
            solved: rating.solved,
            ratingTitle: rating.user.ratingTitle,
          };
        });
      });
    } else {
      let obs;
      if (option === 1) {
        obs = this.service.getProblemsRatingToday();
      } else if (option === 2) {
        obs = this.service.getProblemsRatingWeek();
      } else {
        obs = this.service.getProblemsRatingMonth();
      }
      obs.subscribe((result: any) => {
        this.topRating = result;
      });
    }
  }


  activityDataUpdate(days: number) {
    if (!this.currentUser) {
      return;
    }
    const username = this.currentUser.username;
    this.statisticsService.getLastDays(username, days).subscribe((result: any) => {
      this.activitySolved = result.solved;
      const data = [];
      let days = 0;
      for (const y of result.series) {
        const dt = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
        data.push({
          x: dt.toDateString(),
          y: y,
        });
        days++;
      }
      this.activityChart = {
        chart: {
          type: 'line',
          sparkline: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 5
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function (val) {
              return val + '';
            },
          }
        },
        series: [
          {
            name: this.solvedText,
            data: data,
          }
        ],
      };
    });
  }

}
