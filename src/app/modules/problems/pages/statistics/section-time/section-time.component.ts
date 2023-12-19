import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';

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
export class SectionTimeComponent implements OnInit {

  @Input() username: string;
  @Input() chartTheme: any;

  public byWeekdayChart: any;
  public byMonthChart: any;
  public byPeriodChart: any;

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.statisticsService.getByWeekday(this.username).subscribe(
      (result: any) => {
        const values = [];
        const labels = [];
        for (const data of result) {
          labels.push(this.translateService.instant(data.day));
          values.push(data.solved);
        }
        this.byWeekdayChart = {
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
    );

    this.statisticsService.getByMonth(this.username).subscribe(
      (result: any) => {
        const values = [];
        const labels = [];
        for (const data of result) {
          labels.push(this.translateService.instant(data.month));
          values.push(data.solved);
        }
        this.byMonthChart = {
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
    );

    this.statisticsService.getByPeriod(this.username).subscribe(
      (result: any) => {
        const values = [];
        const labels = [];
        for (const data of result) {
          labels.push(data.period);
          values.push(data.solved);
        }
        this.byPeriodChart = {
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
    );
  }

}
