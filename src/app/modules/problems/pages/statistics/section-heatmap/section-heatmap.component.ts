import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'section-heatmap',
  templateUrl: './section-heatmap.component.html',
  styleUrls: ['./section-heatmap.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbButtonsModule,
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
    public coreConfigService: CoreConfigService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.heatmapUpdate(0);
  }

  heatmapUpdate(year: number) {
    this.heatmapYear = year;
    const username = this.username;
    const translations = this.translateService.translations[this.translateService.currentLang];
    this.statisticsService.getHeatmap(username, this.heatmapYear).subscribe((result: any) => {
      const series = [{
        name: translations['Monday'],
        data: [],
      }, {
        name: translations['Tuesday'],
        data: [],
      }, {
        name: translations['Wednesday'],
        data: [],
      }, {
        name: translations['Thursday'],
        data: [],
      }, {
        name: translations['Friday'],
        data: [],
      }, {
        name: translations['Saturday'],
        data: [],
      }, {
        name: translations['Sunday'],
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
