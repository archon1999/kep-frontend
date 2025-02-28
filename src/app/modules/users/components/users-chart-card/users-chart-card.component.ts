import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '@users/users-api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'users-chart-card',
  templateUrl: './users-chart-card.component.html',
  styleUrls: ['./users-chart-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    UserPopoverModule,
    ApexChartModule,
    KepIconComponent,
    KepCardComponent
  ]
})
export class UsersChartCardComponent implements OnInit {

  public onlineUsers: Array<{ username: string, avatar: string }> = [];
  public usersTotal = 0;
  public usersChart: ChartOptions;

  constructor(
    public usersService: UsersApiService,
    public translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initChart();

    this.usersService.getOnlineUsers().subscribe(
      (result: any) => {
        this.onlineUsers = result;
      }
    );

    this.usersService.getUsersChartSeries().subscribe(
      (result: any) => {
        this.usersChart.series[0].data = result.series;
        this.usersChart.series[0].name = this.translateService.instant('NewUsers');
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
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5
      },
      tooltip: {
        x: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false,
          formatter(val: number): string {
            return val.toFixed(0);
          }
        }
      },
      series: [
        {
          name: '',
          data: []
        }
      ],
    };
  }
}
