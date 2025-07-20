import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderComponent } from "@shared/ui/components/content-header/content-header.component";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, RouterModule, CoreCommonModule, TranslateModule, NgbTooltipModule, KepCardComponent],
  exports: [ContentHeaderComponent]
})
export class ContentHeaderModule {}
