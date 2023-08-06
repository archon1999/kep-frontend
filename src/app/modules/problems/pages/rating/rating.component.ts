import { Component, OnInit } from '@angular/core';
import { CurrentProblemsRating, ProblemsRating } from './rating';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  difficulties = ['beginner', 'basic', 'normal', 'medium', 'advanced', 'hard', 'extremal'];

  contentHeader = {
    headerTitle: 'RATING',
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Problems',
          isLink: true,
          link: '/practice/problems'
        }
      ]
    }
  };

  currentPage: number = 1;
  total: number = 0;

  problemsRatingList: Array<ProblemsRating> = [];
  ordering = '-solved';

  ratingToday: Array<CurrentProblemsRating> = [];
  ratingWeek: Array<CurrentProblemsRating> = [];
  ratingMonth: Array<CurrentProblemsRating> = [];

  currentUser: User;

  constructor(
    public api: ApiService,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.reloadPage();
    });
  }

  reloadPage(){
    this.api.get('problems-rating/today/').subscribe((result: any) => {
      this.ratingToday = result;
    })

    this.api.get('problems-rating/week/').subscribe((result: any) => {
      this.ratingWeek = result;
    })

    this.api.get('problems-rating/month/').subscribe((result: any) => {
      this.ratingMonth = result;
    })

    var params = { 'page': this.currentPage, 'ordering': this.ordering };
    this.api.get('problems-rating', params).subscribe((result: any) => {
      this.problemsRatingList = result.data;
      this.total = result.total;
    })
  }

}
