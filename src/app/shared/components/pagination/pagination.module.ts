import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { CoreDirectivesModule } from 'core/directives/directives';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    FormsModule,
    CoreDirectivesModule,
    NgSelectModule,
    TranslateModule,
  ],
  exports: [
    PaginationComponent,
  ]
})
export class PaginationModule { }
