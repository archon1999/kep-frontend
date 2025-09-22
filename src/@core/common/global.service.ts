import { Injectable } from '@angular/core';
import { AuthService, AuthUser } from '@auth';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;
  protected _lastUrl: string;
  protected _currentUrl: string;

  private _queryParamsSubject = new ReplaySubject<Params>(1);
  private _currentUserSubject = new ReplaySubject<AuthUser | null>(1);
  private _coreConfigSubject = new ReplaySubject<any>(1);

  constructor(
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this._queryParams = params;
        this._queryParamsSubject.next(params);
      }
    );

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: AuthUser | null) => {
        this._currentUserSubject.next(user);
      }
    );
    //
    // this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
    //   (coreConfig: any) => {
    //     this._coreConfigSubject.next(coreConfig);
    //   }
    // );

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this._lastUrl = this._currentUrl;
          this._currentUrl = event.url;
        }
      }
    );
  }

  get queryParams$() {
    return this._queryParamsSubject.asObservable();
  }

  get currentUser$() {
    return this._currentUserSubject.asObservable();
  }

  get coreConfig$() {
    return this._coreConfigSubject.asObservable();
  }

  getLastUrl() {
    return this._lastUrl;
  }

  updateQueryParams(params: Params, extras?: NavigationExtras) {
    const currentScrollHeight = window.pageYOffset;
    this._queryParams = {...this._queryParams, ...params};
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: this._queryParams,
        ...extras,
      }
    ).then(() => {
      if (currentScrollHeight) {
        setTimeout(() => window.scrollTo({top: currentScrollHeight}));
      }
    });
  }

}
