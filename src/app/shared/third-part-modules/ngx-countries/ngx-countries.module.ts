import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxCountriesService } from './ngx-countries.service';
import { NGX_COUNTRIES_DEFAULT_LOCALE, NGX_COUNTRIES_LOCALES } from './constants';
import * as i18nIsoCountries from 'i18n-iso-countries';
import enJSON from 'i18n-iso-countries/langs/en.json';
import ruJSON from 'i18n-iso-countries/langs/ru.json';
import uzJSON from 'i18n-iso-countries/langs/uz.json';
import { CountryNamePipe } from './country-name.pipe';

export interface NgxCountriesOptions {
  defaultLocale?: string;
}

export function NgxCountriesLocalesFactory(defaultLocale: string) {
  i18nIsoCountries.registerLocale(uzJSON);
  i18nIsoCountries.registerLocale(ruJSON);
  i18nIsoCountries.registerLocale(enJSON);

  return new NgxCountriesService(defaultLocale);
}

@NgModule({
  providers: [
    {
      provide: NgxCountriesService,
      useFactory: NgxCountriesLocalesFactory,
      deps: [NGX_COUNTRIES_LOCALES, NGX_COUNTRIES_DEFAULT_LOCALE]
    }
  ],
  declarations: [CountryNamePipe],
  exports: [CountryNamePipe]
})
export class NgxCountriesModule {
  static forRoot(options: NgxCountriesOptions = {}): ModuleWithProviders<NgxCountriesModule> {
    return {
      ngModule: NgxCountriesModule,
      providers: [
        {
          provide: NGX_COUNTRIES_DEFAULT_LOCALE,
          useValue: options.defaultLocale || 'en'
        },
        {
          provide: NGX_COUNTRIES_LOCALES,
          useValue: ['en', 'ru', 'uz']
        },
        {
          provide: NgxCountriesService,
          useFactory: NgxCountriesLocalesFactory,
          deps: [NGX_COUNTRIES_DEFAULT_LOCALE]
        }
      ]
    };
  }
}
