import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { User } from '@auth';

@Component({
  selector: 'user-avatar-popover',
  templateUrl: './user-avatar-popover.component.html',
  styleUrls: ['./user-avatar-popover.component.scss']
})
export class UserAvatarPopoverComponent implements OnInit {

  @Input() username: string;
  @Input() avatar: string;

  user: User;
  userRatings: any;

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  loadUser() {
    if (!this.user) {
      this.api.get(`users/${this.username}`).subscribe((user: any) => {
        this.user = user;
      })
      this.api.get(`users/${this.username}/ratings`).subscribe((userRatings: any) => {
        this.userRatings = userRatings;
      })
    }
  }

}
