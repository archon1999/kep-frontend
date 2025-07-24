import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { Pageable } from '@core/common/classes/pageable';
import { Observable } from "rxjs";
import { PageResult } from "@shared/components/table";
import { User } from "@users/domain";

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  constructor(private api: ApiService) {}

  getUsers(params: Partial<Pageable> & any): Observable<PageResult<User>> {
    return this.api.get('users', params);
  }

  getUser(username: string) {
    return this.api.get(`users/${username}`);
  }

  getUserInfo(username: string) {
    return this.api.get(`users/${username}/info`);
  }

  getUserSkills(username: string) {
    return this.api.get(`users/${username}/skills`);
  }

  getUserSocial(username: string) {
    return this.api.get(`users/${username}/social`);
  }

  getUserTechnologies(username: string) {
    return this.api.get(`users/${username}/technologies`);
  }

  getUserAchievements(username: string) {
    return this.api.get(`users/${username}/achievements`);
  }

  getUserEducations(username: string) {
    return this.api.get(`users/${username}/educations`);
  }

  getUserWorkExperiences(username: string) {
    return this.api.get(`users/${username}/work-experiences`);
  }

  getUserBlog(username: string, params?: Partial<Pageable>) {
    return this.api.get('blog/', {
      author: username,
      ...params
    });
  }

  getUserContestsRating(username: string) {
    return this.api.get(`contests-rating/${username}`);
  }

  getUserProblemsRating(username: string) {
    return this.api.get(`problems-rating/${username}`);
  }

  getUserChallengesRating(username: string) {
    return this.api.get(`challenges-rating/${username}`);
  }

  getUserRatings(username: string) {
    return this.api.get(`users/${username}/ratings`);
  }

  getMostActiveUsers() {
    return this.api.get('users/most-active-users');
  }

  getUsersChartSeries() {
    return this.api.get('users/chart-statistics');
  }

  getOnlineUsers() {
    return this.api.get('users/online');
  }

  getCountries() {
    return this.api.get('users/countries');
  }

  getUserCompetitionPrizes(username: string) {
    return this.api.get(`users/${username}/competition-prizes`);
  }
}
