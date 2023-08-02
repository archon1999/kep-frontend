import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { colors } from 'app/colors.const';
import { takeUntil } from 'rxjs/operators';
import { ProblemsStatisticsService } from '../../../services/problems-statistics.service';

@Component({
  selector: 'section-heatmap',
  templateUrl: './section-heatmap.component.html',
  styleUrls: ['./section-heatmap.component.scss']
})
export class SectionHeatmapComponent implements OnInit {

  @Input() username: string;
  @Input() chartTheme: string;

  public heatmap: Array<any>;
  public heatmapYear = 0;
  public heatmapChart: any;

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public coreConfigService: CoreConfigService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.heatmapUpdate(0);
  }

  heatmapUpdate(year: number){
    this.heatmapYear = year;
    let username = this.username;
    let translations = this.translateService.translations[this.translateService.currentLang];
    this.statisticsService.getHeatmap(username, this.heatmapYear).subscribe((result: any) => {
      let series = [{
        name: translations['Monday'],
        data: [],
      },{
        name: translations['Tuesday'],
        data: [],
      },{
        name: translations['Wednesday'],
        data: [],
      },{
        name: translations['Thursday'],
        data: [],
      },{
        name: translations['Friday'],
        data: [],
      },{
        name: translations['Saturday'],
        data: [],
      },{
        name: translations['Sunday'],
        data: [],
      }];
      for(let data of result){
        let date = new Date(data.date);
        let weekday = date.getDay();
        series[weekday].data.push({
          x: date,
          y: data.solved,
        });
      }
      this.heatmapChart = {
        series: series,
        chart: {
          height: 350,
          type: 'heatmap',
          toolbar: { show: false },
          fontFamily: 'QuickSand, Roboto',
        },
        dataLabels: {
          enabled: false
        },
        colors: [colors.solid.primary],
        xaxis: {
          type: 'datetime',
          labels: {
              format: 'MMM',
          }
        },
        yaxis: {
          show: false,
        }
      }
      this.heatmap = result;
    })
  }

}
