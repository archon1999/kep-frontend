import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from './chart-options.type';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { colors } from '@app/colors.const';
import { ApexTheme, ChartComponent } from 'ng-apexcharts';
import { TranslateService } from '@ngx-translate/core';

import ru from 'apexcharts/dist/locales/ru.json';
import en from 'apexcharts/dist/locales/en.json';
import uz from './locale-uz.json';

@Component({
  selector: 'apex-chart',
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss']
})
export class ApexChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;

  public chartTheme: ApexTheme;
  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public translateService: TranslateService,
  ) {}

  private _options: ChartOptions;

  get options() {
    return this._options;
  }

  @Input() set options(options: ChartOptions) {
    this._options = options;
    this.options.chart.fontFamily = this.options.chart.fontFamily || 'Montserrat';
    this.options.colors = this.options.colors || [colors.solid.primary];
    this.options.chart.toolbar = this.options.chart.toolbar || { show: false };
    this.options.chart.zoom = this.options.chart.zoom || { enabled: false };
    this.options.stroke = this.options.stroke || { width: 2 };
    this.options.chart.locales = [ru, en, uz];
    this.options.chart.defaultLocale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config) => {
        this.chartTheme = {
          mode: config.layout.skin === 'dark' ? 'dark' : 'light',
        };
      }
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
