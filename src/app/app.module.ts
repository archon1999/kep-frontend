import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import 'hammerjs';
import { ToastrModule } from './main/third-part-modules/toastr/toastr.module';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CoreModule } from '@core/core.module';
import { CorePipesModule } from '@core/pipes/pipes.module';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { ErrorComponent } from './main/pages/miscellaneous/error/error.component';
import { WebsocketModule } from './websocket';

import { APP_BASE_HREF } from '@angular/common';
import { UserPopoverModule } from './main/elements/user-popover/user-popover.module';

import { environment } from 'environments/environment';
import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: '', loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule) },
  { path: 'home', loadChildren: () => import('./main/home/home.module').then(m => m.HomeModule) },
  { path: 'settings', loadChildren: () => import('./main/account-settings/account-settings.module').then(m => m.AccountSettingsModule) },
  { path: 'kepcoin', loadChildren: () => import('./main/kepcoin/kepcoin.module').then(m => m.KepcoinModule) },
  { path: 'learn/courses', loadChildren: () => import('./main/courses/courses.module').then(m => m.CoursesModule) },
  { path: 'learn/lugavar', loadChildren: () => import('./main/lugavar/lugavar.module').then(m => m.LugavarModule) },
  { path: 'learn/blog', loadChildren: () => import('./main/blog/blog.module').then(m => m.BlogModule) },
  { path: 'practice/problems', loadChildren: () => import('./main/problems/problems.module').then(m => m.ProblemsModule) },
  { path: 'practice/challenges', loadChildren: () => import('./main/challenges/challenges.module').then(m => m.ChallengesModule) },
  { path: 'practice/tests', loadChildren: () => import('./main/testing/testing.module').then(m => m.TestingModule) },
  { path: 'practice/projects', loadChildren: () => import('./main/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'practice/duels', loadChildren: () => import('./main/duels/duels.module').then(m => m.DuelsModule) },
  { path: 'competitions/contests', loadChildren: () => import('./main/contests/contests.module').then(m => m.ContestsModule) },
  { path: 'competitions/arena', loadChildren: () => import('./main/arena/arena.module').then(m => m.ArenaModule) },
  { path: 'competitions/tournaments', loadChildren: () => import('./main/tournaments/tournaments.module').then(m => m.TournamentsModule) },
  { path: 'users', loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule) },
  { path: 'help', loadChildren: () => import('./main/help/help.module').then(m => m.HelpModule) },
  { path: 'my-blog', loadChildren: () => import('./main/users/my-blog/my-blog.module').then(m => m.MyBlogModule) },
  { path: 'cpython-cup', loadChildren: () => import('./main/cpython-cup/cpython-cup.module').then(m => m.CpythonCupModule) },
  { path: 'tour', loadChildren: () => import('./main/third-part-modules/tour/tour.module').then(m => m.TourModule) },
  { path: '**', component: ErrorComponent },
];

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
      let key = `PageTitle.${title}`;
      this.translateService.get(key).subscribe((value: any) => {
        this.title.setTitle(`${value} | CPython.uz`);
      });
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    AuthModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule,

    WebsocketModule.config({
      url: environment.wsUrl,
    }),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CorePipesModule,
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    HighlightModule,

    // App modules
    LayoutModule,
    UserPopoverModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
  ],
  providers: [
    {provide: TitleStrategy, useClass: CustomTitleStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: <HighlightOptions> {
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          python: () => import('highlight.js/lib/languages/python'), 
        },
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
