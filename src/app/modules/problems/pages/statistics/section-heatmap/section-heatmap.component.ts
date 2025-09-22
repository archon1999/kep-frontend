import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { HeatmapEntry } from '@problems/models/statistics.models';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'section-heatmap',
  templateUrl: './section-heatmap.component.html',
  styleUrls: ['./section-heatmap.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
    SpinnerComponent,
  ]
})
export class SectionHeatmapComponent implements OnChanges {

  @Input() heatmap: HeatmapEntry[] = [];
  @Input() availableYears: number[] = [];
  @Input() selectedYear: number | null = null;
  @Input() isLoading = false;
  @Output() yearChange = new EventEmitter<number>();

  public heatmapChart: ChartOptions | null = null;
  public hasData = false;

  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['heatmap']) {
      this.buildHeatmap();
    }
  }

  onSelectYear(year: number) {
    if (year !== this.selectedYear) {
      this.yearChange.emit(year);
    }
  }

  private buildHeatmap() {
    if (!this.heatmap || this.heatmap.length === 0) {
      this.hasData = false;
      this.heatmapChart = null;
      return;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const series = days.map((day) => ({
      name: this.translateService.instant(day),
      data: [] as Array<{ x: Date; y: number }>,
    }));

    for (const data of this.heatmap) {
      const date = new Date(data.date);
      const weekday = (date.getDay() + 6) % 7; // convert Sunday(0) -> 6
      series[weekday].data.push({
        x: date,
        y: data.solved,
      });
    }

    this.heatmapChart = {
      series,
      chart: {
        height: 320,
        type: 'heatmap',
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: '#f4f5fa' },
              { from: 1, to: 3, color: '#c7d2fe' },
              { from: 4, to: 7, color: '#a5b4fc' },
              { from: 8, to: 12, color: '#818cf8' },
              { from: 13, to: 999, color: '#4f46e5' },
            ],
          },
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM',
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      stroke: {
        width: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ${this.translateService.instant('Solved')}`,
        },
      },
    };

    this.hasData = true;
  }
}
