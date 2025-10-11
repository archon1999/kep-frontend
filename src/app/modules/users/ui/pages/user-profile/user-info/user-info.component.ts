import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserEducation, UserInfo, UserSocial, UserWorkExperience } from '@users/domain';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { BaseLoadComponent } from "@core/common";
import { Observable, forkJoin } from "rxjs";
import { UsersApiService } from "@app/modules/users";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [
    CommonModule,
    NgbProgressbarModule,
    NgxCountriesModule,
    TranslateModule,
    KepCardComponent,
    CoreDirectivesModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent extends BaseLoadComponent<{userInfo: UserInfo; userSocial: UserSocial; userEducations: Array<UserEducation>; userWorkExperiences: Array<UserWorkExperience>;}> {
  public userInfo: UserInfo | null = null;
  public userSocial: UserSocial | null = null;
  public userEducations: Array<UserEducation> = [];
  public userWorkExperiences: Array<UserWorkExperience> = [];
  override loadOnInit = false;

  private readonly usersService = inject(UsersApiService);
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
        const username = params?.['username'] ?? this.getUsernameFromRoute();

        if (!username || username === this.currentUsername) {
          return;
        }

        this.currentUsername = username;
        this.userInfo = null;
        this.userSocial = null;
        this.userEducations = [];
        this.userWorkExperiences = [];
        this.loadData();
      });
  }

  getData(): Observable<{userInfo: UserInfo; userSocial: UserSocial; userEducations: Array<UserEducation>; userWorkExperiences: Array<UserWorkExperience>;}> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return forkJoin({
      userInfo: this.usersService.getUserInfo(username!),
      userSocial: this.usersService.getUserSocial(username!),
      userEducations: this.usersService.getUserEducations(username!),
      userWorkExperiences: this.usersService.getUserWorkExperiences(username!),
    });
  }

  override afterLoadData({userInfo, userSocial, userEducations, userWorkExperiences}: {userInfo: UserInfo; userSocial: UserSocial; userEducations: Array<UserEducation>; userWorkExperiences: Array<UserWorkExperience>;}): void {
    this.userInfo = userInfo;
    this.userSocial = userSocial;
    this.userEducations = userEducations ?? [];
    this.userWorkExperiences = userWorkExperiences ?? [];
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
