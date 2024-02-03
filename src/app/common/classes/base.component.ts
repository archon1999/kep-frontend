import { Component, inject } from '@angular/core';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { GlobalService } from '@app/common/global.service';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';
import { SessionStorageService } from '@shared/services/storages/session-storage.service';
import { TitleService } from '@shared/services/title.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ApiService } from '@shared/services/api.service';
import { Resources } from '@app/resources';
import { TranslateService } from '@ngx-translate/core';
import { WebsocketService } from '@shared/services/websocket';
import { coreConfig } from '@app/app.config';

@Component({
  template: '',
  standalone: true
})
export class BaseComponent {

  public api = inject(ApiService);
  public authService = inject(AuthService);
  public coreConfigService = inject(CoreConfigService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public globalService = inject(GlobalService);
  public localStorageService = inject(LocalStorageService);
  public sessionStorageService = inject(SessionStorageService);
  public titleService = inject(TitleService);
  public spinner = inject(NgxSpinnerService);
  public toastr = inject(ToastrService);
  public coreSidebarService = inject(CoreSidebarService);
  public translateService = inject(TranslateService);
  public wsService = inject(WebsocketService);

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  public defaultCoreConfig = coreConfig;
  public readonly Resources = Resources;

  protected _unsubscribeAll = new Subject();
  protected _queryParams: any;

  private _firstQueryParamsLoad = false;

  constructor() {
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
          setTimeout(() => {
            this.beforeChangeCurrentUser(currentUser);
            this.currentUser = currentUser;
            this.isAuthenticated = (this.currentUser !== null);
            this.afterChangeCurrentUser(currentUser);
          });
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

  updateQueryParams(params: Params, extras?: NavigationExtras) {
    this.globalService.updateQueryParams(params, extras);
  }

  getLastUrl = () => this.globalService.getLastUrl();

  get langs() {
    return this.translateService.langs;
  }

  get languageOptions() {
    return this.defaultCoreConfig.app.appLanguages;
  }

  setLanguage(language: string): void {
    this.api.post('set-language/', { language: language }).subscribe(() => {
      // this.translateService.use(language);
      this.coreConfigService.setConfig({ app: { appLanguage: language } }, { emitEvent: false });
      location.reload();
      // this.refreshPage();
    });
  }

  refreshPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([this.router.url], { skipLocationChange: true });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
