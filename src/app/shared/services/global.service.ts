import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/service';
import { User } from '../../auth/models';
import { CoreConfig } from '../../../core/types';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;

  private _queryParamsSubject = new ReplaySubject<Params>(1);
  private _currentUserSubject = new ReplaySubject<User | null>(1);
  private _coreConfigSubject = new ReplaySubject<CoreConfig>(1);

  get queryParams$() {
    return this._queryParamsSubject.asObservable();
  }

  get currentUser$() {
    return this._currentUserSubject.asObservable();
  }

  get coreConfig$() {
    return this._coreConfigSubject.asObservable();
  }

  constructor(
    public authService: AuthenticationService,
    public coreConfigService: CoreConfigService,
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
      (user: User | null) => {
        this._currentUserSubject.next(user);
      }
    );

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (coreConfig: CoreConfig) => {
        this._coreConfigSubject.next(coreConfig);
      }
    );
  }

  updateQueryParams(params: Params) {
    const currentScrollHeight = window.pageYOffset;
    this._queryParams = { ...this._queryParams, ...params };
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: this._queryParams,
      }
    ).then(() => window.scrollTo({ top: currentScrollHeight }));
  }

}
