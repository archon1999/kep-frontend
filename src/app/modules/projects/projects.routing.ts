import { Routes } from '@angular/router';
import { ProjectResolver } from '@app/modules/projects/projects.resolver';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/projects/projects.component').then(c => c.ProjectsComponent),
    title: 'Projects.Projects',
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('./pages/project/project.component').then(c => c.ProjectComponent),
    data: {
      title: 'Projects.Project',
    },
    resolve: {
      project: ProjectResolver,
    }
  },
] satisfies Routes;
