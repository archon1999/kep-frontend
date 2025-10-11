import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService, UserSocial } from '@app/modules/users';
import { forkJoin, Observable } from 'rxjs';
import { User, UserInfo } from '@users/domain';
import { LocalizedDatePipe } from "@shared/pipes/localized-date.pipe";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

type UserPersonalInfo = {
  user: User,
  userInfo: UserInfo,
  userSocial: UserSocial,
}

@Component({
  selector: 'user-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxCountriesModule,
    KepCardComponent,
    LocalizedDatePipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './user-personal-info.component.html',
  styleUrl: './user-personal-info.component.scss'
})
export class UserPersonalInfoComponent extends BaseLoadComponent<UserPersonalInfo> {

  @Input({required: true}) username: string;

  private readonly usersService = inject(UsersApiService);

  getData(): Observable<UserPersonalInfo> {
    return forkJoin({
      userInfo: this.usersService.getUserInfo(this.username),
      userSocial: this.usersService.getUserSocial(this.username),
      user: this.usersService.getUser(this.username),
    });
  }

}
