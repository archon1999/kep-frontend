import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'widget-time',
  templateUrl: './widget-time.component.html',
  styleUrls: ['./widget-time.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
    TranslateModule,
  ]
})
export class WidgetTimeComponent implements OnChanges {

  @Input() byWeekday: any[] = [];
  @Input() byMonth: any[] = [];
  @Input() byPeriod: any[] = [];

  public byWeekdayChart: any;
  public byMonthChart: any;
  public byPeriodChart: any;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['byWeekday']) {
      this.byWeekdayChart = this.buildChart(this.byWeekday, (item) => this.translateService.instant(item.day));
    }
    if (changes['byMonth']) {
      this.byMonthChart = this.buildChart(this.byMonth, (item) => this.translateService.instant(item.month));
    }
    if (changes['byPeriod']) {
      this.byPeriodChart = this.buildChart(this.byPeriod, (item) => item.period);
    }
  }

  private buildChart(data: any[], labelFn: (item: any) => string) {
    if (!data?.length) {
      return null;
    }

    const values = data.map((item) => item.solved);
    const labels = data.map(labelFn);

    return {
      series: [
        {
          name: this.translateService.instant('Solved'),
          data: values,
        }
      ],
      chart: {
        type: 'bar',
        height: 300,
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
