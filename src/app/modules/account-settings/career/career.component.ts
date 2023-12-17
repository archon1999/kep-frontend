import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { UserEducation, UserWorkExperience } from '../../users/users.models';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';
import { repeaterAnimation } from '../skills/repeater-animation';

@Component({
  selector: 'career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
  animations: [repeaterAnimation]
})
export class CareerComponent implements OnInit {

  public userEducations: Array<UserEducation>;
  public userWorkExperiences: Array<UserWorkExperience>;

  public errors: any;

  public currentUser: User = this.authService.currentUserValue;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ userEducations, userWorkExperiences }) => {
      this.userEducations = userEducations;
      this.userWorkExperiences = userWorkExperiences;
    })
  }

  addEducation() {
    this.userEducations.push({
      organization: '',
      degree: '',
      fromYear: null,
      toYear: null,
    });
  }

  deleteEducation(index: number){
    this.userEducations.splice(index, 1);
  }

  addWorkExperience() {
    this.userWorkExperiences.push({
      company: '',
      jobTitle: '',
      fromYear: null,
      toYear: null,
    });
  }

  deleteWorkExperience(index: number){
    this.userWorkExperiences.splice(index, 1);
  }

  save(){
    this.service.updateUserEducations(this.userEducations).subscribe(
      () => {
        this.toastr.success('Saved');
      }, (err: any) => {
        this.toastr.error('Error');
        this.errors = err.error;
      }
    )

    this.service.updateUserWorkExperiences(this.userWorkExperiences).subscribe(
      () => {
        this.toastr.success('Saved');
      }, (err: any) => {
        this.toastr.error('Error');
        this.errors = err.error;
      }
    )
  }

  reset(){
    this.service.getUserEducations().subscribe(
      (userEducations: any) => {
        this.userEducations = userEducations;
      }
    )

    this.service.getUserWorkExperiences().subscribe(
      (userWorkExperiences: any) => {
        this.userWorkExperiences = userWorkExperiences;
      }
    )
  }

}
