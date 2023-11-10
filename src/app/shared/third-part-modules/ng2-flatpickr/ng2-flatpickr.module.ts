import { NgModule } from '@angular/core';
import { Ng2FlatpickrComponent } from './ng2-flatpickr.component';
// import { Ng2FlatpickrModule as Module } from 'ng2-flatpickr';


@NgModule({
  declarations: [
    Ng2FlatpickrComponent
  ],
  imports: [
    // Module,
  ],
  exports: [
    // Module,
    Ng2FlatpickrComponent,
  ]
})
export class Ng2FlatpickrModule { }
