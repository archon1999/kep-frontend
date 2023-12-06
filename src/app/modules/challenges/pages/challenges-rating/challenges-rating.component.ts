import { Component, OnInit } from '@angular/core';
import { ChallengesRating } from '@challenges/models/challenges.models';
import { ChallengesService } from '@challenges/services';
import { PageResult } from '@shared/components/classes/page-result';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { CoreCommonModule } from '@core/common.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';

@Component({
  selector: 'app-challenges-rating',
  templateUrl: './challenges-rating.component.html',
  styleUrls: ['./challenges-rating.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewModule,
    KepPaginationComponent,
    ContentHeaderModule,
    SpinnerComponent,
    KepTableComponent,
    TableOrderingModule,
  ]
})
export class ChallengesRatingComponent extends BaseTablePageComponent<ChallengesRating> implements OnInit {
  override defaultPageSize = 20;
  override maxSize = 5;

  override defaultOrdering = '-rating';

  constructor(public service: ChallengesService) {
    super();
  }

  get challengesRatingList() {
    return this.pageResult?.data;
  }

  ngOnInit() {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<ChallengesRating>> {
    return this.service.getChallengesRating(this.pageNumber, this.pageSize, this.ordering);
  }

  protected getContentHeader() {
    return {
      headerTitle: 'Rating',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Challenges',
            isLink: true,
            link: '..'
          },
        ]
      }
    };
  }
}
