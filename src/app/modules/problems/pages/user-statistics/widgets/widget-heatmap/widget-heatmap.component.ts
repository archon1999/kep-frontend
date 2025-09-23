import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { colors } from "@core/config/colors";

@Component({
  selector: 'widget-heatmap',
  templateUrl: './widget-heatmap.component.html',
  styleUrls: ['./widget-heatmap.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
    TranslateModule,
  ]
})
export class WidgetHeatmapComponent implements OnChanges {

  @Input() heatmap: Array<any> = [];
  @Input() selectedYear: number | null = null;
  @Input() availableYears: number[] = [];
  @Output() yearChange = new EventEmitter<number>();

  public heatmapChart: ChartOptions;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['heatmap']) {
      this.buildChart();
    }
  }

  onYearChange(year: number) {
    this.yearChange.emit(year);
  }

  private buildChart() {
    if (!this.heatmap?.length) {
      this.heatmapChart = null;
      return;
    }

    const series = [
      { name: this.translateService.instant('Sunday'), data: [] },
      { name: this.translateService.instant('Monday'), data: [] },
      { name: this.translateService.instant('Tuesday'), data: [] },
      { name: this.translateService.instant('Wednesday'), data: [] },
      { name: this.translateService.instant('Thursday'), data: [] },
      { name: this.translateService.instant('Friday'), data: [] },
      { name: this.translateService.instant('Saturday'), data: [] }
    ];

    for (const item of this.heatmap ?? []) {
      const date = new Date(item.date);
      const weekday = date.getDay();
      const index = weekday;
      if (series[index]) {
        series[index].data.push({ x: date, y: item.solved });
      }
    }

    this.heatmapChart = {
      series,
      chart: {
        height: 320,
        type: 'heatmap',
        toolbar: { show: false }
      },
      colors: [colors.solid.primary],
      dataLabels: { enabled: false },
      stroke: { width: 1 },
      xaxis: {
        type: 'datetime',
        labels: { format: 'MMM' }
      },
      yaxis: { show: false }
    };
  }
}
