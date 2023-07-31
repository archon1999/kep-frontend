import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from 'app/colors.const';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public mostActiveUsers: Array<string> = [];
  public onlineUsers: Array<any> = [];

  public usersTotal = 0;
  public usersChart: any;
  public newUsersText: string;
 
  public contentHeader = {
    headerTitle: 'MENU.USERS',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CPython.uz',
          isLink: false,
          link: '/'
        },
      ]
    }
  };

  constructor(
    public service: UsersService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.service.getMostActiveUsers().subscribe(
      (usernames: any) => {
        this.mostActiveUsers = usernames;
      }
    )

    this.translateService.get('NewUsers').subscribe(
      (text: string) => {
        this.newUsersText = text;
      }
    )

    this.service.getOnlineUsers().subscribe(
      (users: any) => {
        this.onlineUsers = users;
      }
    )

    this.loadUsersChart();
  }

  loadUsersChart(){
    this.service.getUsersChartSeries()
    .subscribe((result: any) => {
      console.log(result);
      this.usersTotal = result.total;
      this.usersChart = {
        series: [
          {
            name: this.newUsersText,
            data: result.series,
          }
        ],
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
              return val + "";
            },
          }
        },
        tooltip: {
          x: { show: false }
        }
      };
    })
    
  }

}
