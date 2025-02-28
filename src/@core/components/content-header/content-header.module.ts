import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderComponent } from "@core/components/content-header/content-header.component";

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, RouterModule, CoreCommonModule, TranslateModule, NgbTooltipModule],
  exports: [ContentHeaderComponent]
})
export class ContentHeaderModule {}
