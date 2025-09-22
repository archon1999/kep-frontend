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
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

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
    KepCardComponent,
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
