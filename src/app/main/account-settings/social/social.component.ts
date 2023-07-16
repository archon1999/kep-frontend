import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { UserSocial } from 'app/main/users/users.models';
import { ToastrService } from 'ngx-toastr';
import { AccountSettingsService } from '../account-settings.service';

@Component({
  selector: 'social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  public userSocial: UserSocial;

  public errors: any;

  public currentUser: User = this.authService.currentUserValue;

  constructor(
    public authService: AuthenticationService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public service: AccountSettingsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ userSocial }) => {
      this.userSocial = userSocial;
    })
  }

  save(){
    this.service.updateUserSocial(this.userSocial).subscribe(
      () => {
        this.toastr.success('Saved');
      }, (err: any) => {
        this.errors = err.error;
        this.toastr.error('Error');
      }
    )
  }

  reset(){
    this.service.getUserSocial().subscribe(
      (userSocial: any) => {
        this.userSocial = userSocial;
      }
    )
  }

}
