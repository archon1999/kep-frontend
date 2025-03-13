import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserAchievementsComponent } from '@users/pages/user-profile/user-achievements/user-achievements.component';
import { UserBlogComponent } from '@users/pages/user-profile/user-blog/user-blog.component';
import { UserRatingsComponent } from '@users/pages/user-profile/user-ratings/user-ratings.component';
import { UserEducation, UserInfo, UserSocial, UserWorkExperience } from '@users/users.models';
import { ActivatedRoute } from '@angular/router';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { CoreDirectivesModule } from '@shared/directives/directives.module';

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [
    CommonModule,
    NgbProgressbarModule,
    NgxCountriesModule,
    TranslateModule,
    UserAchievementsComponent,
    UserBlogComponent,
    UserRatingsComponent,
    KepCardComponent,
    CoreDirectivesModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit {
  public userInfo: UserInfo;
  public userSocial: UserSocial;
  public userEducations: Array<UserEducation>;
  public userWorkExperiences: Array<UserWorkExperience>;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({userInfo, userSocial, userEducations, userWorkExperiences}) => {
      this.userSocial = userSocial;
      this.userInfo = userInfo;
      this.userEducations = userEducations;
      this.userWorkExperiences = userWorkExperiences;
    });
  }
}
