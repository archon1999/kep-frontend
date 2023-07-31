import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { TitleService } from 'app/title.service';
import { Subject } from 'rxjs';
import { User, UserEducation, UserInfo, UserSkills, UserSocial, UserTechnology, UserWorkExperience } from '../users.models';
import { User as AuthUser } from '../users.models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public user: User;
  public userInfo: UserInfo;
  public userSocial: UserSocial;
  public userSkills: UserSkills;
  public userTechnologies: Array<UserTechnology>;
  public userEducations: Array<UserEducation>;
  public userWorkExperiences: Array<UserWorkExperience>;

  public activeId = 1;

  public toggleMenu = true;

  public currentUser: AuthUser;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ user, userInfo, userSocial, userSkills, userTechnologies, userEducations, userWorkExperiences }) => {
      this.user = user;
      this.titleService.updateTitle(this.route, { username: user.username } )
      this.userSocial = userSocial;
      this.userInfo = userInfo;
      this.userTechnologies = userTechnologies;
      this.userEducations = userEducations;
      this.userSkills = userSkills;
      this.userWorkExperiences = userWorkExperiences;
    })

    this.authService.currentUser.subscribe(
      (user: any) => { this.currentUser = user; }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();    
    this._unsubscribeAll.complete();    
  }

}
