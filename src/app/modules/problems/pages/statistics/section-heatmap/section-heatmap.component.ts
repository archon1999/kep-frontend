import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'section-heatmap',
  templateUrl: './section-heatmap.component.html',
  styleUrls: ['./section-heatmap.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
  ]
})
export class SectionHeatmapComponent implements OnInit {

  @Input() username: string;
  @Input() chartTheme: string;

  public heatmap: Array<any>;
  public heatmapYear = 0;
  public heatmapChart: ChartOptions;

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.heatmapUpdate(0);
  }

  heatmapUpdate(year: number) {
    this.heatmapYear = year;
    const username = this.username;
    this.statisticsService.getHeatmap(username, this.heatmapYear).subscribe((result: any) => {
      const series = [{
        name: this.translateService.instant('Monday'),
        data: [],
      }, {
        name: this.translateService.instant('Tuesday'),
        data: [],
      }, {
        name: this.translateService.instant('Wednesday'),
        data: [],
      }, {
        name: this.translateService.instant('Thursday'),
        data: [],
      }, {
        name: this.translateService.instant('Friday'),
        data: [],
      }, {
        name: this.translateService.instant('Saturday'),
        data: [],
      }, {
        name: this.translateService.instant('Sunday'),
        data: [],
      }];
      for (const data of result) {
        const date = new Date(data.date);
        const weekday = date.getDay();
        series[weekday].data.push({
          x: date,
          y: data.solved,
        });
      }
      this.heatmapChart = {
        series: series,
        chart: {
          height: 350,
          type: 'heatmap',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM',
          }
        },
        yaxis: {
          show: false,
        }
      };
      this.heatmap = result;
    });
  }

}
