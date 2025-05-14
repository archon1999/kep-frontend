import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@projects/pages/projects-list/projects-list.page').then(c => c.ProjectsListPage),
    title: 'Projects.Projects',
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('@projects/pages/project-detail/project-detail.page').then(c => c.ProjectDetailPage),
    data: {
      title: 'Projects.Project',
    },
  },
] satisfies Routes;
