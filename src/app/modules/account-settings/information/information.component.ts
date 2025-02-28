import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@auth';
import { UserInfo } from '@users/users.models';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformationComponent implements OnInit {
  public userInfo: UserInfo;

  public errors: any;

  public birthDate: Date;
  public birthDateOptions = {
    altInput: true,
    altFormat: 'Y-m-d',
    dateFormat: 'Y-m-d',
    enableTime: false,
  };

  public currentUser: User = this.authService.currentUserValue;

  public countries = [];

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
    public countriesService: NgxCountriesService,
  ) {
  }

  ngOnInit(): void {
    const countries = this.countriesService.getNames();
    for (const country of Object.keys(countries)) {
      this.countries.push({
        id: country,
        name: countries[country],
      });
    }
    this.countries = this.countries.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name === b.name) {
        return 0;
      } else {
        return 1;
      }
    });

    this.route.data.subscribe(({userInfo}) => {
      this.userInfo = userInfo;
      this.birthDate = new Date(userInfo.dateOfBirth);
    });
  }

  onDateChange(event) {
    const date = event;
    this.userInfo.dateOfBirth = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  save() {
    this.service.updateUserInfo(this.userInfo).subscribe(
      () => {
        this.toastr.success('Saved', '');
      }, (err: any) => {
        this.toastr.error('Error', '');
        this.errors = err.error;
      }
    );
  }

  reset() {
    this.service.getUserInfo().subscribe(
      (userInfo: any) => {
        this.userInfo = userInfo;
      }
    );
  }

}
