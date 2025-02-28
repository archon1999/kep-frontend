import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, Injectable } from '@angular/core';
import { provideRouter, RouterOutlet, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { provideToastr } from 'ngx-toastr';
import { FlatpickrModule } from 'angularx-flatpickr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { environment } from '../environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TableModule } from "ngx-easy-table";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from '@core/services/app-state.service';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { provideHttpClient } from "@angular/common/http";
import { WebsocketModule } from "@shared/services/websocket";
import { AuthService } from "@auth";
import { map } from "rxjs/operators";
import { monacoConfig } from "@app/monaco.config";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { HIGHLIGHT_OPTIONS, HighlightOptions } from "ngx-highlightjs";
import { Title } from "@angular/platform-browser";
import { NgxCountriesModule } from "@shared/third-part-modules/ngx-countries/ngx-countries.module";
import { APP_BASE_HREF } from '@angular/common';

function authFactory() {
  const authService = inject(AuthService);
  return () => authService.getMe().pipe(
    map(user => {
      return true;
    })
  );
}

@Injectable({providedIn: 'root'})
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
      const key = `PageTitle.${title}`;
      this.translateService.get(key).subscribe((value: any) => {
        this.title.setTitle(`${value} - KEP.uz`);
      });
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      closeButton: true,
    }),
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: APP_INITIALIZER,
      useFactory: authFactory,
      multi: true
    },
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
    RouterOutlet,
    ColorPickerModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    ColorPickerService,
    TableModule,
    NgbCollapseModule,
    importProvidersFrom(
      AppStateService,
      FlatpickrModule.forRoot(),
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
