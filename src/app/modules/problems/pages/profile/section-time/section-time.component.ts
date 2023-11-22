import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from 'app/colors.const';
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
    const translations = this.translateService.translations[this.translateService.currentLang];

    this.statisticsService.getByWeekday(this.username).subscribe(
      (result: any) => {
        const values = [];
        const labels = [];
        for (const data of result) {
          labels.push(translations[data.day]);
          values.push(data.solved);
        }
        this.byWeekdayChart = {
          series: [
            {
              name: translations['Solved'],
              data: values,
            }
          ],
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false,
            },
            fontFamily: 'QuickSand, Roboto',
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          colors: [colors.solid.primary],
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
          labels.push(translations[data.month]);
          values.push(data.solved);
        }
        this.byMonthChart = {
          series: [
            {
              name: translations['Solved'],
              data: values,
            }
          ],
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false,
            },
            fontFamily: 'QuickSand, Roboto',
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          colors: [colors.solid.primary],
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
              name: translations['Solved'],
              data: values,
            }
          ],
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false,
            },
            fontFamily: 'QuickSand, Roboto',
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          colors: [colors.solid.primary],
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
