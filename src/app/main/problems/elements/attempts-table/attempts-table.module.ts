import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AttemptsTableComponent } from './attempts-table.component';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ContestantViewModule } from 'app/main/elements/contestant-view/contestant-view.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KepcoinSpendSwalModule } from 'app/main/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';

@NgModule({
  declarations: [
    AttemptsTableComponent
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
    MonacoEditorModule,
  ],
  exports: [
    AttemptsTableComponent
  ]
})
export class AttemptsTableModule { }
