import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { PageResult } from '@core/common/classes/page-result';
import { DuelsRating } from '@duels/domain';
import { DuelsApiService } from '@duels/data-access';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { Resources } from '@app/resources';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'page-duels-rating',
  standalone: true,
  templateUrl: './duels-rating.page.html',
  styleUrls: ['./duels-rating.page.scss'],
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepCardComponent,
    KepPaginationComponent,
    TableOrderingModule,
    UserPopoverModule,
    ResourceByUsernamePipe,
    NgbTooltip,
  ]
})
export class DuelsRatingPage extends BaseTablePageComponent<DuelsRating> implements OnInit {
  override defaultPageSize = 12;
  override pageOptions = [6, 9, 12, 24];
  override maxSize = 5;

  override defaultOrdering = '-wins';

  constructor(private readonly duelsApi: DuelsApiService) {
    super();
  }

  get duelsRatingList() {
    return this.pageResult?.data ?? [];
  }

  override ngOnInit(): void {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  override getPage(): Observable<PageResult<DuelsRating>> {
    return this.duelsApi.getDuelsRating(this.pageable);
  }

  protected override getContentHeader() {
    return {
      headerTitle: 'DuelsRating',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Duels',
            isLink: true,
            link: Resources.Duels,
          },
        ],
      },
    };
  }
}
