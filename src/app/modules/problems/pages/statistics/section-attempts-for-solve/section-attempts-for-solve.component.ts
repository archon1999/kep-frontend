import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '@app/colors';
import { ProblemsStatisticsService } from '../../../services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';

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
export class SectionAttemptsForSolveComponent implements OnInit {

  @Input() username: string;
  @Input() chartTheme: any;

  public numberOfAttemptsForSolveChart: any;
  public numberOfAttemptsForSolve: any;

  public solvedText: string;
  public numberOfAttemptsText: string;

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
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
    this.numberOfAttemptsForSolveChartLoad();
  }

  numberOfAttemptsForSolveChartLoad() {
    const username = this.username;
    const data = [];
    const labels = [];
    this.statisticsService.getNumberOfAttemptsForSolve(username).subscribe((result: any) => {
      for (const A of result.chartSeries) {
        data.push({
          x: this.numberOfAttemptsText + ': ' + A.attemptsCount,
          y: A.value,
        });
        labels.push(A.attemptsCount);
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
          toolbar: { show: false }
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
      this.numberOfAttemptsForSolve = result;
    });

  }


}
