import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTablePageComponent } from '@core/common';
import { PageResult } from '@core/common/classes/page-result';
import { UsersApiService } from '@users/data-access';
import { User } from '@users/domain';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { RouterLink } from '@angular/router';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'user-followers',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    KepCardComponent,
    EmptyResultComponent,
    KepPaginationComponent,
    RouterLink,
    ResourceByUsernamePipe,
    TranslateModule,
  ],
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.scss']
})
export class UserFollowersComponent extends BaseTablePageComponent<User> {
  public followers: User[] = [];
  override defaultPageSize = 12;
  override maxSize = 3;

  private readonly usersApi = inject(UsersApiService);
  private currentUsername: string | null = null;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.currentUsername = this.getUsernameFromRoute();
    super.ngOnInit();

    const parentParams$ = this.route.parent?.params ?? of({});

    combineLatest([this.route.params, parentParams$])
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(([params, parentParams]) => params?.['username'] ?? parentParams?.['username'] ?? this.getUsernameFromRoute()),
        filter((username): username is string => !!username),
        distinctUntilChanged(),
      )
      .subscribe(username => {
        const usernameChanged = username !== this.currentUsername;
        this.currentUsername = username;

        if (usernameChanged) {
          this.pageNumber = this.defaultPageNumber;
          this.reloadPage();
        }
      });
  }

  override getPage(): Observable<PageResult<User>> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersApi.getUserFollowers(username!, {
      page: this.pageNumber,
      pageSize: this.pageSize,
    });
  }

  override afterLoadPage(pageResult: PageResult<User>): void {
    pageResult.data = pageResult.data ?? [];
    this.followers = pageResult.data;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
