import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KepcoinViewComponent } from './kepcoin-view.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepcoinComponent } from './kepcoin/kepcoin.component';


@NgModule({
  declarations: [
    KepcoinViewComponent,
    KepcoinComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
  ],
  exports: [
    KepcoinViewComponent,
    KepcoinComponent
  ]
})
export class KepcoinViewModule {}
