import { Routes } from '@angular/router';
import { IsAuthenticatedGuard } from '@auth';

export default [
  {
    path: '',
    loadComponent: () => import('./landing-page.component').then(c => c.LandingPageComponent),
    title: 'Landing',
    // canActivate: [IsAuthenticatedGuard]
  },
] satisfies Routes;
