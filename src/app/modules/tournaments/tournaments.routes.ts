import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./ui/pages/tournaments-list/tournaments-list.page').then(m => m.TournamentsListPage),
    title: 'Tournaments.Tournaments',
  },
  {
    path: 'tournament/:id',
    loadComponent: () => import('./ui/pages/tournament/tournament.page').then(m => m.TournamentPage),
    data: {
      title: 'Tournaments.Tournament',
    }
  },
] satisfies Routes;
