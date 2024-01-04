import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AttemptsTableComponent } from './attempts-table.component';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { NgbModalModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { TableComponent } from './table/table.component';
import { ClipboardModule } from 'app/shared/components/clipboard/clipboard.module';
import { ProblemsPipesModule } from '../../pipes/problems-pipes.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';

@NgModule({
  declarations: [
    AttemptsTableComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CorePipesModule,
    CoreDirectivesModule,
    ContestantViewModule,
    NgbModalModule,
    FormsModule,
    KepcoinSpendSwalModule,
    RouterModule,
    ClipboardModule,
    ReactiveFormsModule,
    ProblemsPipesModule,
    NgbNavModule,
    MonacoEditorComponent,
    NgbTooltipModule,
    KepcoinViewModule,
  ],
  exports: [
    AttemptsTableComponent
  ]
})
export class AttemptsTableModule {}
