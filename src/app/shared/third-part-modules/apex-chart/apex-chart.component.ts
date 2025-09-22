import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from './chart-options.type';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApexTheme, ChartComponent } from 'ng-apexcharts';
import { TranslateService } from '@ngx-translate/core';

import ru from 'apexcharts/dist/locales/ru.json';
import en from 'apexcharts/dist/locales/en.json';
import uz from './locale-uz.json';
import { AppStateService } from "@core/services/app-state.service";

@Component({
  selector: 'apex-chart',
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss'],
  standalone: false,
})
export class ApexChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;

  public chartTheme: ApexTheme;
  private _unsubscribeAll = new Subject();

  constructor(
    protected readonly translateService: TranslateService,
    protected readonly appStateService: AppStateService,
    protected readonly cdr: ChangeDetectorRef,
  ) {}

  private _options: ChartOptions;

  get options() {
    return this._options;
  }

  @Input() set options(options: ChartOptions) {
    this._options = options;
    this.options.chart.fontFamily = this.options.chart.fontFamily || 'var(--default-font-family)';
    this.options.colors = this.options.colors || ['var(--primary-rgb)'];
    this.options.chart.toolbar = this.options.chart.toolbar || {show: false};
    this.options.chart.zoom = this.options.chart.zoom || {enabled: false};
    this.options.stroke = this.options.stroke || {width: 2};
    this.options.chart.locales = [ru, en, uz];
    this.options.chart.defaultLocale = 'en';
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.appStateService.state$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (state) => {
        this.chartTheme = {
          mode: state.themeMode,
        };
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
