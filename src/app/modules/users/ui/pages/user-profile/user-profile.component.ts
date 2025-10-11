import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { CoreCommonModule } from '@core/common.module';
import {
  NgbCollapseModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { KepBadgeComponent } from '@shared/components/kep-badge/kep-badge.component';
import { UserOnlineStatusComponent } from '@shared/components/user-online-status/user-online-status.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { User } from '@users/domain';
import { UsersApiService } from '@app/modules/users';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserRanksComponent } from './widgets/user-ranks/user-ranks.component';
import { Resources } from '@app/resources';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    NgxCountriesModule,
    NgbProgressbarModule,
    NgbCollapseModule,
    KepBadgeComponent,
    UserOnlineStatusComponent,
    SpinnerComponent,
    KepCardComponent,
    ResourceByUsernamePipe,
    UserRanksComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ]
})
export class UserProfileComponent extends BaseLoadComponent<User> {
  public user: User | null = null;
  public toggleMenu = true;
  override loadOnInit = false;

  protected readonly Resources = Resources;

  private readonly usersApi = inject(UsersApiService);
  private currentUsername: string | null = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const username = params?.['username'];

        if (!username || username === this.currentUsername) {
          return;
        }

        this.currentUsername = username;
        this.user = null;
        this.loadData();
      });
  }

  getData(): Observable<User> {
    const username = this.currentUsername ?? this.route.snapshot.paramMap.get('username');

    return this.usersApi.getUser(username!);
  }

  override afterLoadData(user: User): void {
    this.user = user;
    this.currentUsername = user.username;
    this.titleService.updateTitle(this.route, {username: user.username});
  }
}
