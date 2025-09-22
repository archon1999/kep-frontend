import { Routes } from '@angular/router';
import { hackathonResolver } from "@hackathons/data-access/hackathon.resolver";

export default [
  {
    path: '',
    loadComponent: () => import('../ui/pages/hackathons-list/hackathons-list.page').then(m => m.HackathonsListPage),
    title: 'Hackathons.Hackathons',
    data: { title: 'Hackathons.Hackathons' },
  },
  {
    path: 'hackathon/:id',
    loadComponent: () => import('../ui/pages/hackathon/hackathon.page').then(m => m.HackathonPage),
    data: { title: 'Hackathons.Hackathon' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
  {
    path: 'hackathon/:id/projects',
    loadComponent: () => import('@hackathons/ui/pages/hackathon-projects/hackathon-projects.page').then(m => m.HackathonProjectsPage),
    data: { title: 'Hackathons.HackathonProjects' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
  {
    path: 'hackathon/:id/projects/:symbol',
    loadComponent: () => import('@hackathons/ui/pages/hackathon-project/hackathon-project.page').then(m => m.HackathonProjectPage),
    data: { title: 'Projects.Project' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
  {
    path: 'hackathon/:id/attempts',
    loadComponent: () => import('@hackathons/ui/pages/hackathon-attempts/hackathon-attempts.page').then(m => m.HackathonAttemptsPage),
    data: { title: 'Hackathons.HackathonAttempts' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
  {
    path: 'hackathon/:id/standings',
    loadComponent: () => import('@hackathons/ui/pages/hackathon-standings/hackathon-standings.page').then(m => m.HackathonStandingsPage),
    data: { title: 'Hackathons.HackathonStandings' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
  {
    path: 'hackathon/:id/registrants',
    loadComponent: () => import('@hackathons/ui/pages/hackathon-registrants/hackathon-registrants.page').then(m => m.HackathonRegistrantsPage),
    data: { title: 'Hackathons.HackathonRegistrants' },
    resolve: {
      hackathon: hackathonResolver,
    }
  },
] satisfies Routes;
