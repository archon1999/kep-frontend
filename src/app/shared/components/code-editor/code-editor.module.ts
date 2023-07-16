import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '../../../../@core/directives/directives';
import { CorePipesModule } from '../../../../@core/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { KepcoinSpendSwalModule } from '../../../modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { monacoConfig } from '../../../monaco-config';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ToastrModule } from 'ngx-toastr';
import { CodeEditorModalComponent } from './code-editor-modal/code-editor-modal.component';

@NgModule({
  declarations: [
    CodeEditorModalComponent,
  ],
  imports: [
    CommonModule,
    MonacoEditorModule,
    NgSelectModule,
    FormsModule,
    CoreDirectivesModule,
    ToastrModule,
    CorePipesModule,
    TranslateModule,
    MonacoEditorModule.forRoot(monacoConfig),
    KepcoinSpendSwalModule,
    NgbTooltipModule,
  ],
  exports: [
    CodeEditorModalComponent,
  ]
})
export class CodeEditorModule { }
