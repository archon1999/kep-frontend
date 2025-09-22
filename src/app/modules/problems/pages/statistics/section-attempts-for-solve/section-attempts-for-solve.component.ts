import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { colors } from '@core/config/colors';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'section-attempts-for-solve',
  templateUrl: './section-attempts-for-solve.component.html',
  styleUrls: ['./section-attempts-for-solve.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
    TranslateModule,
  ]
})
export class SectionAttemptsForSolveComponent implements OnChanges {

  @Input() numberOfAttempts: any;

  public numberOfAttemptsForSolveChart: any;
  public solvedText = this.translateService.instant('Solved');
  public numberOfAttemptsText = this.translateService.instant('NumberOfAttempts');

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numberOfAttempts'] && this.numberOfAttempts) {
      this.buildChart();
    }
  }

  private buildChart() {
    if (!this.numberOfAttempts?.chartSeries?.length) {
      this.numberOfAttemptsForSolveChart = null;
      return;
    }

    const data = [];
    const labels = [];

    for (const item of this.numberOfAttempts?.chartSeries ?? []) {
      data.push({
        x: `${this.numberOfAttemptsText}: ${item.attemptsCount}`,
        y: item.value,
      });
      labels.push(item.attemptsCount);
    }

    this.numberOfAttemptsForSolveChart = {
      series: [{
        name: this.solvedText,
        data: data,
      }],
      chart: {
        type: 'area',
        height: 280,
        zoom: {
          enabled: false
        },
        toolbar: {show: false}
      },
      labels: labels,
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        labels: {
          show: false,
        }
      },
      colors: [colors.solid.primary],
      yaxis: {
        opposite: true,
        labels: {
          formatter: function (val) {
            return Math.trunc(val) + '%';
          },
        },
        max: 100,
      },
      legend: {
        horizontalAlign: 'left'
      }
    };
  }
}
