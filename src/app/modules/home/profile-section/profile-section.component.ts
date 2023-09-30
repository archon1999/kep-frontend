import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { UsersService } from '../../users/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 3000 })]
})
export class ProfileSectionComponent implements OnInit {

  public user: User;
  public userRatings: any;
  public skeletonVisible = true;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: UsersService,
    public authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        if (user) {
          this.service.getUserRatings(user.username).subscribe(
            (userRatings: any) => {
              this.userRatings = userRatings;
              this.skeletonVisible = false;
            }
          );
        }
      }
    );

  }
}
