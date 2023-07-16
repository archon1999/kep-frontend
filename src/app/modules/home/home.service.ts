import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';
import { ContestsService } from '../contests/contests.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public api: ApiService,
    public contestsService: ContestsService,
  ) { }

  getNews(page: number, pageSize: number) {
    var params = { page: page, page_size: pageSize };
    return this.api.get('news', params);
  }

  getLastPosts(page: number, pageSize: number) {
    var params = { page: page, page_size: pageSize, 'not_news': 1 };
    return this.api.get('blog', params);
  }

  getTopUsers(){
    return this.api.get('users/top-rating');
  }

  getOnlineUsers(){
    return this.api.get('users/online');
  }
  
  getUsersChartSeries(){
    return this.api.get('users/chart-statistics');
  }

  getContests(page: number, pageSize: number){
    return this.contestsService.getContests(page, pageSize);
  }

  getStatistics(){
    return this.api.get('landing-page-statistics');
  }

  getUserDailyStatistics(username: string, fromNow: number=0){
    return this.api.get(`users/${username}/daily-statistics`, { from_now: fromNow });
  }

  getNextBirthdays(){
    return this.api.get('users/next-birthdays');
  }

}
