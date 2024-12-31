import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { ContentComponent } from '@layout/components/content/content.component';

@NgModule({
  declarations: [ContentComponent],
  imports: [RouterModule, CoreCommonModule],
  exports: [ContentComponent]
})
export class ContentModule {}
