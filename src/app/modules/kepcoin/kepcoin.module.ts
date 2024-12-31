import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { KepcoinComponent } from './kepcoin.component';
import { AuthGuard } from '@auth';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { KepcoinSpendSwalModule } from './kepcoin-spend-swal/kepcoin-spend-swal.module';
import { TranslateModule } from '@ngx-translate/core';
import { KepPaginationComponent, } from '@shared/components/kep-pagination/kep-pagination.component';

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
    KepPaginationComponent,
  ]
})
export class KepcoinModule { }
