import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'problems-activity-card',
  templateUrl: './problems-activity-card.component.html',
  styleUrls: ['./problems-activity-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepIconComponent,
    KepCardComponent,
    TranslateModule,
  ]
})
export class ProblemsActivityCardComponent implements OnChanges {

  @Input() solved = 0;
  @Input() series: number[] = [];
  @Input() selectedDays = 7;
  @Input() allowedDays: number[] = [];
  @Output() daysChange = new EventEmitter<number>();

  public activityChart: ChartOptions;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.buildChart();
    }
  }

  public onDaysChange(days: number) {
    this.daysChange.emit(days);
  }

  private buildChart() {
    const points = [];
    if (!this.series?.length) {
      this.activityChart = null;
      return;
    }

    let offset = 0;
    for (const value of this.series) {
      const dt = new Date();
      dt.setDate(dt.getDate() - offset);
      points.push({ x: dt, y: value });
      offset++;
    }

    points.sort((a, b) => (a.x as Date).getTime() - (b.x as Date).getTime());

    this.activityChart = {
      chart: {
        type: 'line',
        height: '200px',
        sparkline: { enabled: true },
      },
      dataLabels: { enabled: false },
      xaxis: { type: 'datetime' },
      stroke: { curve: 'smooth', width: 2 },
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
          data: points,
        }
      ],
    };
  }
}
