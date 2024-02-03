import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@auth';
import { UserGeneralInfo } from '@users/users.models';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';

@Component({
  selector: 'general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  public generalInfo: UserGeneralInfo;
  public generalSettings: UserGeneralInfo;

  public currentUser: User = this.authService.currentUserValue;

  public canChangeCoverPhoto = false;

  public errors: any;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ generalInfo }) => {
      this.generalInfo = generalInfo;
      this.generalSettings = {
        username: generalInfo.username,
        firstName: generalInfo.firstName,
        lastName: generalInfo.lastName,
        email: generalInfo.email,
      };
    });
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.generalInfo.avatar = event.target.result;
        this.generalSettings.avatar = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadCover(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.generalInfo.coverPhoto = event.target.result;
        this.generalSettings.coverPhoto = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  save() {
    this.service.updateUserGeneralInfo(this.generalSettings).subscribe(() => {
      this.toastr.success('Saved', '', {
        toastClass: 'toast ngx-toastr',
      });
      this.errors = null;
      this.authService.getMe().subscribe();
    }, (err: any) => {
      this.errors = err.error;
      this.toastr.error('Error', '', {
        toastClass: 'toast ngx-toastr',
      });
    });
  }

  reset() {
    this.service.getUserGeneralInfo().subscribe((generalInfo: any) => {
      this.generalInfo = generalInfo;
    });
  }

}
