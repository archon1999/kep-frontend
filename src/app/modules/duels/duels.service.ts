import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DuelsService {

  constructor(
    public api: ApiService,
  ) { }

  getDuel(duelId: number | string) {
    return this.api.get(`duels/${duelId}`);
  }

  getProblemAttempts(duelId: number, duelProblem: string, username: string) {
    return this.api.get('attempts', {
      username: username,
      duel_problem: duelProblem,
      duel_id: duelId,
      page_size: 20,
    })
  }

  getDuelResults(duelId: number | string) {
    return this.api.get(`duels/${duelId}/results`);
  }

}
