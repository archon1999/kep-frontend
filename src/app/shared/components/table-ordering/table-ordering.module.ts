import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { TableOrderingComponent } from './table-ordering.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

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
    KepIconComponent,
  ],
  exports: [
    TableOrderingComponent,
  ]
})
export class TableOrderingModule {}
