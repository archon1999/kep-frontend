import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KepcoinSpendSwalComponent } from './kepcoin-spend-swal.component';
import { SweetAlertModule } from '../../../shared/third-part-modules/sweet-alert/sweet-alert.module';
import { KepcoinViewModule } from '../../../shared/components/kepcoin-view/kepcoin-view.module';


@NgModule({
  declarations: [
    KepcoinSpendSwalComponent
  ],
  imports: [
    CommonModule,
    SweetAlertModule,
    KepcoinViewModule,
  ],
  exports: [
    KepcoinSpendSwalComponent
  ]
})
export class KepcoinSpendSwalModule { }
