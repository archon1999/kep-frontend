import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import {
  WeekdayStatistics,
  MonthStatistics,
  PeriodStatistics,
} from '@problems/models/statistics.models';

@Component({
  selector: 'section-time',
  templateUrl: './section-time.component.html',
  styleUrls: ['./section-time.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
  ]
})
export class SectionTimeComponent implements OnChanges {

  @Input() weekdays: WeekdayStatistics[] = [];
  @Input() months: MonthStatistics[] = [];
  @Input() periods: PeriodStatistics[] = [];

  public byWeekdayChart: any;
  public byMonthChart: any;
  public byPeriodChart: any;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weekdays']) {
      this.buildWeekdayChart();
    }

    if (changes['months']) {
      this.buildMonthChart();
    }

    if (changes['periods']) {
      this.buildPeriodChart();
    }
  }

  private buildWeekdayChart() {
    if (!this.weekdays) {
      this.byWeekdayChart = null;
      return;
    }

    const labels = this.weekdays.map((item) => this.translateService.instant(item.day));
    const values = this.weekdays.map((item) => item.solved);

    this.byWeekdayChart = this.createHorizontalBarChart(labels, values);
  }

  private buildMonthChart() {
    if (!this.months) {
      this.byMonthChart = null;
      return;
    }

    const labels = this.months.map((item) => this.translateService.instant(item.month));
    const values = this.months.map((item) => item.solved);

    this.byMonthChart = this.createHorizontalBarChart(labels, values);
  }

  private buildPeriodChart() {
    if (!this.periods) {
      this.byPeriodChart = null;
      return;
    }

    const labels = this.periods.map((item) => item.period);
    const values = this.periods.map((item) => item.solved);

    this.byPeriodChart = this.createHorizontalBarChart(labels, values);
  }

  private createHorizontalBarChart(labels: string[], values: number[]) {
    return {
      series: [
        {
          name: this.translateService.instant('Solved'),
          data: values,
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: labels
      }
    };
  }
}
