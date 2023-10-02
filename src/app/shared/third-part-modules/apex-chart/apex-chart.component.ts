import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.type';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '../../../../@core/types';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { Subject } from 'rxjs';
import { colors } from '../../../colors.const';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apex-chart',
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss']
})
export class ApexChartComponent implements OnInit, OnDestroy {

  @Input() options: ChartOptions;

  public chartTheme: {
    mode: string,
  };

  private _unsubscribeAll = new Subject();


  constructor(public coreConfigService: CoreConfigService) {
  }

  ngOnInit(): void {
    this.options.chart.fontFamily = this.options.chart.fontFamily || 'Quicksand, Roboto';
    this.options.colors = this.options.colors || [colors.solid.primary];
    this.options.chart.toolbar = this.options.chart.toolbar || { show: false };
    this.options.chart.zoom = this.options.chart.zoom || { enabled: false };

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: CoreConfig) => {
        this.chartTheme = {
          mode: config.layout.skin === 'dark' ? 'dark' : 'light',
        };
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}