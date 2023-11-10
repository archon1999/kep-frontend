import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreMenuModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';

import { VerticalMenuComponent } from 'app/layout/components/menu/vertical-menu/vertical-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    VerticalMenuComponent
  ],
  imports: [
    CoreMenuModule,
    CoreCommonModule,
    NgScrollbarModule,
    RouterModule
  ],
  exports: [
    VerticalMenuComponent
  ]
})
export class VerticalMenuModule {
}
