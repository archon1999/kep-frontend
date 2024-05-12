import { Routes } from '@angular/router';
import { ProjectResolver } from '@app/modules/projects/projects.resolver';
import { ProjectsComponent } from '@projects/pages/projects/projects.component';
import { Resources } from '@app/resources';

export default [
  {
    path: Resources.Projects,
    loadComponent: () => import('./pages/projects/projects.component').then(c => c.ProjectsComponent),
  },
] satisfies Routes;

// export default [
//   {
//     path: 'projects',
//     component: ProjectsComponent
//   },
// ] satisfies Routes;
//
