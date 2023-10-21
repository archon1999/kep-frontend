import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy {

  public authService = inject(AuthenticationService);
  public coreConfigService = inject(CoreConfigService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;

  private _firstQueryParamsLoad = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        this._queryParams = params;
        this.afterChangeQueryParams();
        if (!this._firstQueryParamsLoad) {
          this._firstQueryParamsLoad = true;
          this.afterFirstChangeQueryParams();
        }
      }
    );

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        this.afterChangeCurrentUser();
        this.isAuthenticated = (this.currentUser !== null);
      }
    );

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (coreConfig: CoreConfig) => {
        this.coreConfig = coreConfig;
        this.isDarkMode = (this.coreConfig.layout.skin === 'dark');
        this.afterChangeCoreConfig();
      }
    );
  }

  afterChangeCurrentUser() {}
  afterChangeCoreConfig() {}
  afterChangeQueryParams() {}
  afterFirstChangeQueryParams() {}

  updateQueryParams(params: any) {
    const currentScrollHeight = window.pageYOffset;
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { ...this._queryParams, ...params },
      }
    ).then(() => window.scrollTo({ top: currentScrollHeight }));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
