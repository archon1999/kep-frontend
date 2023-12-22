import { NgModule } from '@angular/core';
import { NgSelectComponent } from './ng-select.component';
import { NgSelectModule as Module } from '@ng-select/ng-select';

@NgModule({
  declarations: [
  ],
  imports: [
    Module,
    NgSelectComponent
  ],
  exports: [
    Module,
    NgSelectComponent,
  ]
})
export class NgSelectModule { }
