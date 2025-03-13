import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService, User } from '@auth';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { ɵEmptyOutletComponent } from '@angular/router';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";


enum RatingType {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
}

class RatingHistory {
  constructor(
    public username: string,
    public type: number,
    public contestsRatingTitle: string,
    public result: number,
    public date: Date,
  ) {}
}

@Component({
  selector: 'app-rating-history',
  templateUrl: './rating-history.component.html',
  styleUrls: ['./rating-history.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ɵEmptyOutletComponent,
    UserPopoverModule,
    KepPaginationComponent,
    KepCardComponent,
  ]
})
export class RatingHistoryComponent implements OnInit {

  contentHeader = {
    headerTitle: 'PROBLEMS_RATING_HISTORY',
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Practice',
          isLink: false,
        },
        {
          name: 'Problems',
          isLink: true,
          link: '../..'
        },
        {
          name: 'RATING',
          isLink: true,
          link: '..'
        }
      ]
    }
  };

  dailyBestResult: RatingHistory;
  weeklyBestResult: RatingHistory;
  monthlyBestResult: RatingHistory;

  dailyRatingHistory: Array<RatingHistory> = [];
  weeklyRatingHistory: Array<RatingHistory> = [];
  monthlyRatingHistory: Array<RatingHistory> = [];

  dailyRatingHistoryPage = 1;
  weeklyRatingHistoryPage = 1;
  monthlyRatingHistoryPage = 1;

  dailyRatingHistoryTotal = 0;
  weeklyRatingHistoryTotal = 0;
  monthlyRatingHistoryTotal = 0;

  currentUser: User;

  constructor(
    public api: ApiService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.reloadPage();
  }

  reloadPage() {
    this.api.get('problems-rating-history', {
      'type': RatingType.DAILY,
      'page_size': 1,
      'ordering': '-result',
    }).subscribe((result: any) => {
      this.dailyBestResult = result.data[0];
    });

    this.api.get('problems-rating-history', {
      'type': RatingType.WEEKLY,
      'page_size': 1,
      'ordering': '-result',
    }).subscribe((result: any) => {
      this.weeklyBestResult = result.data[0];
    });

    this.api.get('problems-rating-history', {
      'type': RatingType.MONTHLY,
      'page_size': 1,
      'ordering': '-result',
    }).subscribe((result: any) => {
      this.monthlyBestResult = result.data[0];
    });

    this.reloadDailyHistoryPage();
    this.reloadWeeklyHistoryPage();
    this.reloadMonthlyHistoryPage();
  }

  reloadDailyHistoryPage() {
    const params = {'type': RatingType.DAILY, 'page': this.dailyRatingHistoryPage, page_size: 10};
    this.api.get('problems-rating-history', params).subscribe((result: any) => {
      this.dailyRatingHistory = result.data;
      this.dailyRatingHistoryTotal = result.total;
    });
  }

  reloadWeeklyHistoryPage() {
    const params = {'type': RatingType.WEEKLY, 'page': this.weeklyRatingHistoryPage, page_size: 10};
    this.api.get('problems-rating-history', params).subscribe((result: any) => {
      this.weeklyRatingHistory = result.data;
      this.weeklyRatingHistoryTotal = result.total;
    });
  }

  reloadMonthlyHistoryPage() {
    const params = {'type': RatingType.MONTHLY, 'page': this.monthlyRatingHistoryPage, page_size: 10};
    this.api.get('problems-rating-history', params).subscribe((result: any) => {
      this.monthlyRatingHistory = result.data;
      this.monthlyRatingHistoryTotal = result.total;
    });
  }

}
