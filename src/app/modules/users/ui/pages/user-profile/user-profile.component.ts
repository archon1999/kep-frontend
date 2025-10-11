import { Component, HostListener, OnInit } from '@angular/core';
import { BaseComponent } from '@core/common';
import { CoreCommonModule } from '@core/common.module';
import { NgbCollapseModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { KepBadgeComponent } from '@shared/components/kep-badge/kep-badge.component';
import { UserOnlineStatusComponent } from '@shared/components/user-online-status/user-online-status.component';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { User } from '@users/domain';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserRanksComponent } from '@users/ui/components/user-ranks/user-ranks.component';
import { UserFollowersPreviewComponent } from "./widgets/user-followers-preview/user-followers-preview.component";
import { UserFollowButtonComponent } from "@users/ui/components/user-follow-button/user-follow-button.component";
import { UserPersonalInfoComponent } from "./widgets/user-personal-info/user-personal-info.component";
import { UserSocialComponent } from "@users/ui/pages/user-profile/widgets/user-social/user-social.component";

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
    ResourceByUsernamePipe,
    UserRanksComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    UserFollowersPreviewComponent,
    UserFollowButtonComponent,
    UserPersonalInfoComponent,
    UserSocialComponent,
  ]
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  public username: string;
  public user: User;
  public refresh = true;

  public scrollY = 0;

  ngOnInit() {
    this.route.data.subscribe(
      ({user}) => {
        this.user = user;
        this.username = user.username;
        this.titleService.updateTitle(this.route, {username: user.username});
        this.refresh = false;
        this.cdr.detectChanges();
        this.refresh = true;
        this.cdr.detectChanges();
      }
    )
  }

  onTabChange() {
    const scrollY = this.scrollY;
    setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' }), 2);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY = window.scrollY;
  }
}
