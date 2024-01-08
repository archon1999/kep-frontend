import { Component, OnInit } from '@angular/core';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Observable } from 'rxjs';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Contest } from '@contests/contests.models';
import { PageResult } from '@shared/components/classes/page-result';
import { ContestsService } from '@contests/contests.service';
import { User } from '@auth/models';

@Component({
  selector: 'app-user-contests',
  templateUrl: './user-contests.component.html',
  styleUrls: ['./user-contests.component.scss']
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
