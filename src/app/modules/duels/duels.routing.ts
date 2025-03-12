import { Route } from '@angular/router';

export default [
  {
    path: 'duel/:id',
    loadComponent: () => import('./pages/duel/duel.component').then(c => c.DuelComponent),
    data: {
      title: 'Duels.Duel',
    },
  }
] satisfies Route[];
