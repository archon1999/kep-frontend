import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@auth';
import { UserSkills, UserTechnology } from '@users/users.models';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';
import { repeaterAnimation } from './repeater-animation';
import { devIcons } from './dev-icons';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  animations: [repeaterAnimation],
  standalone: false,
})
export class SkillsComponent implements OnInit {
  public userSkills: UserSkills;
  public userTechnologies: Array<UserTechnology>;

  public currentUser: User = this.authService.currentUserValue;

  public devIcons = devIcons;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({userSkills, userTechnologies}) => {
      this.userSkills = userSkills;
      this.userTechnologies = userTechnologies;
    });

  }

  addTechnology() {
    this.userTechnologies.push({
      text: '',
      devIconClass: '',
      badgeColor: '',
    });
  }

  deleteTechnology(index: number) {
    this.userTechnologies.splice(index, 1);
  }

  save() {
    this.service.updateUserSkills(this.userSkills).subscribe(
      () => {
        this.toastr.success('Saved', '');
      }, (err: any) => {
        this.toastr.error('Error', '', {

        });
      }
    );

    this.service.updateUserTechnologies(this.userTechnologies).subscribe(
      () => {
        this.toastr.success('Saved', '', {

        });
      }, (err: any) => {
        this.toastr.error('Error', '', {

        });
      }
    );
  }

  reset() {
    this.service.getUserSkills().subscribe(
      (userSkills: any) => {
        this.userSkills = userSkills;
      }
    );

    this.service.getUserTechnologies().subscribe(
      (userTechnologies: any) => {
        this.userTechnologies = userTechnologies;
      }
    );
  }
}
