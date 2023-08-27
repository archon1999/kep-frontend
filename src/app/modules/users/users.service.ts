import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public api: ApiService) {}

  getUsers(page=1, full=false, ordering='-rating'){
    let params: any = {'page': page, ordering: ordering};
    if(full){
      params.full = true;
    }
    return this.api.get('users', params)
  }

  getUser(username: string){
    return this.api.get(`users/${username}`);
  }
  
  getUserInfo(username: string){
    return this.api.get(`users/${username}/info`);
  }

  getUserSkills(username: string){
    return this.api.get(`users/${username}/skills`);
  }

  getUserSocial(username: string){
    return this.api.get(`users/${username}/social`);
  }

  getUserTechnologies(username: string){
    return this.api.get(`users/${username}/technologies`);
  }

  getUserAchievements(username: string){
    return this.api.get(`users/${username}/achievements`);
  }

  getUserEducations(username: string){
    return this.api.get(`users/${username}/educations`);
  }

  getUserWorkExperiences(username: string){
    return this.api.get(`users/${username}/work-experiences`);
  }

  getUserBlog(username: string, page=1, pageSize=3){
    var params = {'author': username, 'page': page, 'page_size': pageSize};
    return this.api.get('blog/', params);
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

  getUserRatings(username: string){
    return this.api.get(`users/${username}/ratings`);
  }

  getMostActiveUsers(){
    return this.api.get('users/most-active-users');
  }

  getUsersChartSeries(){
    return this.api.get('users/chart-statistics');
  }

  getOnlineUsers(){
    return this.api.get('users/online');
  }

}
