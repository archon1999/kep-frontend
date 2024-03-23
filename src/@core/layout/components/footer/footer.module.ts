import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { FooterComponent } from '@layout/components/footer/footer.component';
import { ScrollTopComponent } from '@layout/components/footer/scroll-to-top/scroll-top.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionFooterComponent } from '@app/modules/landing-page/sections/section-footer/section-footer.component';

@NgModule({
  declarations: [FooterComponent, ScrollTopComponent],
  imports: [RouterModule, CoreCommonModule, KepIconComponent, NgbTooltipModule, SectionFooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
