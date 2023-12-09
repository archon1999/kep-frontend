import { NgModule } from '@angular/core';

import { FeatherIconDirective } from '@shared/directives/core-feather-icons/feather-icons.directive';
import { RippleEffectDirective } from '@shared/directives/core-ripple-effect/ripple-effect.directive';

@NgModule({
  declarations: [RippleEffectDirective, FeatherIconDirective],
  exports: [RippleEffectDirective, FeatherIconDirective]
})
export class CoreDirectivesModule {}
