import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Problem } from 'app/modules/problems/models/problems.models';
import { colors as Colors } from '@core/config/colors';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { ProblemStatistics } from '../problem-statistics.model';

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
export class ProblemSidebarStatisticsComponent implements OnChanges {
  @Input() problem: Problem;
  @Input() statistics: ProblemStatistics | null = null;

  public attemptStatisticsChart: ChartOptions | null = null;
  public langStatisticsChart: ChartOptions | null = null;
  public attemptsForSolveChart: ChartOptions | null = null;

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statistics']) {
      this.buildCharts();
    }
  }

  private buildCharts(): void {
    if (!this.statistics) {
      this.attemptStatisticsChart = null;
      this.langStatisticsChart = null;
      this.attemptsForSolveChart = null;
      return;
    }

    this.buildAttemptStatisticsChart();
    this.buildLanguageStatisticsChart();
    this.buildAttemptsForSolveChart();
  }

  private buildAttemptStatisticsChart(): void {
    const attemptStatistics = this.statistics?.attemptStatistics ?? [];

    if (!attemptStatistics.length) {
      this.attemptStatisticsChart = null;
      return;
    }

    const series = [];
    const labels = [];
    const colors = [];

    for (const data of attemptStatistics) {
      series.push(data.value);
      const color = Colors.solid[data.color] ?? Colors.solid.primary;
      colors.push(color);
      labels.push(data.verdictTitle);
    }

    this.attemptStatisticsChart = {
      series,
      colors,
      labels,
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
  }

  private buildLanguageStatisticsChart(): void {
    const languageStatistics = this.statistics?.languageStatistics ?? [];

    if (!languageStatistics.length) {
      this.langStatisticsChart = null;
      return;
    }

    const series = [];
    const labels = [];
    const colors = [];

    for (const data of languageStatistics) {
      series.push(data.value);
      labels.push(data.langFull);
      const color = Colors.lang[data.lang] ?? Colors.solid.primary;
      colors.push(color);
    }

    const languagesText = this.translate.instant('Languages');

    this.langStatisticsChart = {
      series,
      labels,
      colors,
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
                  return `${val}`;
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
  }

  private buildAttemptsForSolveChart(): void {
    const attemptsForSolveStatistics = this.statistics?.attemptsForSolveStatistics ?? [];

    if (!attemptsForSolveStatistics.length) {
      this.attemptsForSolveChart = null;
      return;
    }

    const labels = [];
    const data = [];

    const numberOfAttemptsText = this.translate.instant('NumberOfAttempts');
    const percentageText = this.translate.instant('Percent');

    for (const entry of attemptsForSolveStatistics) {
      labels.push(entry.attempts);
      data.push({
        x: `${numberOfAttemptsText}: ${entry.attempts}`,
        y: entry.value,
      });
    }

    this.attemptsForSolveChart = {
      series: [{
        name: percentageText,
        data,
      }],
      colors: [Colors.solid.primary],
      chart: {
        type: 'area',
      },
      labels,
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
            return `${Math.trunc(val)}%`;
          },
        },
        min: 0,
        max: 100,
      },
      legend: {
        horizontalAlign: 'left'
      }
    };
  }
}
