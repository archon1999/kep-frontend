import { Component, Input, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'problems-activity-card',
  templateUrl: './problems-activity-card.component.html',
  styleUrls: ['./problems-activity-card.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepIconComponent,
    SpinnerComponent,
  ]
})
export class ProblemsActivityCardComponent implements OnInit {

  @Input() username: string;

  public activityDays = 7;
  public activitySolved = 0;
  public activityChart: ChartOptions;

  public isLoading = true;

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.activityDataUpdate(this.activityDays);
  }

  activityDataUpdate(days: number) {
    this.isLoading = true;
    const username = this.username;
    this.activityDays = days;
    this.statisticsService.getLastDays(username, days).subscribe((result: any) => {
      this.isLoading = false;
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
            formatter(val: number): string {
              return val.toFixed(0);
            }
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
