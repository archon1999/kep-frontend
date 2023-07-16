import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { UserInfo } from 'app/main/users/users.models';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';
import { countries } from './countries';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  public userInfo: UserInfo;

  public errors: any;

  public birthDate: Date;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'Y-m-d',
    dateFormat: 'Y-m-d',
    enableTime: false,
  };

  public currentUser: User = this.authService.currentUserValue;

  public countries = countries;

  constructor(
    public authService: AuthenticationService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ userInfo }) => {
      this.userInfo = userInfo;
      this.birthDate = new Date(userInfo.dateOfBirth);
    })
  }

  onDateChange(){
    let date = this.birthDate[0];
    this.userInfo.dateOfBirth = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  save(){
    this.service.updateUserInfo(this.userInfo).subscribe(
      () => {
        this.toastr.success('Saved');
      }, (err: any) => {
        this.toastr.error('Error');
        this.errors = err.error;
      }
    )
  }

  reset(){
    this.service.getUserInfo().subscribe(
      (userInfo: any) => {
        this.userInfo = userInfo;
      }
    )
  }

}
