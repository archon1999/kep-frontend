import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '@shared/services/global.service';
import { LocalStorageService } from '@shared/storages/local-storage.service';
import { SessionStorageService } from '@shared/storages/session-storage.service';

@Component({
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy {

  public authService = inject(AuthenticationService);
  public coreConfigService = inject(CoreConfigService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public globalService = inject(GlobalService);
  public localStorageService = inject(LocalStorageService);
  public sessionStorageService = inject(SessionStorageService);

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;

  private _firstQueryParamsLoad = false;

  ngOnInit(): void {
    this.globalService.queryParams$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
      (params) => {
        this._queryParams = params;
        this.afterChangeQueryParams(params);
        if (!this._firstQueryParamsLoad) {
          this._firstQueryParamsLoad = true;
          this.afterFirstChangeQueryParams(params);
        }
      }
    );

    this.globalService.currentUser$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
      (currentUser) => {
        this.beforeChangeCurrentUser(currentUser);
        this.currentUser = currentUser;
        this.isAuthenticated = (this.currentUser !== null);
        this.afterChangeCurrentUser(currentUser);
      }
    );

    this.globalService.coreConfig$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
      (coreConfig) => {
        this.coreConfig = coreConfig;
        this.isDarkMode = (coreConfig.layout.skin === 'dark');
        this.afterChangeCoreConfig(coreConfig);
      }
    );
  }

  beforeChangeCurrentUser(currentUser: User) {}
  afterChangeCurrentUser(currentUser: User) {}
  afterChangeCoreConfig(coreConfig: CoreConfig) {}
  afterChangeQueryParams(params: Params) {}
  afterFirstChangeQueryParams(params: Params) {}

  updateQueryParams(params: Params) {
    this.globalService.updateQueryParams(params);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
