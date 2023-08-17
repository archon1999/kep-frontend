import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KepcoinComponent } from './kepcoin.component';
import { AuthGuard } from 'app/auth/helpers';
import { KepcoinViewModule } from '../../shared/components/kepcoin-view/kepcoin-view.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { KepcoinSpendSwalModule } from './kepcoin-spend-swal/kepcoin-spend-swal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'app/shared/components/pagination/pagination.module';


const routes: Routes = [
  {
    path: '',
    component: KepcoinComponent,
    data: { animation: 'kepcoin' },
    title: 'Kepcoin',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    KepcoinComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    KepcoinViewModule,
    CoreDirectivesModule,
    KepcoinSpendSwalModule,
    TranslateModule,
    PaginationModule,
  ]
})
export class KepcoinModule { }
