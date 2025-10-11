import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from '@core/services/app-state.service';
import { TranslateService } from "@ngx-translate/core";
import { localeEn as i18nEn } from "./i18n/en";
import { localeRu as i18nRu } from "./i18n/ru";
import { localeUz as i18nUz } from "./i18n/uz";
import { CoreLoadingScreenService } from "@core/services/loading-screen.service";
import { NgSelectConfig } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { registerLocaleData } from "@angular/common";

import localeRu from '@angular/common/locales/ru';
import localeUz from '@angular/common/locales/uz-Latn';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected translateService = inject(TranslateService);
  protected coreLoadingService = inject(CoreLoadingScreenService);
  private ngSelectConfig = inject(NgSelectConfig);

  constructor(private appStateService: AppStateService) {
    this.translateService.setTranslation('en', i18nEn);
    this.translateService.setTranslation('ru', i18nRu);
    this.translateService.setTranslation('uz', i18nUz);

    registerLocaleData(localeRu, 'ru');
    registerLocaleData(localeUz, 'uz');

    this.appStateService.state$
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        this.translateService.setDefaultLang(state.language);
        this.setNgSelectGlobalTexts();
      });

    this.translateService.onDefaultLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.setNgSelectGlobalTexts());
  }

  private setNgSelectGlobalTexts(): void {
    this.ngSelectConfig.notFoundText = this.translateService.instant('NgSelect.NotFound');
    this.ngSelectConfig.loadingText = this.translateService.instant('NgSelect.Loading');
  }
}
