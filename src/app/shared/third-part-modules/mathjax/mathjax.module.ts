import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxComponent } from './mathjax/mathjax.component';


@NgModule({
  declarations: [
    MathjaxComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MathjaxComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MathjaxModule { }
