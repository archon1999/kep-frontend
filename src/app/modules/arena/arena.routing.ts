import { ArenaResolver } from './arena.resolver';
import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/arena/arena.component').then(c => c.ArenaComponent),
    title: 'Arena.Arena',
  },
  {
    path: 'tournament/:id',
    loadComponent: () => import('./pages/arena-tournament/arena-tournament.component').then(c => c.ArenaTournamentComponent),
    resolve: {
      arena: ArenaResolver,
    },
    data: {
      title: 'Arena.Tournament'
    }
  }
] satisfies Route[];
