import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { LastDays } from '@problems/models/statistics.models';

@Component({
  selector: 'problems-activity-card',
  templateUrl: './problems-activity-card.component.html',
  styleUrls: ['./problems-activity-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepIconComponent,
    SpinnerComponent,
    KepCardComponent,
  ]
})
export class ProblemsActivityCardComponent implements OnChanges {

  @Input() lastDays: LastDays | null = null;
  @Input() selectedDays = 7;
  @Input() daysOptions: number[] = [];
  @Input() isLoading = false;
  @Output() daysChange = new EventEmitter<number>();

  public activitySolved = 0;
  public activityChart: ChartOptions | null = null;

  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastDays']) {
      this.buildChart();
    }
  }

  onSelectDays(days: number) {
    if (days !== this.selectedDays) {
      this.daysChange.emit(days);
    }
  }

  get hasActivity(): boolean {
    return !!(this.lastDays && this.lastDays.solved > 0);
  }

  private buildChart() {
    if (!this.lastDays) {
      this.activitySolved = 0;
      this.activityChart = null;
      return;
    }

    this.activitySolved = this.lastDays.solved;
    const data = [];
    let offset = 0;
    for (const value of this.lastDays.series) {
      const dt = new Date();
      dt.setHours(0, 0, 0, 0);
      dt.setDate(dt.getDate() - offset);
      data.push({
        x: new Date(dt),
        y: value,
      });
      offset++;
    }

    this.activityChart = {
      chart: {
        type: 'area',
        sparkline: { enabled: true },
      },
      dataLabels: { enabled: false },
      xaxis: {
        type: 'datetime',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      yaxis: {
        labels: {
          show: false,
          formatter: (val: number) => val.toFixed(0),
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      series: [
        {
          name: this.translateService.instant('Solved'),
          data,
        }
      ],
      tooltip: {
        x: {
          format: 'dd MMM',
        },
      },
    };
  }
}
