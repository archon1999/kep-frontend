import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserSocial } from '@users/domain';

@Component({
  selector: 'user-social',
  standalone: true,
  imports: [
    TranslateModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-social.component.html',
  styleUrl: './user-social.component.scss'
})
export class UserSocialComponent extends BaseLoadComponent<UserSocial> {
  public userSocial: UserSocial | null = null;
  override loadOnInit = false;

  private readonly usersService = inject(UsersApiService);
  private currentUsername: string | null = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
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
        if (username === this.currentUsername && this.userSocial) {
          return;
        }

        this.currentUsername = username;
        this.userSocial = null;
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<UserSocial> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserSocial(username!);
  }

  override afterLoadData(userSocial: UserSocial): void {
    this.userSocial = userSocial;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
