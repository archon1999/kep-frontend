import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockUIModule } from 'ng-block-ui';

import { CoreCommonModule } from 'core/common.module';
import { CoreCardComponent } from 'core/components/core-card/core-card.component';
import { CoreBlockUiComponent } from 'core/components/core-card/core-block-ui/core-block-ui.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CoreCardComponent, CoreBlockUiComponent],
  imports: [CommonModule, BlockUIModule.forRoot({ template: CoreBlockUiComponent }), CoreCommonModule, NgbCollapseModule],
  exports: [CoreCardComponent],
})
export class CoreCardModule {}
