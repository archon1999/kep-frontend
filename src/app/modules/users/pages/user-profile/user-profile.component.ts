import { Component, OnInit } from '@angular/core';
import { User } from '../../users.models';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbCollapseModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { UserBlogComponent } from '@users/pages/user-profile/user-blog/user-blog.component';
import { UserRatingsComponent } from '@users/pages/user-profile/user-ratings/user-ratings.component';
import { UserAchievementsComponent } from '@users/pages/user-profile/user-achievements/user-achievements.component';
import { UserInfoComponent } from '@users/pages/user-profile/user-info/user-info.component';
import { UserSkillsComponent } from '@users/pages/user-profile/user-skills/user-skills.component';
import { KepBadgeComponent } from '@shared/components/kep-badge/kep-badge.component';
import { UserOnlineStatusComponent } from '@shared/components/user-online-status/user-online-status.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

enum Tab {
  Ratings = 1,
  Blog,
  Achievements,
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    NgxCountriesModule,
    UserBlogComponent,
    UserRatingsComponent,
    NgbProgressbarModule,
    UserAchievementsComponent,
    NgbCollapseModule,
    UserInfoComponent,
    UserSkillsComponent,
    KepBadgeComponent,
    UserOnlineStatusComponent,
    SpinnerComponent,
  ]
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  public user: User;
  public activeTab = Tab.Ratings;
  public toggleMenu = true;

  public readonly Tab = Tab;

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
      this.titleService.updateTitle(this.route, { username: user.username });
    });
  }

  changeTab(tab: Tab) {
    this.activeTab = tab;
  }
}
