import { NgModule } from '@angular/core';

import { RippleEffectDirective } from '@shared/directives/core-ripple-effect/ripple-effect.directive';
import { FeatherIconDirective } from "@shared/directives/core-feather-icons/feather-icons.directive";

@NgModule({
  declarations: [RippleEffectDirective, FeatherIconDirective],
  exports: [RippleEffectDirective, FeatherIconDirective]
})
export class CoreDirectivesModule {}
