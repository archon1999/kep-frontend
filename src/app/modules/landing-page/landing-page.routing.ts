import { Routes } from '@angular/router';
import { LandingPageComponent } from '@app/modules/landing-page/landing-page.component';
import { IsAuthenticatedGuard } from '@auth/helpers';

export default [
  {
    path: '',
    loadComponent: () => import('./landing-page.component').then(c => c.LandingPageComponent),
    title: 'Landing',
    canActivate: [IsAuthenticatedGuard]
  },
] satisfies Routes;
