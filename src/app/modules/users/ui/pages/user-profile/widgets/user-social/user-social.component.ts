import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService, UserSocial } from '@app/modules/users';
import { Observable } from 'rxjs';
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";

@Component({
  selector: 'user-social',
  standalone: true,
  imports: [
    TranslateModule,
    KepCardComponent,
    KepIconComponent,
  ],
  templateUrl: './user-social.component.html',
  styleUrl: './user-social.component.scss'
})
export class UserSocialComponent extends BaseLoadComponent<UserSocial> {
  @Input() username: string;

  public userSocial: UserSocial;

  private readonly usersService = inject(UsersApiService);

  getData(): Observable<UserSocial> {
    return this.usersService.getUserSocial(this.username);
  }

  afterLoadData(data: UserSocial) {
    this.userSocial = data;
  }
}
