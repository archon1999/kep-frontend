import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '../../../../core/directives/directives';
import { CorePipesModule } from '../../../../core/pipes/pipes.module';
import { TableOrderingComponent } from './table-ordering.component';

@NgModule({
  declarations: [
    TableOrderingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CoreDirectivesModule,
    CorePipesModule,
  ],
  exports: [
    TableOrderingComponent,
  ]
})
export class TableOrderingModule { }
