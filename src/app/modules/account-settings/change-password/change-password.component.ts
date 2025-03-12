import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false,
})
export class ChangePasswordComponent implements OnInit {

  passwordOldType = false;
  passwordOld = '';

  passwordNewType = false;
  passwordNew = '';

  passwordConfirmType = false;
  passwordConfirm = '';

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
  }

  change() {
    if (this.passwordNew != this.passwordConfirm) {
      this.toastr.error('Yangi parolni tasdiqlash noto`g`ri', '');
    } else {
      this.service.changePassword(this.passwordOld, this.passwordNew).subscribe((result: any) => {
        this.toastr.success('Saqlandi', '');
      }, (err: any) => {
        this.toastr.error('Parol noto`g`ri', '');
      });
    }
  }

}
