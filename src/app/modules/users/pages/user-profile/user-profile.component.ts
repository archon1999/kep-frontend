import { Component, OnInit } from '@angular/core';
import { User, UserEducation, UserInfo, UserSkills, UserSocial, UserTechnology, UserWorkExperience } from '../../users.models';
import { BaseComponent } from '@shared/components/classes/base.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent extends BaseComponent implements OnInit {

  public user: User;
  public userInfo: UserInfo;
  public userSocial: UserSocial;
  public userSkills: UserSkills;
  public userTechnologies: Array<UserTechnology>;
  public userEducations: Array<UserEducation>;
  public userWorkExperiences: Array<UserWorkExperience>;

  public activeId = 1;

  public toggleMenu = true;

  ngOnInit(): void {
    this.route.data.subscribe(({ user, userInfo, userSocial, userSkills, userTechnologies, userEducations, userWorkExperiences }) => {
      this.user = user;
      this.titleService.updateTitle(this.route, { username: user.username });
      this.userSocial = userSocial;
      this.userInfo = userInfo;
      this.userTechnologies = userTechnologies;
      this.userEducations = userEducations;
      this.userSkills = userSkills;
      this.userWorkExperiences = userWorkExperiences;
    });

  }
}
