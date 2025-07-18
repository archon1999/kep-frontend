import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../ui/pages/hackathons-list/hackathons-list.page').then(m => m.HackathonsListPage),
    title: 'Hackathons.Hackathons',
  },
  {
    path: 'hackathon/:id',
    loadComponent: () => import('../ui/pages/hackathon/hackathon.page').then(m => m.HackathonPage),
    data: { title: 'Hackathons.Hackathon' }
  },
  {
    path: 'hackathon/:id/projects',
    loadComponent: () => import('../ui/pages/hackathon/hackathon-projects/hackathon-projects.component').then(m => m.HackathonProjectsComponent),
    data: { title: 'Hackathons.HackathonProjects' }
  },
  {
    path: 'hackathon/:id/attempts',
    loadComponent: () => import('../ui/pages/hackathon/hackathon-attempts/hackathon-attempts.component').then(m => m.HackathonAttemptsComponent),
    data: { title: 'Hackathons.HackathonAttempts' }
  },
  {
    path: 'hackathon/:id/standings',
    loadComponent: () => import('../ui/pages/hackathon/hackathon-standings/hackathon-standings.component').then(m => m.HackathonStandingsComponent),
    data: { title: 'Hackathons.HackathonStandings' }
  },
  {
    path: 'hackathon/:id/registrants',
    loadComponent: () => import('../ui/pages/hackathon/hackathon-registrants/hackathon-registrants.component').then(m => m.HackathonRegistrantsComponent),
    data: { title: 'Hackathons.HackathonRegistrants' }
  },
] satisfies Routes;
