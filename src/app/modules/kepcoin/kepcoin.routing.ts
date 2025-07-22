import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./kepcoin.component').then(c => c.KepcoinComponent),
    data: {animation: 'kepcoin'},
    title: 'Kepcoin',
  },
] satisfies Route[];
