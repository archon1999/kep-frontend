import { Component, Input, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { colors } from 'app/colors.const';
import { CoreCommonModule } from '@core/common.module';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'problems-activity-card',
  templateUrl: './problems-activity-card.component.html',
  styleUrls: ['./problems-activity-card.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbButtonsModule,
    ApexChartModule,
    KepIconComponent,
  ]
})
export class ProblemsActivityCardComponent implements OnInit {

  @Input() username: string;

  public activityDays = 7;
  public activitySolved = 0;
  public activityChart: any;
  public solvedText: string;

  public chartTheme: {
    mode: string,
  };

  constructor(public statisticsService: ProblemsStatisticsService) { }

  ngOnInit(): void {
    this.activityDataUpdate(this.activityDays);
  }

  activityDataUpdate(days: number) {
    this.activityDays = days;
    const username = this.username;
    this.statisticsService.getLastDays(username, days).subscribe((result: any) => {
      this.activitySolved = result.solved;
      const data = [];
      let days = 0;
      for (const y of result.series) {
        const dt = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
        data.push({
          x: dt.toDateString(),
          y: y,
        });
        days++;
      }
      this.activityChart = {
        chart: {
          height: '140px',
          type: 'line',
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          fontFamily: 'Quicksand, Raleway',
        },
        colors: [colors.solid.primary],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 5
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            gradientToColors: ['#A9A2F6'],
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function (val) {
              return val + '';
            },
          }
        },
        series: [
          {
            name: this.solvedText,
            data: data,
          }
        ],
        tooltip: {
          x: { show: false }
        },
      };

    });
  }

}
