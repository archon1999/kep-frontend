import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./shop.component').then(c => c.ShopComponent),
    title: 'Shop.Shop',
  },
] satisfies Route[];
