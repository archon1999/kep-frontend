import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { BasePageComponent } from "@core/common";

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, FlexLayoutModule, ContentHeaderModule, NgxSkeletonLoaderModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionHeaderComponent extends BasePageComponent {
  @Input() override contentHeader: ContentHeader;

  override ngOnInit() {}
}
