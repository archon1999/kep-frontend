import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbCollapseModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { KepBadgeComponent } from '@shared/components/kep-badge/kep-badge.component';
import { UserOnlineStatusComponent } from '@shared/components/user-online-status/user-online-status.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { UserSkillsComponent } from "@users/ui/pages/user-profile/user-skills/user-skills.component";
import { UserInfoComponent } from "@users/ui/pages/user-profile/user-info/user-info.component";
import { UserActivityHistoryComponent } from "@users/ui/pages/user-profile/user-activity-history/user-activity-history.component";
import { User } from "@users/domain";


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
    UserInfoComponent,
    UserSkillsComponent,
    UserActivityHistoryComponent,
    KepBadgeComponent,
    UserOnlineStatusComponent,
    SpinnerComponent,
    KepCardComponent,
    ResourceByUsernamePipe,
  ]
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  public user: User;
  public toggleMenu = true;

  ngOnInit(): void {
    this.route.data.subscribe(({user}) => {
      this.user = user;
      this.titleService.updateTitle(this.route, {username: user.username});
    });
  }
}
