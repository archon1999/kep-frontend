import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfig } from '@core/types';
import { deepMerge } from '@shared/utils/deep-merge';
import { deepCopy } from '@shared/utils';
import { deepEquals } from '@shared/utils/deep-equals';

export const CORE_CUSTOM_CONFIG = new InjectionToken('coreCustomConfig');

@Injectable({
  providedIn: 'root'
})
export class CoreConfigService {
  public localConfig: any;
  private readonly _defaultConfig: any;
  private _configSubject: BehaviorSubject<any>;

  constructor(
    private _router: Router,
    @Inject(CORE_CUSTOM_CONFIG) private _config,
    public translateService: TranslateService,
  ) {
    if (_config.layout.enableLocalStorage) {
      this.localConfig = JSON.parse(localStorage.getItem('config'));
    } else {
      localStorage.removeItem('config');
    }
    _config.app.appLanguage = this.translateService.getBrowserLang();
    this._defaultConfig = this.localConfig ? this.localConfig : _config;
    this._initConfig();
  }

  get config(): any | Observable<any> {
    return this._configSubject.asObservable();
  }

  set config(data) {
    let config: CoreConfig;

    if (this.localConfig) {
      config = this.localConfig;
    } else {
      config = this._configSubject.getValue();
    }

    // config = _.merge({}, config, data);
    config = deepMerge(config, data);

    if (config.layout.enableLocalStorage) {
      localStorage.setItem('config', JSON.stringify(config));
    }

    this._configSubject.next(config);
  }

  get defaultConfig(): any {
    return this._defaultConfig;
  }

  setConfig(data, param = { emitEvent: true }): void {
    let config;

    this.localConfig = JSON.parse(localStorage.getItem('config'));
    if (this.localConfig) {
      config = this.localConfig;
    } else {
      config = this._configSubject.getValue();
    }

    // config = _.merge({}, config, data);
    config = deepMerge(config, data);

    if (config.layout.enableLocalStorage) {
      localStorage.setItem('config', JSON.stringify(config));
    }

    if (param.emitEvent === true) {
      this._configSubject.next(config);
    }
  }

  getConfig(): Observable<CoreConfig> {
    return this._configSubject.asObservable();
  }

  resetConfig(): void {
    this._configSubject.next(deepCopy(this._defaultConfig));
  }

  private _initConfig(): void {
    this._configSubject = new BehaviorSubject(deepCopy(this._defaultConfig));

    this._router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(() => {
      this.localConfig = JSON.parse(localStorage.getItem('config'));
      const localDefault = this.localConfig ? this.localConfig : this._defaultConfig;
      if (!deepEquals(this._configSubject.getValue().layout, localDefault.layout)) {
        const config = deepCopy(this._configSubject.getValue());
        config.layout = deepCopy(localDefault.layout);
        this._configSubject.next(config);
      }
    });
  }
}
