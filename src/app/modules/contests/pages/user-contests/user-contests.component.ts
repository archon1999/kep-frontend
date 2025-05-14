import { Component, OnInit } from '@angular/core';

import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { Observable } from 'rxjs';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { PageResult } from '@app/common/classes/page-result';
import { ContestsService } from '@contests/contests.service';
import { User } from '@auth';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepcoinSpendSwalModule } from '@app/modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { ContestsTableModule } from '@contests/components/contests-table/contests-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'app-user-contests',
  templateUrl: './user-contests.component.html',
  styleUrls: ['./user-contests.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepcoinSpendSwalModule,
    EmptyResultComponent,
    ContestsTableModule,
    KepPaginationComponent,
  ]
})
export class UserContestsComponent extends BaseTablePageComponent<Contest> implements OnInit {
  override maxSize = 5;
  override defaultPageSize = 10;

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  get contests() {
    return this.pageResult?.data || [];
  }

  ngOnInit(): void {
    this.loadContentHeader();
  }

  afterChangeCurrentUser(currentUser: User) {
    this.reloadPage();
  }

  getPage(): Observable<PageResult<Contest>> | null {
    return this.service.getUserContests({
      page: this.pageNumber,
      pageSize: this.pageSize,
      creator: this.currentUser.username
    });
  }

  success() {
    this.router.navigateByUrl('/competitions/contests/user-contests/create');
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MyContests',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '..'
          },
        ]
      }
    };
  }
}
