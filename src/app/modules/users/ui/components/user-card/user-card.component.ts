import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../users.models';
import { UsersApiService } from '../../users-api.service';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: false,
})
export class UserCardComponent implements OnInit {

  @Input() username: string;

  public user: User;
  public userRatings: any;

  constructor(
    public service: UsersApiService,
  ) { }

  ngOnInit(): void {
    this.service.getUser(this.username).subscribe(
      (user: any) => {
        this.user = user;
      }
    )

    this.service.getUserRatings(this.username).subscribe(
      (userRatings: any) => {
        this.userRatings = userRatings;
      }
    )
  }

}
