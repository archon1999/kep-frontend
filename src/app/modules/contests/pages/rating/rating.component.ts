import { Component, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { ContestsRating } from '../../contests.models';
import { ContestsService } from '../../contests.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  public contentHeader: ContentHeader = {
    headerTitle: 'CONTESTS.CONTESTS_RATING',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CONTESTS.CONTESTS',
          isLink: true,
          link: '.'
        },
        {
          name: 'RATING',
          isLink: false,
        }
      ]
    }
  };

  public currentPage = 1;
  public totalUsersCount = 0;
  public contestsRating: Array<ContestsRating> = [];

  public currentUser: User;

  constructor(
    public service: ContestsService,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.reloadPage();
    })
  }

  reloadPage(){
    this.service.getContestsRating(this.currentPage, 10).subscribe((result: any) => {
      this.contestsRating = result.data.map((data: any) => ContestsRating.fromJSON(data));
      this.totalUsersCount = result.total;
    })
  }
}
