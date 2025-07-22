import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService, AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { GlobalService } from '@core/common/global.service';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';
import { SessionStorageService } from '@shared/services/storages/session-storage.service';
import { TitleService } from '@shared/services/title.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@core/data-access/api.service';
import { Resources } from '@app/resources';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from '@core/services/app-state.service';

@Component({
  template: '',
  standalone: true
})
export class BaseComponent implements OnInit {

  public currentUser: AuthUser | null;
  // public coreConfig: CoreConfig;

  public isDarkMode: boolean;
  public isAuthenticated: boolean;

  // public defaultCoreConfig = coreConfig;
  public readonly Resources = Resources;

  protected api = inject(ApiService);
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected globalService = inject(GlobalService);
  protected localStorageService = inject(LocalStorageService);
  protected sessionStorageService = inject(SessionStorageService);
  protected titleService = inject(TitleService);
  protected spinner = inject(NgxSpinnerService);
  protected toastr = inject(ToastrService);
  protected appStateService = inject(AppStateService);
  protected translateService = inject(TranslateService);
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
          // this.coreConfig = coreConfig;
          this.isDarkMode = (coreConfig.layout.skin === 'dark');
          // this.afterChangeCoreConfig(coreConfig);
          this.cdr.markForCheck();
        }
      );
  }

  ngOnInit() {}

  beforeChangeCurrentUser(currentUser: AuthUser) {}

  afterChangeCurrentUser(currentUser: AuthUser) {}

  // afterChangeCoreConfig(coreConfig: CoreConfig) {}

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
    return []
    // return this.defaultCoreConfig.app.appLanguages;
  }

  setLanguage(language: string): void {
    this.api.post('set-language/', {language: language}).subscribe(() => {
      // this.translateService.use(language);
      // this.coreConfigService.setConfig({ app: { appLanguage: language } }, { emitEvent: false });
      location.reload();
      // this.refreshPage();
    });
  }

  refreshPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([this.router.url], {skipLocationChange: true});
  }

  redirect404() {
    this.router.navigateByUrl('/404', {skipLocationChange: false});
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
