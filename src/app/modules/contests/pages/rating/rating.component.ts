import { Component, OnInit } from '@angular/core';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContestsService } from '../../contests.service';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestsRating } from '@contests/models/contests-rating';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestantViewModule,
    KepPaginationComponent,
    NgbTooltip,
    TableOrderingModule,
    KepCardComponent,
    SpinnerComponent,
  ]
})
export class RatingComponent extends BaseTablePageComponent<ContestsRating> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 12;
  override pageOptions = [12, 24, 36];
  override defaultOrdering = '-rating';

  public readonly orderingOptions = ['rating', 'maxRating', 'contestantsCount'] as const;
  public readonly orderingLabels: Record<(typeof this.orderingOptions)[number], string> = {
    rating: 'Rating',
    maxRating: 'MaxRating',
    contestantsCount: 'Contests.Contests',
  };

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  get contestsRatingList() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<ContestsRating>> | null {
    return this.service.getContestsRating(this.pageable);
  }

  isOrderingActive(orderingKey: string) {
    return this.ordering === orderingKey || this.ordering === `-${orderingKey}`;
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Contests.ContestsRating',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: '..'
          },
          {
            name: 'Rating',
            isLink: false,
          }
        ]
      }
    };
  }

}
