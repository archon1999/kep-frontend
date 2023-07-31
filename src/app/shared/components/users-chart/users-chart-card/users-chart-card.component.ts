import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../modules/users/users.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'users-chart-card',
  templateUrl: './users-chart-card.component.html',
  styleUrls: ['./users-chart-card.component.scss']
})
export class UsersChartCardComponent implements OnInit, OnDestroy {

  public onlineUsers: Array<{ username: string, avatar: string }> = [];
  public usersTotal = 0;
  public newUsersText: string;
  public chartTheme: { mode: string };
  public usersChart: any;

  private _unsubscribeAll = new Subject();

  constructor(
    public usersService: UsersService,
    public translateService: TranslateService,
    public coreConfigService: CoreConfigService,
  ) {
  }

  ngOnInit(): void {
    this.initChart();

    this.translateService.get('NewUsers').subscribe(
      (text: string) => {
        this.newUsersText = text;
      }
    );

    this.usersService.getOnlineUsers().subscribe(
      (result: any) => {
        this.onlineUsers = result;
      }
    );

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: any) => {
        if (config.layout.skin == 'dark') {
          this.chartTheme = {
            mode: 'dark',
          };
        } else {
          this.chartTheme = {
            mode: 'light',
          };
        }
      });

    this.usersService.getUsersChartSeries().subscribe(
      (result: any) => {
        this.usersChart.series[0].data = result.series;
        this.usersChart.series[0].name = this.newUsersText;
        this.usersTotal = result.total;
      }
    );
  }

  initChart() {
    this.usersChart = {
      chart: {
        height: 100,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 5,
          left: 0,
          blur: 4,
          opacity: 0.1
        },
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: ['#7367F0'],
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
          name: '',
          data: []
        }
      ],
      tooltip: {
        x: {show: false}
      }
    };
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
