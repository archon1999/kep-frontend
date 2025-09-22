import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { WeekdaySolved, MonthSolved, PeriodSolved } from '@problems/models/statistics.models';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'section-time',
  templateUrl: './section-time.component.html',
  styleUrls: ['./section-time.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
  ]
})
export class SectionTimeComponent implements OnChanges {

  @Input() byWeekday: WeekdaySolved[] = [];
  @Input() byMonth: MonthSolved[] = [];
  @Input() byPeriod: PeriodSolved[] = [];

  public byWeekdayChart: ChartOptions | null = null;
  public byMonthChart: ChartOptions | null = null;
  public byPeriodChart: ChartOptions | null = null;

  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['byWeekday']) {
      this.buildWeekdayChart();
    }
    if (changes['byMonth']) {
      this.buildMonthChart();
    }
    if (changes['byPeriod']) {
      this.buildPeriodChart();
    }
  }

  private buildWeekdayChart() {
    if (!this.byWeekday?.length) {
      this.byWeekdayChart = null;
      return;
    }
    const labels = this.byWeekday.map((item) => this.translateService.instant(item.day));
    const values = this.byWeekday.map((item) => item.solved);
    this.byWeekdayChart = this.createHorizontalBar(labels, values);
  }

  private buildMonthChart() {
    if (!this.byMonth?.length) {
      this.byMonthChart = null;
      return;
    }
    const labels = this.byMonth.map((item) => this.translateService.instant(item.month));
    const values = this.byMonth.map((item) => item.solved);
    this.byMonthChart = this.createHorizontalBar(labels, values);
  }

  private buildPeriodChart() {
    if (!this.byPeriod?.length) {
      this.byPeriodChart = null;
      return;
    }
    const labels = this.byPeriod.map((item) => item.period);
    const values = this.byPeriod.map((item) => item.solved);
    this.byPeriodChart = this.createHorizontalBar(labels, values);
  }

  private createHorizontalBar(labels: string[], values: number[]): ChartOptions {
    return {
      series: [
        {
          name: this.translateService.instant('Solved'),
          data: values,
        }
      ],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 8,
        },
      },
      colors: ['#7367f0'],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '0.85rem',
          }
        }
      },
      grid: {
        strokeDashArray: 5,
      },
    };
  }
}
