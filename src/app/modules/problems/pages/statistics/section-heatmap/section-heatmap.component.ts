import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { HeatmapEntry } from '@problems/models/statistics.models';

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
export class SectionHeatmapComponent implements OnChanges {

  @Input() heatmap: HeatmapEntry[] = [];
  @Input() years: number[] = [];
  @Input() selectedYear: number;

  @Output() yearChange = new EventEmitter<number>();

  public heatmapYear: number;
  public heatmapChart: ChartOptions;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear']) {
      this.heatmapYear = this.selectedYear;
    }

    if (changes['heatmap']) {
      this.buildChart();
    }
  }

  onYearChange(year: number) {
    if (this.heatmapYear === year) {
      return;
    }

    this.heatmapYear = year;
    this.yearChange.emit(year);
  }

  private buildChart() {
    if (!this.heatmap) {
      this.heatmapChart = null;
      return;
    }

    const dayNames = [
      this.translateService.instant('Sunday'),
      this.translateService.instant('Monday'),
      this.translateService.instant('Tuesday'),
      this.translateService.instant('Wednesday'),
      this.translateService.instant('Thursday'),
      this.translateService.instant('Friday'),
      this.translateService.instant('Saturday'),
    ];

    const series = dayNames.map((name) => ({
      name,
      data: [] as { x: Date; y: number }[],
    }));

    for (const item of this.heatmap) {
      const date = new Date(item.date);
      const weekday = date.getDay();
      series[weekday].data.push({
        x: date,
        y: item.solved,
      });
    }

    this.heatmapChart = {
      series,
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
  }

}
