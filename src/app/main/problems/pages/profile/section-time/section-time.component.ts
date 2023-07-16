import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from 'app/colors.const';
import { ProblemsStatisticsService } from '../../../problems-statistics.service';

@Component({
  selector: 'section-time',
  templateUrl: './section-time.component.html',
  styleUrls: ['./section-time.component.scss']
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
    let translations = this.translateService.translations[this.translateService.currentLang];

    this.statisticsService.getByWeekday(this.username).subscribe(
      (result: any) =>{
        let values = [];
        let labels = [];
        for(let data of result){
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
            type: "bar",
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
    )

    this.statisticsService.getByMonth(this.username).subscribe(
      (result: any) =>{
        let values = [];
        let labels = [];
        for(let data of result){
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
            type: "bar",
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
    )

    this.statisticsService.getByPeriod(this.username).subscribe(
      (result: any) =>{
        let values = [];
        let labels = [];
        for(let data of result){
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
            type: "bar",
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
    )
  }

}
