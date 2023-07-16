import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxComponent } from './mathjax/mathjax.component';
import { MathJaxModule } from 'ngx-mathjax';



@NgModule({
  declarations: [
    MathjaxComponent
  ],
  imports: [
    CommonModule,
    MathJaxModule.forRoot({
      version: '2.7.5',
      config: 'TeX-AMS_HTML',
      hostname: 'cdnjs.cloudflare.com'
    }),
  ],
  exports: [
    MathjaxComponent,
    MathJaxModule,
  ]
})
export class MathjaxModule { }
