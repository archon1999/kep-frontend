import { Component, OnInit } from '@angular/core';
import { ProblemsRating } from '@problems/models/rating.models';
import { PageResult } from '@core/common/classes/page-result';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { Resources } from '@app/resources';
import { Observable } from 'rxjs';
import { difficultyLabels } from '@problems/constants/difficulties.enum';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { PeriodRatingsComponent } from '@problems/pages/rating/period-ratings/period-ratings.component';


@Component({
  selector: 'page-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestantViewModule,
    KepPaginationComponent,
    KepTableComponent,
    TableOrderingModule,
    KepIconComponent,
    PeriodRatingsComponent,
  ],
})
export class RatingComponent extends BaseTablePageComponent<ProblemsRating> implements OnInit {
  override defaultPageSize = 10;
  override pageOptions = [10, 20, 50];
  override defaultOrdering = '-rating';
  override maxSize = 5;

  protected readonly difficultyLabels = difficultyLabels;

  constructor(public service: ProblemsApiService) {
    super();
  }

  get problemsRatingList() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<ProblemsRating>> {
    return this.api.get('problems-rating', {
      page: this.pageNumber,
      pageSize: this.pageSize,
      ordering: this.ordering,
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Rating',
      breadcrumb: {
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Problems',
            isLink: true,
            link: Resources.Problems
          }
        ]
      }
    };
  }
}
