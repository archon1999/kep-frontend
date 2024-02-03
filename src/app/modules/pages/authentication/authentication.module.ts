import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';
import { IsAuthenticatedGuard } from  '@auth';
import { AuthLoginV2Component } from '../../pages/authentication/auth-login-v2/auth-login-v2.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

// routing
const routes: Routes = [
  {
    path: 'login',
    component: AuthLoginV2Component,
    data: { animation: 'auth' },
    canActivate: [IsAuthenticatedGuard],
  }
];

@NgModule({
  declarations: [AuthLoginV2Component],
  imports: [RouterModule.forChild(routes), CoreCommonModule, NgbAlertModule],
  providers: [IsAuthenticatedGuard]
})
export class AuthenticationModule {}
