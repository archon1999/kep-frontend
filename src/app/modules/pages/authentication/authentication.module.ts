import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from 'core/common.module';

import { TranslateModule } from '@ngx-translate/core';
import { IsAuthenticatedGuard } from 'app/auth/helpers';
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
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CoreCommonModule, TranslateModule, NgbAlertModule],
  providers: [IsAuthenticatedGuard]
})
export class AuthenticationModule { }
