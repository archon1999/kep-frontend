import { Routes } from '@angular/router';
import { ContentLayoutComponent } from '@core/layouts/content-layout/content-layout.component';
import { AuthenticationLayoutComponent } from '@core/layouts/authentication-layout/authentication-layout.component';
import { LandingLayoutComponent } from "@core/layouts/landing-layout/landing-layout.component";
import { IsAuthenticatedGuard } from '@auth';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/landing-page/landing-page.routing'),
      },
    ]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routing')
      },
      {
        path: 'learn/courses',
        loadChildren: () => import('./modules/courses/courses.routing')
      },
      {
        path: 'learn/blog',
        loadChildren: () => import('./modules/blog/blog.routing')
      },
      {
        path: 'learn/lugavar',
        loadChildren: () => import('./modules/lugavar/lugavar.module').then(m => m.LugavarModule)
      },
      {
        path: 'practice/problems',
        loadChildren: () => import('./modules/problems/problems.routing')
      },
      {
        path: 'practice/challenges',
        loadChildren: () => import('./modules/challenges/challenges.routing')
      },
      {
        path: 'practice/tests',
        loadChildren: () => import('@testing/testing.routes')
      },
      {
        path: 'practice/projects',
        loadChildren: () => import('./modules/projects/projects.routing')
      },
      {
        path: 'practice/duels',
        loadChildren: () => import('./modules/duels/duels.routing'),
      },
      {
        path: 'duels-rating',
        loadComponent: () => import('./modules/duels/ui/pages/duels-rating/duels-rating.page').then(c => c.DuelsRatingPage),
        data: { title: 'Duels.DuelsRating' },
      },
      {
        path: 'competitions/contests',
        loadChildren: () => import('./modules/contests/contests.routing')
      },
      {
        path: 'competitions/hackathons',
        loadChildren: () => import('@hackathons/config/routes')
      },
      {
        path: 'competitions/arena',
        loadChildren: () => import('./modules/arena/arena.routing')
      },
      {
        path: 'competitions/tournaments',
        loadChildren: () => import('./modules/tournaments/tournaments.routes'),
      },
      {
        path: 'users',
        loadChildren: () => import('@users/config/routes'),
      },
      {
        path: 'calendar',
        loadChildren: () => import('./modules/calendar/calendar.routing'),
      },
      {
        path: 'shop',
        loadChildren: () => import('./modules/shop/shop.routing'),
      },
      {
        path: 'kep-cover',
        loadComponent: () => import('./modules/kep-cover-3/kep-cover-3.component').then(c => c.KepCover3Component),
      },
      {
        path: 'kepcoin',
        loadChildren: () => import('./modules/kepcoin/kepcoin.routing'),
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/account-settings/account-settings.routing'),
      },
    ]
  },
  {
    path: '',
    component: AuthenticationLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('@auth/login/login.component').then(c => c.LoginComponent),
        canActivate: [IsAuthenticatedGuard],
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./modules/error/error404/error404.component').then(c => c.Error404Component)
  }
];

