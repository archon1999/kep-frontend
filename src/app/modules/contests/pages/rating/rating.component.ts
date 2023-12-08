import { Component, OnInit } from '@angular/core';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { ContestsRating } from '../../contests.models';
import { ContestsService } from '../../contests.service';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@shared/components/classes/page-result';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent extends BaseTablePageComponent<ContestsRating> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 20;

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
    return this.service.getContestsRating(this.pageNumber, this.pageSize);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'CONTESTS.CONTESTS_RATING',
      actionButton: true,
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
