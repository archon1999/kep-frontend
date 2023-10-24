import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/service';
import { User } from '../../auth/models';
import { CoreConfig } from '../../../@core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '../../../@core/services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public afterChangeQueryParams = new Subject<Params>();
  public afterChangeCurrentUser = new Subject<User | null>();
  public afterChangeCoreConfig = new Subject<CoreConfig>();

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;


  constructor(
    public authService: AuthenticationService,
    public coreConfigService: CoreConfigService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this._queryParams = params;
        this.afterChangeQueryParams.next(params);
      }
    );

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        this.afterChangeCurrentUser.next(user);
        this.isAuthenticated = (this.currentUser !== null);
      }
    );

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (coreConfig: CoreConfig) => {
        this.coreConfig = coreConfig;
        this.isDarkMode = (this.coreConfig.layout.skin === 'dark');
        this.afterChangeCoreConfig.next(coreConfig);
      }
    );
  }


}
