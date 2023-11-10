import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxComponent } from './mathjax/mathjax.component';


@NgModule({
  declarations: [
    MathjaxComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MathjaxComponent,
  ]
})
export class MathjaxModule { }
