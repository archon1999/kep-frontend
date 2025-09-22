import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { CoreCommonModule } from '@core/common.module';
import { coreConfig } from '@app/app.config';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '@app/common/global.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    TranslateModule,
  ]
})
export class ErrorComponent implements OnInit {
  public coreConfig: any;
  public defaultCoreConfig = coreConfig;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _router: Router,
    private _globalService: GlobalService,
  ) {
    this._unsubscribeAll = new Subject();

    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  goBack() {
    const previousUrl = this._globalService.getPreviousUrl();

    if (previousUrl && previousUrl !== '/404') {
      this._router.navigateByUrl(previousUrl);
      return;
    }

    this._router.navigateByUrl('/');
  }
}
