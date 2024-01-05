import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import 'hammerjs';
import { ToastrModule } from '@shared/third-part-modules/toastr/toastr.module';

import { CoreCommonModule } from 'core/common.module';
import { CoreSidebarModule } from 'core/components';
import { CoreModule } from 'core/core.module';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { coreConfig } from './app.config';

import { AppComponent } from 'app/app.component';
import { WebsocketModule } from '@shared/services/websocket';

import { APP_BASE_HREF } from '@angular/common';
import { environment } from 'environments/environment';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { monacoConfig } from './monaco.config';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { map } from 'rxjs/operators';
import { AuthService } from '@auth/service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BS_BREAKPOINTS, CustomBreakPointsProvider } from '@layout/custom-breakpoints';

import { register } from 'swiper/element/bundle';
import { LayoutComponent } from '@layout/layout.component';

register();

const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./modules/landing-page/landing-page.routing'), pathMatch: 'full' },
  { path: '', loadChildren: () => import('./modules/pages/pages.module').then(m => m.PagesModule) },
  { path: 'home', loadChildren: () => import('./modules/home/home.routing') },
  { path: 'settings', loadChildren: () => import('./modules/account-settings/account-settings.module').then(m => m.AccountSettingsModule) },
  { path: 'kepcoin', loadChildren: () => import('./modules/kepcoin/kepcoin.module').then(m => m.KepcoinModule) },
  { path: 'learn/courses', loadChildren: () => import('./modules/courses/courses.module').then(m => m.CoursesModule) },
  { path: 'learn/lugavar', loadChildren: () => import('./modules/lugavar/lugavar.module').then(m => m.LugavarModule) },
  { path: 'learn/blog', loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule) },
  { path: 'practice/problems', loadChildren: () => import('@problems/problems.routing') },
  { path: 'practice/challenges', loadChildren: () => import('./modules/challenges/challenges.module').then(m => m.ChallengesModule) },
  { path: 'practice/tests', loadChildren: () => import('./modules/testing/testing.module').then(m => m.TestingModule) },
  { path: 'practice/projects', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'practice/duels', loadChildren: () => import('./modules/duels/duels.module').then(m => m.DuelsModule) },
  { path: 'competitions/code-rush', loadChildren: () => import('./modules/code-rush/code-rush.module').then(m => m.CodeRushModule) },
  { path: 'competitions/contests', loadChildren: () => import('./modules/contests/contests.module').then(m => m.ContestsModule) },
  { path: 'competitions/arena', loadChildren: () => import('./modules/arena/arena.routing') },
  {
    path: 'competitions/tournaments',
    loadChildren: () => import('./modules/tournaments/tournaments.module').then(m => m.TournamentsModule)
  },
  { path: 'users', loadChildren: () => import('./modules/users/users.routing') },
  { path: 'help', loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule) },
  { path: 'todo', loadComponent: () => import('./modules/todo/todo.component').then(c => c.TodoComponent) },
  { path: '**', loadComponent: () => import('./modules/pages/miscellaneous/error/error.component').then(c => c.ErrorComponent) },
];

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
        this.title.setTitle(`${ value } - ${ coreConfig.app.appTitle }`);
      });
    }
  }
}

export function authFactory(authService: AuthService) {
  return () => authService.getMe().pipe(
    map(user => {
      return true;
    })
  );
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled'
    }),
    TranslateModule.forRoot(),
    ToastrModule,

    WebsocketModule.config({
      url: environment.wsUrl,
    }),

    FlexLayoutModule.withConfig({ disableDefaultBps: true }, BS_BREAKPOINTS ),

    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    NgxSpinnerModule,
    MonacoEditorModule.forRoot(monacoConfig),
    NgxCountriesModule.forRoot({
      defaultLocale: 'en',
    }),
    LayoutComponent
  ],
  providers: [
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: APP_INITIALIZER,
      useFactory: authFactory,
      deps: [AuthService],
      multi: true
    },
    CustomBreakPointsProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
