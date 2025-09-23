import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '@core/config/colors';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { NumberOfAttemptsStatistics } from '@problems/models/statistics.models';

@Component({
  selector: 'section-attempts-for-solve',
  templateUrl: './section-attempts-for-solve.component.html',
  styleUrls: ['./section-attempts-for-solve.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
  ]
})
export class SectionAttemptsForSolveComponent implements OnChanges {

  @Input() data: NumberOfAttemptsStatistics;

  public numberOfAttemptsForSolveChart: any;
  public numberOfAttemptsForSolve: any;

  public solvedText: string;
  public numberOfAttemptsText: string;

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.translateService.get('Solved').subscribe(
      (text: string) => {
        this.solvedText = text;
      }
    );

    this.translateService.get('NumberOfAttempts').subscribe(
      (text: string) => {
        this.numberOfAttemptsText = text;
      }
    );
    if (changes['data']) {
      this.numberOfAttemptsForSolveChartLoad();
    }
  }

  numberOfAttemptsForSolveChartLoad() {
    if (!this.data) {
      this.numberOfAttemptsForSolveChart = null;
      this.numberOfAttemptsForSolve = null;
      return;
    }
    const data = [];
    const labels = [];
    for (const item of this.data.chartSeries ?? []) {
      data.push({
        x: this.numberOfAttemptsText + ': ' + item.attemptsCount,
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
        height: 300,
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
    this.numberOfAttemptsForSolve = this.data;

  }


}
