import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthenticationService } from 'app/auth/service';

@Injectable({
  providedIn: 'root'
})
export class ContestsService {

  constructor(
    public api: ApiService,
    public authService: AuthenticationService,
  ) { }

  getContests(page: number) {
    var params = {page: page, page_size: 10};
    return this.api.get('user-contests', params);
  }

  getContest(contestId: number | string) {
    return this.api.get(`user-contests/${contestId}`);
  }
  
  getProblemsList(){
    return this.api.get('problems/list');
  }

  getContestants(contestId: number | string){
    return this.api.get(`user-contests/${contestId}/contestants`);
  }

  getContestProblems(contestId: number | string) { 
    return this.api.get(`user-contests/${contestId}/problems`);  
  }

  getContestProblem(contestId: number | string, symbol: string) { 
    return this.api.get(`user-contests/${contestId}/problem`, {symbol: symbol});  
  }

  getContestAttempts(contestId: number | string, page: number, pageSize: number){
    let params: any = {
      user_contest_id: contestId,
      page: page,
      page_size: pageSize,
    };

    return this.api.get('attempts', params);
  }

  createContest(contest: any){
    return this.api.post('user-contests/create-contest/', contest);
  }

}
