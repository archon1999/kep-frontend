import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '@shared/services/global.service';

@Component({
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy {

  public authService = inject(AuthenticationService);
  public coreConfigService = inject(CoreConfigService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public globalService = inject(GlobalService);

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;

  private _firstQueryParamsLoad = false;

  ngOnInit(): void {
    this.globalService.afterChangeQueryParams.asObservable().subscribe(
      (params) => {
        this.afterChangeQueryParams(params);
        if (!this._firstQueryParamsLoad) {
          this._firstQueryParamsLoad = true;
          this.afterFirstChangeQueryParams(params);
        }
      }
    );

    this.globalService.afterChangeCurrentUser.asObservable().subscribe(
      (currentUser) => {
        this.afterChangeCurrentUser(currentUser);
      }
    );

    this.globalService.afterChangeCoreConfig.asObservable().subscribe(
      (coreConfig) => {
        this.afterChangeCoreConfig(coreConfig);
      }
    );
  }

  afterChangeCurrentUser(currentUser: User) {}
  afterChangeCoreConfig(coreConfig: CoreConfig) {}
  afterChangeQueryParams(params: Params) {}
  afterFirstChangeQueryParams(params: Params) {}

  updateQueryParams(params: any) {
    const currentScrollHeight = window.pageYOffset;
    this._queryParams = { ...this._queryParams, ...params };
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: this._queryParams,
      }
    ).then(() => window.scrollTo({ top: currentScrollHeight }));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
