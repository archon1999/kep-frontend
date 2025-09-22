import { HomeComponent } from './home.component';
import { AuthGuard } from '@auth';
import { Route } from '@angular/router';

export default [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
  },
] satisfies Route[];
