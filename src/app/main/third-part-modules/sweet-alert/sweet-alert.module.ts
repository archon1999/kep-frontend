import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlertComponent } from './sweet-alert.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    SweetAlertComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [
    SweetAlertComponent,
    SweetAlert2Module,
  ]
})
export class SweetAlertModule { }
