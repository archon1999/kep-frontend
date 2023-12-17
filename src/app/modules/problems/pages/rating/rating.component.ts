import { Component, OnInit } from '@angular/core';
import { CurrentProblemsRating, ProblemsRating } from '@problems/models/rating.models';
import { PageResult } from '@shared/components/classes/page-result';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Resources } from '@app/resources';
import { Observable } from 'rxjs';
import { difficultyLabels } from '@problems/constants/difficulties.enum';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ProblemsApiService } from '@problems/services/problems-api.service';

export interface CurrentRating {
  period: 'today' | 'week' | 'month';
  color: string;
  data: Array<CurrentProblemsRating>;
}

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
    KepTableComponent,
    TableOrderingModule,
    KepIconComponent,
  ],
})
export class RatingComponent extends BaseTablePageComponent<ProblemsRating> implements OnInit {
  override defaultPageSize = 10;
  override defaultOrdering = '-solved';
  override maxSize = 5;

  public currentRatings: CurrentRating[] = [
    {
      period: 'today',
      color: 'success',
      data: [],
    },
    {
      period: 'week',
      color: 'info',
      data: [],
    },
    {
      period: 'month',
      color: 'primary',
      data: [],
    },
  ];

  protected readonly difficultyLabels = difficultyLabels;

  constructor(public service: ProblemsApiService) {
    super();
  }

  get problemsRatingList() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
    this.currentRatings.forEach(
      (rating) => {
        this.service.getCurrentProblemsRating(rating.period).subscribe(
          (result: Array<CurrentProblemsRating>) => {
            rating.data = result;
          }
        );
      }
    );
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
      headerTitle: 'RATING',
      breadcrumb: {
        links: [
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
