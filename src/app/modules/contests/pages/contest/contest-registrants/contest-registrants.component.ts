import { Component, OnInit } from '@angular/core';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContestsService } from '@contests/contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestRegistrant } from '@contests/models/contest-registrant';
import { Contest } from '@contests/models/contest';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-contest-registrants',
  templateUrl: './contest-registrants.component.html',
  styleUrl: './contest-registrants.component.scss',
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestantViewModule,
    ContestCardModule,
    KepCardComponent,
    KepPaginationComponent,
    TableOrderingModule,
    SpinnerComponent,
  ]
})
export class ContestRegistrantsComponent extends BaseTablePageComponent<ContestRegistrant> implements OnInit {
  override defaultPageSize = 20;
  override pageOptions = [20, 50, 100];
  override defaultOrdering = '-contests_rating';

  public contest: Contest;
  public readonly ratingOrderingKey = 'contests_rating';

  constructor(public service: ContestsService) {
    super();
  }

  ngOnInit() {
    this.route.data.subscribe(({contest}) => {
      this.contest = contest;
      this.loadContentHeader();
      this.updatePageParams();
      this.reloadPage();
    });
  }

  get registrants(): ContestRegistrant[] {
    return this.pageResult?.data || [];
  }

  isRatingOrderingActive(): boolean {
    return this.ordering === this.ratingOrderingKey || this.ordering === `-${this.ratingOrderingKey}`;
  }

  getPage(): Observable<PageResult<ContestRegistrant>> {
    return this.service.getContestRegistrants(this.contest.id, this.pageable);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Registrants',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest?.id + '',
            isLink: true,
            link: '..'
          },
        ]
      }
    };
  }
}
