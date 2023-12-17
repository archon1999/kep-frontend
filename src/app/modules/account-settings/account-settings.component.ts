import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  contentHeader = {
    headerTitle: 'SETTINGS',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: '',
          isLink: false,
        },
      ]
    }
  };

  currentUser: User = this.authService.currentUserValue;

  constructor(
    public authService: AuthService,
    public api: ApiService,
    public router: Router,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      if(!user){
        this.router.navigateByUrl('/');
      }
      this.contentHeader.breadcrumb.links[0].name = user.username;
    })
  }

}
