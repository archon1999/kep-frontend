import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./kepcoin.component').then(c => c.KepcoinComponent),
    data: { animation: 'kepcoin' },
    title: 'Kepcoin',
  },
  {
    path: 'earns',
    loadComponent: () => import('./pages/earns/earns.component').then(c => c.EarnsComponent),
    title: 'Kepcoin',
  },
  {
    path: 'spends',
    loadComponent: () => import('./pages/spends/spends.component').then(c => c.SpendsComponent),
    title: 'Kepcoin',
  },
] satisfies Route[];
