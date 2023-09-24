import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '../../../../@core/directives/directives';
import { CorePipesModule } from '../../../../@core/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { KepcoinSpendSwalModule } from '../../../modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { monacoConfig } from '../../../monaco-config';
import { ToastrModule } from 'ngx-toastr';
import { CodeEditorModalComponent } from './code-editor-modal/code-editor-modal.component';
import { MonacoEditorModule } from '../../third-part-modules/monaco-editor/monaco-editor.module';
import { ErrorTooltipModule } from '../error-tooltip/error-tooltip.module';

@NgModule({
  declarations: [
    CodeEditorModalComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    CoreDirectivesModule,
    ToastrModule,
    CorePipesModule,
    TranslateModule,
    MonacoEditorModule,
    KepcoinSpendSwalModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    ErrorTooltipModule
  ],
  exports: [
    CodeEditorModalComponent,
  ]
})
export class CodeEditorModule {
}
