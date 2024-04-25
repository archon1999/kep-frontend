import { NgModule } from '@angular/core';
import { ButtonDirective } from '@primeng/button/button.directive';
import { SharedModule } from '@primeng/api';
import { ButtonComponent } from '@primeng/button/button.component';
import { RippleModule } from '@primeng/ripple';
import { CommonModule } from '@angular/common';
import { SpinnerIcon } from '@primeng/icons/spinner';

@NgModule({
  imports: [CommonModule, RippleModule, SharedModule, SpinnerIcon],
  exports: [ButtonDirective, ButtonComponent, SharedModule],
  declarations: [ButtonDirective, ButtonComponent]
})
export class ButtonModule {}
