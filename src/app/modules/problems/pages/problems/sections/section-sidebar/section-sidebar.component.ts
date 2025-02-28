import { Component, OnInit } from '@angular/core';
import { Attempt } from '@problems/models/attempts.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { BaseComponent } from '@app/common/classes/base.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { PageResult } from '@app/common/classes/page-result';
import { Observable } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";

export interface TopRating {
  username: string;
  ratingTitle: string;
  solved: number;
}

@Component({
  selector: 'section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    ApexChartModule,
    ContestantViewModule,
    FormsModule,
    TranslatePipe,
  ]
})
export class SectionSidebarComponent extends BaseComponent implements OnInit {

  public activityChart: ChartOptions;
  public activityDays = 7;
  public activitySolved = 0;

  public topRatingOption = 1;
  public topRating: Array<TopRating> = [];

  public lastAttempts: Array<Attempt> = [];

  constructor(
    public service: ProblemsApiService,
    public statisticsService: ProblemsStatisticsService,
  ) {
    super();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.currentUser) {
        this.service.getUserAttempts({
          username: this.currentUser.username,
          pageSize: 10,
        }).subscribe(
          (result: PageResult<Attempt>) => {
            this.lastAttempts = result.data;
          }
        );
      }
      this.activityDataUpdate(this.activityDays);
      this.loadTopRating(this.topRatingOption);
    });
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
      let obs: Observable<any>;
      if (option === 1) {
        obs = this.service.getCurrentProblemsRating('today');
      } else if (option === 2) {
        obs = this.service.getCurrentProblemsRating('week');
      } else {
        obs = this.service.getCurrentProblemsRating('month');
      }
      obs.subscribe((result: any) => {
        this.topRating = result;
      });
    }
  }


  activityDataUpdate(days: number) {
    const username = this.currentUser.username;
    this.statisticsService.getLastDays(username, days).subscribe((result: any) => {
      this.activitySolved = result.solved;
      const data = [];
      let days = 0;
      for (const y of result.series) {
        const dt = new Date();
        dt.setDate(dt.getDate() - days);
        data.push({
          x: dt,
          y: y,
        });
        days++;
      }
      this.activityChart = {
        chart: {
          type: 'line',
          sparkline: {
            enabled: true
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        yaxis: {
          labels: {
            show: false,
          }
        },
        series: [
          {
            name: this.translateService.instant('Solved'),
            data: data,
          }
        ],
      };
    });
  }

}
