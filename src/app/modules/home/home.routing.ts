import { HomeComponent } from './home.component';
import { AuthGuard } from '@auth/helpers';

export const homeRoutes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
  },
];
