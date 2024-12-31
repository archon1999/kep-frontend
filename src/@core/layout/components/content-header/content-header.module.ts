import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { BreadcrumbModule } from '@layout/components/content-header/breadcrumb/breadcrumb.module';
import { ContentHeaderComponent } from '@layout/components/content-header/content-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, RouterModule, CoreCommonModule, BreadcrumbModule, TranslateModule, NgbTooltipModule],
  exports: [ContentHeaderComponent]
})
export class ContentHeaderModule {}
