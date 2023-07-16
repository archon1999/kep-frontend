import { NgModule } from '@angular/core';
import { QuillComponent } from './quill.component';
import { QuillModule as Module } from 'ngx-quill';

@NgModule({
  declarations: [
    QuillComponent
  ],
  imports: [
    Module.forRoot(),
  ],
  exports: [
    Module,
    QuillComponent,
  ]
})
export class QuillModule { }
