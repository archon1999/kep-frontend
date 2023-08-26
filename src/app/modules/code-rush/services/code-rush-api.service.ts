import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CodeRushApiService {

  constructor(
    public api: ApiService,
  ) {
  }

  getCodeRush(codeRushId: number | string) {
    return this.api.get(`code-rush/${ codeRushId }`);
  }

  getProblemAttempts(duelId: number, duelProblem: string, username: string) {
    return this.api.get('attempts', {
      username: username,
      duel_problem: duelProblem,
      duel_id: duelId,
      page_size: 20,
    });
  }

  getCodeRushResults(duelId: number | string) {
    return this.api.get(`duels/${ duelId }/results`);
  }

}
