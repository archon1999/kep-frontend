import { Component, OnInit } from '@angular/core';
import { CurrentProblemsRating, ProblemsRating } from '../../models/rating.models';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { PageResult } from '@shared/page-result';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { KepPaginationComponent } from '@shared/components/pagination/kep-pagination.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestantViewModule,
    KepPaginationComponent,
  ],
})
export class RatingComponent implements OnInit {
  public difficulties = ['beginner', 'basic', 'normal', 'medium', 'advanced', 'hard', 'extremal'];

  public contentHeader: ContentHeader = {
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

  public currentPage = 1;
  public total = 0;

  public problemsRatingList: Array<ProblemsRating> = [];
  public ordering = '-solved';

  public ratingToday: Array<CurrentProblemsRating> = [];
  public ratingWeek: Array<CurrentProblemsRating> = [];
  public ratingMonth: Array<CurrentProblemsRating> = [];

  public currentUser: User;

  constructor(
    public api: ApiService,
    public authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.reloadPage();
    });
  }

  reloadPage() {
    this.api.get('problems-rating/today/').subscribe(
      (result: Array<CurrentProblemsRating>) => {
        this.ratingToday = result;
      }
    );

    this.api.get('problems-rating/week/').subscribe(
      (result: Array<CurrentProblemsRating>) => {
        this.ratingWeek = result;
      }
    );

    this.api.get('problems-rating/month/').subscribe((result: Array<CurrentProblemsRating>) => {
        this.ratingMonth = result;
      }
    );

    const params = { page: this.currentPage, ordering: this.ordering };
    this.api.get('problems-rating', params).subscribe(
      (result: PageResult<ProblemsRating>) => {
        this.problemsRatingList = result.data;
        this.total = result.total;
      }
    );
  }

}
