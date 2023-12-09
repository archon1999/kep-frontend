import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../users.models';
import { UsersService } from '../../users.service';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() username: string;

  public user: User;
  public userRatings: any;

  constructor(
    public service: UsersService,
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
