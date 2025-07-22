import { Component, inject } from '@angular/core';
import { BaseTablePageComponent } from '@core/common';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { Hackathon } from '@app/modules/hackathons/domain';
import { HackathonCardComponent } from "@app/modules/hackathons";

@Component({
  selector: 'page-hackathons',
  templateUrl: './hackathons-list.page.html',
  styleUrls: ['./hackathons-list.page.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    HackathonCardComponent,
    ContentHeaderModule,
    KepPaginationComponent,
    NgxSkeletonLoaderModule,
    KepCardComponent,
  ]
})
export class HackathonsListPage extends BaseTablePageComponent<Hackathon> {
  protected hackathonsApiService = inject(HackathonsApiService);

  get hackathons() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Hackathon>> {
    return this.hackathonsApiService.getHackathons();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.HACKATHONS',
      breadcrumb: {
        links: [
          { name: 'Competitions', isLink: false },
          { name: 'MENU.HACKATHONS', isLink: false },
        ]
      }
    };
  }
}
