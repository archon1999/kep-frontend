import { Component, OnInit } from '@angular/core';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { ContestsService } from '../../contests.service';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestsRating } from '@contests/models/contests-rating';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepTableComponent,
    ContestantViewModule,
    KepPaginationComponent,
    NgbTooltip,
  ]
})
export class RatingComponent extends BaseTablePageComponent<ContestsRating> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 20;
  override pageOptions = [10, 20, 50];

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  get contestsRatingList() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<ContestsRating>> | null {
    return this.service.getContestsRating({
      page: this.pageNumber,
      pageSize: this.pageSize,
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'CONTESTS.CONTESTS_RATING',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '..'
          },
          {
            name: 'RATING',
            isLink: false,
          }
        ]
      }
    };
  }

}
