import { NgModule } from '@angular/core';
import { NouisliderComponent } from './nouislider.component';
import { NouisliderModule as Module } from 'ng2-nouislider';

@NgModule({
  declarations: [
    NouisliderComponent
  ],
  imports: [
    Module,
  ],
  exports: [
    Module,
    NouisliderComponent,
  ]
})
export class NouisliderModule { }
