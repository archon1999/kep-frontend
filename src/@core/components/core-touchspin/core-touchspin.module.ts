import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreTouchspinComponent } from '../../components/core-touchspin/core-touchspin.component';
import { CoreCommonModule } from '../../common.module';

@NgModule({
  declarations: [CoreTouchspinComponent],
  imports: [CommonModule, FormsModule, CoreCommonModule],
  exports: [CoreTouchspinComponent]
})
export class CoreTouchspinModule {}
