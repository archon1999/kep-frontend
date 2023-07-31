import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersSelectComponent } from './users-select.component';
import { NgSelectModule } from '../../third-part-modules/ng-select/ng-select.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersSelectComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [
    UsersSelectComponent,
  ]
})
export class UsersSelectModule { }
