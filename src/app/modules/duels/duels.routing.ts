import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./ui/pages/duels/duels.page').then(c => c.DuelsPage),
    data: {
      title: 'Duels.Duels',
    },
  },
  {
    path: 'duels-rating',
    loadComponent: () => import('./ui/pages/duels-rating/duels-rating.page').then(c => c.DuelsRatingPage),
    data: {
      title: 'Duels.DuelsRating',
    },
  },
  {
    path: 'duel/:id',
    loadComponent: () => import('./ui/pages/duel/duel.component').then(c => c.DuelComponent),
    data: {
      title: 'Duels.Duel',
    },
  }
] satisfies Route[];
