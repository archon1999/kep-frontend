import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule as Module } from 'ngx-monaco-editor';
import { MonacoEditorComponent } from './monaco-editor.component';
import { FormsModule } from '@angular/forms';
import { monacoConfig } from '../../../monaco-config';

@NgModule({
  declarations: [
    MonacoEditorComponent
  ],
  imports: [
    CommonModule,
    Module.forRoot(monacoConfig),
    FormsModule,
  ],
  exports: [
    MonacoEditorComponent,
  ]
})
export class MonacoEditorModule {
}
