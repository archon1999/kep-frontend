import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserInfo } from '@users/domain';

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxCountriesModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent extends BaseLoadComponent<UserInfo> {
  public userInfo: UserInfo | null = null;
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
        if (username === this.currentUsername && this.userInfo) {
          return;
        }

        this.currentUsername = username;
        this.userInfo = null;
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<UserInfo> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserInfo(username!);
  }

  override afterLoadData(userInfo: UserInfo): void {
    this.userInfo = userInfo;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
