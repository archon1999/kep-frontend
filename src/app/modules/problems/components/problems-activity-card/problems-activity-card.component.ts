import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { LastDaysStatistics } from '@problems/models/statistics.models';

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

  @Input() days = 7;
  @Input() allowedDays: number[] = [];
  @Input() activity: LastDaysStatistics;

  @Output() daysChange = new EventEmitter<number>();

  public activityChart: ChartOptions;
  public activitySolved = 0;
  public activityDays = 7;
  public isLoading = true;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['days']) {
      this.activityDays = this.days;
    }

    if (changes['activity']) {
      this.updateActivity(this.activity);
    }
  }

  onDaysChange(value: number) {
    if (this.activityDays === value) {
      return;
    }

    this.activityDays = value;
    this.daysChange.emit(value);
  }

  private updateActivity(activity: LastDaysStatistics) {
    if (!activity) {
      this.isLoading = true;
      this.activityChart = undefined;
      this.activitySolved = 0;
      return;
    }

    this.isLoading = false;
    this.activitySolved = activity.solved;

    const data = [];
    const now = new Date();
    const series = activity.series ?? [];

    for (let index = 0; index < series.length; index++) {
      const dayOffset = series.length - index - 1;
      const date = new Date(now);
      date.setDate(now.getDate() - dayOffset);
      data.push({
        x: date,
        y: series[index],
      });
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
          formatter: (val: number) => val.toFixed(0),
        }
      },
      series: [
        {
          name: this.translateService.instant('Solved'),
          data,
        }
      ],
    };
  }
}
