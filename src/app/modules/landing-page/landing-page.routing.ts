import { Routes } from '@angular/router';
import { IsAuthenticatedGuard } from  '@auth';

export default [
  {
    path: '',
    loadComponent: () => import('./landing-page.component').then(c => c.LandingPageComponent),
    title: 'Landing',
    data: {
      animation: 'langing-page'
    },
    canActivate: [IsAuthenticatedGuard]
  },
] satisfies Routes;
