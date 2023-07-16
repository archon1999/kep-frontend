import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KepcoinSpendSwalComponent } from './kepcoin-spend-swal.component';
import { SweetAlertModule } from 'app/main/third-part-modules/sweet-alert/sweet-alert.module';
import { KepcoinViewModule } from 'app/main/elements/kepcoin-view/kepcoin-view.module';


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
