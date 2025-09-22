import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@projects/ui/pages/projects-list/projects-list.page').then(c => c.ProjectsListPage),
    data: { title: 'Projects.Projects' },
    title: 'Projects.Projects',
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('@projects/ui/pages/project-detail/project-detail.page').then(c => c.ProjectDetailPage),
    data: {
      title: 'Projects.Project',
    },
  },
] satisfies Routes;
