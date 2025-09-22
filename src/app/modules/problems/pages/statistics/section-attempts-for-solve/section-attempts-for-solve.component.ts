import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '@core/config/colors';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { NumberOfAttempts } from '../../../models/statistics.models';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'section-attempts-for-solve',
  templateUrl: './section-attempts-for-solve.component.html',
  styleUrls: ['./section-attempts-for-solve.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    KepCardComponent,
  ]
})
export class SectionAttemptsForSolveComponent implements OnChanges {

  @Input() numberOfAttempts: NumberOfAttempts | null = null;

  public numberOfAttemptsForSolveChart: ChartOptions | null = null;
  public solvedText: string;
  public numberOfAttemptsText: string;

  constructor(
    private translateService: TranslateService,
  ) {
    this.translateService.get('Solved').subscribe((text) => this.solvedText = text);
    this.translateService.get('NumberOfAttempts').subscribe((text) => this.numberOfAttemptsText = text);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numberOfAttempts']) {
      this.buildChart();
    }
  }

  private buildChart() {
    if (!this.numberOfAttempts?.chartSeries?.length) {
      this.numberOfAttemptsForSolveChart = null;
      return;
    }

    const data = this.numberOfAttempts.chartSeries.map((entry) => ({
      x: `${this.numberOfAttemptsText}: ${entry.attemptsCount}`,
      y: entry.value,
    }));
    const labels = this.numberOfAttempts.chartSeries.map((entry) => entry.attemptsCount);

    this.numberOfAttemptsForSolveChart = {
      series: [{
        name: this.solvedText,
        data,
      }],
      chart: {
        type: 'area',
        height: 320,
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      labels,
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        labels: { show: false },
      },
      colors: [colors.solid.primary],
      yaxis: {
        opposite: true,
        labels: {
          formatter: (val: number) => `${Math.trunc(val)}%`,
        },
        max: 100,
      },
      grid: {
        strokeDashArray: 5,
      },
    };
  }
}
