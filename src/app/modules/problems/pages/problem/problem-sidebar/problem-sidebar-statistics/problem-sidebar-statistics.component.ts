import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Problem } from 'app/modules/problems/models/problems.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { colors as Colors } from '@app/colors';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'problem-sidebar-statistics',
  templateUrl: './problem-sidebar-statistics.component.html',
  styleUrls: ['./problem-sidebar-statistics.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ApexChartModule,
  ]
})
export class ProblemSidebarStatisticsComponent implements OnInit {
  @Input() problem: Problem;

  public attemptStatisticsChart: ChartOptions;
  public langStatisticsChart: ChartOptions;
  public attemptsForSolveChart: ChartOptions;

  constructor(
    public service: ProblemsApiService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.service.getProblemVerdictStatistics(this.problem.id).subscribe((result: any) => {
      const series = [];
      const labels = [];
      const colors = [];
      for (const data of result) {
        series.push(data.value);
        colors.push(Colors.solid[data.color]);
        labels.push(data.verdictTitle);
      }
      this.attemptStatisticsChart = {
        series: series,
        colors: colors,
        labels: labels,
        chart: {
          type: 'donut',
          height: 500,
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center'
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '20px',
                },
                value: {
                  show: true,
                  fontSize: '26px',
                },
                total: {
                  label: this.translate.instant('Attempts'),
                  show: true,
                },
              }
            }
          }
        }
      };
    });

    this.service.getProblemLangStatistics(this.problem.id).subscribe((result: any) => {
      const series = [];
      const labels = [];
      const colors = [];
      for (const data of result) {
        series.push(data.value);
        colors.push(Colors.lang[data.lang]);
        labels.push(data.langFull);
      }
      let languagesText = '';
      this.translate.get('Languages').subscribe((text: string) => languagesText = text);
      this.langStatisticsChart = {
        series: series,
        labels: labels,
        colors: colors,
        chart: {
          type: 'pie',
          height: 500,
        },
        legend: {
          show: true,
          position: 'bottom',
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '20px',
                },
                value: {
                  show: true,
                  fontSize: '26px',
                  formatter: function (val) {
                    return val + '';
                  }
                },
                total: {
                  label: languagesText,
                  color: '#ffffff',
                  show: true,
                },
              }
            }
          }
        }
      };
    });

    let numberOfAttemptsText: string;
    this.translate.get('NumberOfAttempts').subscribe(
      (text: string) => {
        numberOfAttemptsText = text;
      }
    );

    let percentageText: string;
    this.translate.get('Percent').subscribe(
      (text: string) => {
        percentageText = text;
      }
    );

    this.service.getAttemptsForSolveStatistics(this.problem.id).subscribe((result: any) => {
      const labels = [];
      const data = [];
      for (const A of result) {
        labels.push(A.attempts);
        data.push({
          'x': numberOfAttemptsText + ': ' + A.attempts,
          'y': A.value,
        });
      }
      this.attemptsForSolveChart = {
        series: [{
          name: percentageText,
          data: data,
        }],
        colors: [Colors.solid.primary],
        chart: {
          type: 'area',
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
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function (val) {
              return Math.trunc(val) + '%';
            },
          },
          min: 50,
          max: 100,
        },
        legend: {
          horizontalAlign: 'left'
        }
      };
    });
  }
}
