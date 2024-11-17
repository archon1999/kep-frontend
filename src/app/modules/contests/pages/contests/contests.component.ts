import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestCardComponent } from '@contests/components/contest-card/contest-card/contest-card.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { PageResult } from '@app/common/classes/page-result';
import { ContestsService } from '@contests/contests.service';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { contestTypes } from '@contests/constants/contest-types';
import { Contest } from '@contests/models/contest';
import { SectionCategoriesComponent } from '@contests/pages/contests/sections/section-categories/section-categories.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { coreConfig } from '@app/app.config';
import { SectionHeaderComponent } from '@contests/pages/contests/sections/section-header/section-header.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';

enum ContestStatus {
  ALL = 2,
  PARTICIPATED = 1,
  NOT_PARTICIPATED = 0,
}

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation(),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ContestCardComponent,
    KepPaginationComponent,
    NgSelectModule,
    SectionCategoriesComponent,
    KepIconComponent,
    ContentHeaderModule,
    SectionHeaderComponent,
    EmptyResultComponent,
  ]
})
export class ContestsComponent extends BaseTablePageComponent<Contest> implements OnInit, OnDestroy {
  override maxSize = 5;
  override defaultPageSize = 7;
  override pageOptions = [7, 10, 20];

  public contestTypes = [this.translateService.instant('All')].concat(contestTypes);

  public contestType: number;
  public contestStatus = ContestStatus.ALL;
  public contestCategory: number;

  public searchControl = new FormControl();

  protected readonly ContestStatus = ContestStatus;

  constructor(public service: ContestsService) {
    super();
  }

  get contests() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
    this.searchControl.valueChanges.pipe(
      takeUntil(this._unsubscribeAll),
      debounceTime(1000),
    ).subscribe(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<Contest>> | null {
    return this.service.getContests({
      page: this.pageNumber,
      pageSize: this.pageSize,
      category: this.contestCategory || null,
      isParticipated: this.contestStatus !== ContestStatus.ALL ? +!!this.contestStatus : null,
      type: this.contestType ? this.contestTypes[this.contestType] : null,
      title: this.searchControl.value,
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

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Contests',
      breadcrumb: {
        links: [
          {
            name: coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
