import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexGrid,
  ApexTooltip,
  ApexLegend,
  ApexStroke,
  ApexResponsive,
} from 'ng-apexcharts';
import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { ActivatedRoute } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions?: ApexPlotOptions;
  labels?: Array<string>;
  dataLabels?: ApexDataLabels;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
  colors?: Array<string>;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  stroke?: ApexStroke;
  responsive?: Array<ApexResponsive>;
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [],
})
export class ProfileComponent implements OnInit, OnDestroy {

  public coreConfig: CoreConfig;

  public currentUser = this.authService.currentUserValue;
  public username: string;

  public chartTheme: {
    mode: string,
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public coreConfigService: CoreConfigService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if(params['username']) {
          this.username = params['username'];
        } else {
          this.username = this.currentUser.username;
        }
      }
    )

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
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
