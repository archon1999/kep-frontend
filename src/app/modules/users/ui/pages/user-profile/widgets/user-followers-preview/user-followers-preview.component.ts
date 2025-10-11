import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLoadComponent } from '@core/common';
import { PageResult } from '@core/common/classes/page-result';
import { UsersApiService } from '@users/data-access';
import { User } from '@users/domain';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { RouterLink } from '@angular/router';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Resources } from '@app/resources';
import { UserPopoverModule } from "@shared/components/user-popover/user-popover.module";

@Component({
  selector: 'user-followers-preview',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    KepCardComponent,
    EmptyResultComponent,
    RouterLink,
    ResourceByUsernamePipe,
    TranslateModule,
    UserPopoverModule,
  ],
  templateUrl: './user-followers-preview.component.html',
})
export class UserFollowersPreviewComponent extends BaseLoadComponent<PageResult<User>> {
  public readonly Resources = Resources;
  public followers: User[] = [];
  public total = 0;
  public username: string | null = null;

  private readonly usersApi = inject(UsersApiService);

  override ngOnInit(): void {
    this.username = this.getUsernameFromRoute();
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
        const usernameChanged = username !== this.username;
        this.username = username;

        if (usernameChanged) {
          this.followers = [];
          this.total = 0;
          this.loadData();
        }
      });
  }

  getData(): Observable<PageResult<User>> {
    const username = this.username ?? this.getUsernameFromRoute();

    return this.usersApi.getUserFollowers(username!, {
      page: 1,
      pageSize: 5,
    });
  }

  override afterLoadData(result: PageResult<User>): void {
    this.followers = (result.data ?? []).slice(0, 5);
    this.total = result.total ?? result.count ?? this.followers.length;
  }

  get canViewAll(): boolean {
    return this.total > this.followers.length;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
