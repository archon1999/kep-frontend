import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ContestsService } from '@contests/contests.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public api: ApiService,
    public contestsService: ContestsService,
  ) {
  }

  getNews(page: number, pageSize: number) {
    const params = { page: page, page_size: pageSize };
    return this.api.get('news', params);
  }

  getLastPosts(page: number, pageSize: number) {
    const params = { page: page, page_size: pageSize, 'not_news': 1 };
    return this.api.get('blog', params);
  }

  getTopUsers() {
    return this.api.get('users/top-rating');
  }

  getStatistics() {
    return this.api.get('landing-page-statistics');
  }

  getUserDailyStatistics(username: string, fromNow: number = 0) {
    return this.api.get(`users/${username}/daily-statistics`, { fromNow });
  }

  getNextBirthdays() {
    return this.api.get('users/next-birthdays');
  }

  getCalendarEvents() {
    return this.api.get('calendar-events');
  }

}
