import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ApiService } from '@shared/services/api.service';
import { User } from '@users/users.models';

@Component({
  selector: 'user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
  animations: [fadeInOnEnterAnimation({duration: 1000})],
  encapsulation: ViewEncapsulation.None
})
export class UserPopoverComponent implements OnInit {

  @Input() username: string;
  @Input() streak = 0;
  @Input() textColor = 'dark';
  @Input() placement = 'auto';
  @Input() customClass = 'darken-5';
  @Input() customContent = false;

  public user: User;
  public userRatings: any;

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  loadUser() {
    if (!this.user) {
      this.api.get(`users/${this.username}`).subscribe((user: any) => {
        this.user = user;
      });
      this.api.get(`users/${this.username}/ratings`).subscribe((userRatings: any) => {
        this.userRatings = userRatings;
      });
    }
  }

}
