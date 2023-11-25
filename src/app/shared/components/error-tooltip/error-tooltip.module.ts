import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTooltipComponent } from './error-tooltip.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ErrorTooltipComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
  ],
  exports: [
    ErrorTooltipComponent,
  ]
})
export class ErrorTooltipModule { }
