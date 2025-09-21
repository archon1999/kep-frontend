import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from '@core/services/app-state.service';
import { TranslateService } from "@ngx-translate/core";
import { localeEn } from "./i18n/en";
import { localeRu } from "./i18n/ru";
import { localeUz } from "./i18n/uz";
import { CoreLoadingScreenService } from "@core/services/loading-screen.service";
import { NgSelectConfig } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    this.translateService.setTranslation('en', localeEn);
    this.translateService.setTranslation('ru', localeRu);
    this.translateService.setTranslation('uz', localeUz);

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
