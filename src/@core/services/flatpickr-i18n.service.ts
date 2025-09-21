import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import english from 'flatpickr/dist/l10n/default';
import { Russian } from 'flatpickr/dist/l10n/ru';
import { Uzbek } from 'flatpickr/dist/l10n/uz';
import { CustomLocale, Locale } from 'flatpickr/dist/types/locale';

import { AppStateService, Language } from './app-state.service';

const FLATPICKR_LOCALES: Record<Language, Locale | CustomLocale> = {
  en: english,
  ru: Russian,
  uz: Uzbek,
};

@Injectable({ providedIn: 'root' })
export class FlatpickrI18nService {
  private readonly appStateService = inject(AppStateService);
  private readonly flatpickrDefaults = inject(FlatpickrDefaults);

  constructor() {
    this.applyLocale(this.appStateService.getCurrentValue().language);

    this.appStateService.state$
      .pipe(takeUntilDestroyed())
      .subscribe(({ language }) => this.applyLocale(language));
  }

  private applyLocale(language: Language): void {
    this.flatpickrDefaults.locale = FLATPICKR_LOCALES[language];
  }
}
