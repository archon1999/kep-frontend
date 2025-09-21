import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/duels/duels.page').then(c => c.DuelsPage),
    data: {
      title: 'Duels.Duels',
    },
  },
  {
    path: 'duel/:id',
    loadComponent: () => import('./pages/duel/duel.component').then(c => c.DuelComponent),
    data: {
      title: 'Duels.Duel',
    },
  }
] satisfies Route[];
