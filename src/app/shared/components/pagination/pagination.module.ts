import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '@core/directives/directives';


@NgModule({
  declarations: [
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    FormsModule,
    CoreDirectivesModule,
  ],
  exports: [
    PaginationComponent,
  ]
})
export class PaginationModule { }
