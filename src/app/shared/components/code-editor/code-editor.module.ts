import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KepcoinSpendSwalModule } from '@app/modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { CodeEditorModalComponent } from './code-editor-modal/code-editor-modal.component';
import { NgSelectModule } from '../../third-part-modules/ng-select/ng-select.module';
import { CoreSidebarModule } from '@core/components';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgScrollbar } from 'ngx-scrollbar';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NewFeatureDirective } from '@shared/directives/new-feature.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { VerdictShortTitlePipe } from '@problems/pipes/verdict-short-title.pipe';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { ToastrModule } from '@shared/third-part-modules/toastr/toastr.module';

@NgModule({
  declarations: [
    CodeEditorModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    TranslateModule,
    MonacoEditorComponent,
    KepcoinSpendSwalModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    NgSelectModule,
    CoreSidebarModule,
    DragDropModule,
    NgScrollbar,
    KepcoinViewModule,
    NewFeatureDirective,
    NgbAccordionModule,
    SpinnerComponent,
    VerdictShortTitlePipe,
    ToastrModule
  ],
  exports: [
    CodeEditorModalComponent,
  ]
})
export class CodeEditorModule {}
