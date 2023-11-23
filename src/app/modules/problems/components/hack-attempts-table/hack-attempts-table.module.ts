import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HackAttemptsTableComponent } from './hack-attempts-table.component';
import { CorePipesModule } from 'core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { CoreDirectivesModule } from 'core/directives/directives';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { TableComponent } from './table/table.component';
import { ClipboardModule } from 'app/shared/components/clipboard/clipboard.module';
import { ProblemsPipesModule } from '../../pipes/problems-pipes.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';

@NgModule({
  declarations: [
    HackAttemptsTableComponent,
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
    MonacoEditorComponent,
    ClipboardModule,
    ProblemsPipesModule,
  ],
  exports: [
    HackAttemptsTableComponent
  ]
})
export class HackAttemptsTableModule {}
