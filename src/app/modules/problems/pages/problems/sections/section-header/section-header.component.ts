import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthUser } from '@auth';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { GeneralInfo } from '@problems/models/statistics.models';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, FlexLayoutModule, ContentHeaderModule, KepCardComponent, NgxSkeletonLoaderModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionHeaderComponent extends BaseLoadComponent<GeneralInfo> implements OnInit {
  @Input() override contentHeader: ContentHeader;

  constructor(public statisticsService: ProblemsStatisticsService) {
    super();
  }

  override ngOnInit() {}

  getData() {
    return this.statisticsService.getGeneral(this.authService.currentUserValue.username);
  }

  override afterChangeCurrentUser(currentUser: AuthUser) {
    if (currentUser) {
      this.loadData();
    }
  }
}
