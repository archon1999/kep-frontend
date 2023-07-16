import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Problem } from '../../../problems.models';
import { ProblemsService } from '../../../problems.service';
import { colors as Colors } from 'app/colors.const';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'problem-sidebar',
  templateUrl: './problem-sidebar.component.html',
  styleUrls: ['./problem-sidebar.component.scss']
})
export class ProblemSidebarComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public attemptStatisticsChart: any;
  public langStatisticsChart: any;
  public attemptsForSolveChart: any;

  public topAttemptsOrdering = 'source_code_size';
  public topAttempts: Array<any> = [];

  public chartTheme: {
    mode: string,
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ProblemsService,
    public translate: TranslateService,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        if(config.layout.skin == 'dark'){
          this.chartTheme = {
            mode: 'dark',
          }
        } else {
          this.chartTheme = {
            mode: 'light',
          }
        }
      }
    )

    this.topAttemptsLoad(this.topAttemptsOrdering);

    this.service.getProblemVerdictStatistics(this.problem.id).subscribe((result: any) => {
      let series = [];
      let labels = [];
      let colors = [];
      for(let data of result){
        series.push(data.value);
        colors.push(Colors.solid[data.color]);
        labels.push(data.verdictTitle);
      }
      let attemptsText: string;
      this.translate.get('Attempts').subscribe((text: string) => attemptsText = text)
      this.attemptStatisticsChart = {
        series: series,
        labels: labels,
        colors: colors,
        chart: {
          type: 'donut',
          fontFamily: 'QuickSand, Roboto',
        },
        legend: {
          show: false,
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
                    return val+"";
                  }
                },
                total: {
                  label: attemptsText,
                  show: true,
                },
              }
            }
          }
        }
      };
    })

    this.service.getProblemLangStatistics(this.problem.id).subscribe((result: any) => {
      let series = [];
      let labels = [];
      let colors = [];
      for(let data of result){
        series.push(data.value);
        colors.push(Colors.lang[data.lang]);
        labels.push(data.langFull);
      }
      let languagesText = '';
      this.translate.get('Languages').subscribe((text: string) => languagesText = text)
      this.langStatisticsChart = {
        series: series,
        labels: labels,
        colors: colors,
        chart: {
          type: 'pie',
          fontFamily: 'QuickSand, Roboto',
        },
        legend: {
          show: true,
          position: 'top',
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
                    return val+"";
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
    })

    let numberOfAttemptsText: string;
    this.translate.get('NumberOfAttempts').subscribe(
      (text: string) => {
        numberOfAttemptsText = text;
      }
    )

    let percentageText: string;
    this.translate.get('Percent').subscribe(
      (text: string) => {
        percentageText = text;
      }
    )

    this.service.getAttemptsForSolveStatistics(this.problem.id).subscribe((result: any) => {
      let labels = [];
      let data = [];
      for(let A of result){
        labels.push(A.attempts);
        data.push({
          'x': numberOfAttemptsText + ": " + A.attempts,
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
          type: "area",
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
          curve: "straight"
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
            formatter: function(val) {
              return Math.trunc(val) + "%";
            },
          },
          min: 50,
          max: 100,
        },
        legend: {
          horizontalAlign: "left"
        }
      }
    })
  }

  topAttemptsLoad(ordering: string){
    this.topAttemptsOrdering = ordering;
    this.service.getProblemTopAttempts(this.problem.id, ordering).subscribe((result: any) => {
      this.topAttempts = result;
    })
  }

  ngOnDestroy(): void {    
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
