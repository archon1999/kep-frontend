import { NgModule } from '@angular/core';
import { ToastrComponent } from './toastr.component';
import { ToastrModule as Module } from 'ngx-toastr';

@NgModule({
  declarations: [
    ToastrComponent
  ],
  imports: [
    Module.forRoot(),
  ],
  exports: [
    Module,
    ToastrComponent,
  ]
})
export class ToastrModule { }
