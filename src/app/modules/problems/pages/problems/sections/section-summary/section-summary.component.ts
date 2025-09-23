import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthUser } from '@auth';
import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { CoreCommonModule } from '@core/common.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { ProblemsApiService } from "@problems/services/problems-api.service";
import { ProblemsRating } from "@problems/models/rating.models";

@Component({
  selector: 'section-summary',
  standalone: true,
  imports: [CoreCommonModule, FlexLayoutModule, ContentHeaderModule, KepCardComponent, NgxSkeletonLoaderModule],
  templateUrl: './section-summary.component.html',
  styleUrl: './section-summary.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionSummaryComponent extends BaseLoadComponent<ProblemsRating> implements OnInit {
  @Input() override contentHeader: ContentHeader;

  constructor(public service: ProblemsApiService) {
    super();
  }

  override ngOnInit() {}

  getData() {
    return this.service.getUserProblemsRating(this.authService.currentUserValue.username);
  }

  override afterChangeCurrentUser(currentUser: AuthUser) {
    if (currentUser) {
      this.loadData();
    }
  }
}
