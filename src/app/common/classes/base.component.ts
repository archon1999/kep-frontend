import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: '',
  standalone: true
})
export class BaseComponent {

  public currentUser: User | null;
  public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  public defaultCoreConfig = coreConfig;
  public readonly Resources = Resources;

  protected api = inject(ApiService);
  protected authService = inject(AuthService);
  protected coreConfigService = inject(CoreConfigService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected globalService = inject(GlobalService);
  protected localStorageService = inject(LocalStorageService);
  protected sessionStorageService = inject(SessionStorageService);
  protected titleService = inject(TitleService);
  protected spinner = inject(NgxSpinnerService);
  protected toastr = inject(ToastrService);
  protected coreSidebarService = inject(CoreSidebarService);
  protected translateService = inject(TranslateService);
  protected wsService = inject(WebsocketService);
  protected cdr = inject(ChangeDetectorRef);
  protected modalService = inject(NgbModal);

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
            this.cdr.markForCheck();
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
          this.cdr.markForCheck();
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

  redirect404() {
    this.router.navigateByUrl('/404', { skipLocationChange: false });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
