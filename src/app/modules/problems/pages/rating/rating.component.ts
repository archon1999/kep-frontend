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
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { PeriodRatingsComponent } from '@problems/pages/rating/period-ratings/period-ratings.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ProblemDifficultyColorPipe } from "@problems/pipes/problem-difficulty-color.pipe";


@Component({
  selector: 'page-rating',
  templateUrl: './rating.component.html',
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestantViewModule,
    KepPaginationComponent,
    TableOrderingModule,
    PeriodRatingsComponent,
    KepCardComponent,
    SpinnerComponent,
    NgbTooltip,
    ProblemDifficultyColorPipe,
  ],
})
export class RatingComponent extends BaseTablePageComponent<ProblemsRating> implements OnInit {
  override defaultPageSize = 12;
  override pageOptions = [6, 9, 12, 24];
  override defaultOrdering = '-rating';
  override maxSize = 5;

  protected readonly difficultyLabels = difficultyLabels;

  constructor(public service: ProblemsApiService) {
    super();
  }

  get problemsRatingList() {
    return this.pageResult?.data;
  }

  isOrderingActive(orderingKey: string) {
    return this.ordering === orderingKey || this.ordering === `-${orderingKey}`;
  }

  getDifficultyBadgeClass(difficulty: string) {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success-transparent text-success';
      case 'basic':
        return 'bg-info-transparent text-info';
      case 'normal':
        return 'bg-blue-transparent text-blue';
      case 'medium':
        return 'bg-primary-transparent text-primary';
      case 'advanced':
        return 'bg-warning-transparent text-warning';
      case 'hard':
        return 'bg-danger-transparent text-danger';
      case 'extremal':
        return 'bg-dark-transparent text-dark';
      default:
        return 'bg-light-secondary text-body';
    }
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
