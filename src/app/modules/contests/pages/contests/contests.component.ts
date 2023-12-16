import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { Contest } from '@contests/contests.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestCardComponent } from '@contests/components/contest-card/contest-card/contest-card.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ContestsSectionCategoriesComponent } from './sections/contests-section-categories/contests-section-categories.component';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { PageResult } from '@shared/components/classes/page-result';
import { ContestsService } from '@contests/contests.service';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1000 }),
    fadeInRightOnEnterAnimation({ duration: 1000 }),
    fadeInRightOnEnterAnimation({ anchor: 'contests', duration: 1000 }),
    fadeInUpOnEnterAnimation({ delay: 0, duration: 1000 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ContestCardComponent,
    KepPaginationComponent,
    NgSelectModule,
    ContestsSectionCategoriesComponent,
    KepIconComponent,
  ]
})
export class ContestsComponent extends BaseTablePageComponent<Contest> implements OnInit, OnDestroy {
  override maxSize = 5;
  override defaultPageSize = 7;
  override pageOptions = [7, 10, 20];

  public contestTypes = [
    'All',
    'ACM20M',
    'ACM2H',
    'Ball525',
    'Ball550',
    'LessLine',
    'LessCode',
    'OneAttempt',
    'IQ',
    'Exam',
    'MultiL',
    'CodeGolf',
  ];
  contestType = 0;
  contestStatus = 2;
  contestCategory = 0;

  constructor(public service: ContestsService) {
    super();
  }

  get contests() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<Contest>> | null {
    return this.service.getContests({
      page: this.pageNumber,
      pageSize: this.pageSize,
      category: this.contestCategory || null,
      isParticipated: this.contestStatus !== 2 ? +!!this.contestStatus : null,
      type: this.contestType ? this.contestTypes[this.contestType] : null,
    });
  }

  contestCategoryClick(category: number) {
    this.pageNumber = 1;
    this.contestCategory = category;
    this.reloadPage();
  }

  contestTypeClick(index: number) {
    this.pageNumber = 1;
    this.contestType = index;
    this.reloadPage();
  }

  contestStatusClick(status: number) {
    this.pageNumber = 1;
    this.contestStatus = status;
    this.reloadPage();
  }
}
