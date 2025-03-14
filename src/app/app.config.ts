import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injectable,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter, RouterOutlet, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';

import { environment } from '../environments/environment';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from '@core/services/app-state.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { WebsocketModule } from '@shared/services/websocket';
import { AuthService } from '@auth';
import { monacoConfig } from '@app/monaco.config';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { HIGHLIGHT_OPTIONS, HighlightOptions } from 'ngx-highlightjs';
import { Title } from '@angular/platform-browser';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { APP_BASE_HREF } from '@angular/common';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    public translateService: TranslateService,
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      const key = `PageTitle.${ title }`;
      this.translateService.get(key).subscribe((value: any) => {
        this.title.setTitle(`${ value } - KEP.uz`);
      });
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      closeButton: true,
    }),
    provideAppInitializer(() => inject(AuthService).getMe()),
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: <HighlightOptions>{
        lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          python: () => import('highlight.js/lib/languages/python'),
          cpp: () => import('highlight.js/lib/languages/cpp'),
        },
      }
    },
    provideFlatpickrDefaults(),
    RouterOutlet,
    ColorPickerModule,
    ColorPickerService,
    NgbCollapseModule,
    importProvidersFrom(
      AppStateService,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      TranslateModule.forRoot(),
      WebsocketModule.config({
        url: environment.wsUrl,
      }),
      NgxCountriesModule.forRoot({
        defaultLocale: 'en',
      }),
      MonacoEditorModule.forRoot(monacoConfig),
    ),
  ]
};
