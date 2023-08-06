import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthenticationService } from 'app/auth/service';
import { ContestAttemptsFilter, ContestStatus } from './contests.models';

@Injectable({
  providedIn: 'root'
})
export class ContestsService {

  constructor(
    public api: ApiService,
    public authService: AuthenticationService,
  ) { }

  getContests(page: number, pageSize: number) {
    var params = {page: page, page_size: pageSize};
    return this.api.get('contests', params);
  }

  getContest(contestId: number | string) {
    return this.api.get(`contests/${contestId}`);
  }
  
  getContestants(contestId: number | string){
    return this.api.get(`contests/${contestId}/contestants`);
  }

  getMe(contestId: number | string){
    return this.api.get(`contests/${contestId}/me`);
  }

  getContestProblems(contestId: number | string) { 
    return this.api.get(`contests/${contestId}/problems`);  
  }

  getContestProblem(contestId: number | string, symbol: string) { 
    return this.api.get(`contests/${contestId}/problem`, {symbol: symbol});  
  }

  getUpcomingContests(){
    return this.api.get('contests', {status: ContestStatus.NOT_STARTED});
  }

  getAlreadyContests(){
    return this.api.get('contests', {status: ContestStatus.ALREADY});
  }

  getPastContests(page: number){
    return this.api.get('contests', {status: ContestStatus.FINISHED, page: page});
  }

  getContestsRating(page: number, pageSize){
    let params = { page: page, page_size: pageSize };
    return this.api.get('contests-rating', params);
  }

  getContestAttempts(contestId: number | string, page: number, pageSize: number, filter: ContestAttemptsFilter){
    let params: any = {
      contest_id: contestId,
      page: page,
      page_size: pageSize,
    };

    if(filter?.userOnly){
      params.username = this.authService.currentUserValue?.username;
    }

    if(filter?.verdict){
      params.verdict = filter.verdict;
    }

    if(filter?.contestProblem){
      params.contest_problem = filter.contestProblem;
    }

    return this.api.get('attempts', params);
  }

  getContestsRatingChanges(username: string){
    return this.api.get(`contests-rating/${username}/rating-changes`);
  }

  getContestQuestions(id: number | string){
    return this.api.get(`contests/${id}/questions`);
  }

  newQuestion(id: number | string, problem: string | null, question: string){
    return this.api.post(`contests/${id}/new-question/`, {
      problem: problem,
      question: question,
    });
  }

}
