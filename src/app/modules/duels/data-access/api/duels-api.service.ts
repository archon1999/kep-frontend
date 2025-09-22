import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import {
  Duel,
  DuelPreset,
  DuelReadyPlayer,
  DuelReadyStatus,
  DuelResults,
  DuelsRating,
} from '@duels/domain';

@Injectable({
  providedIn: 'root'
})
export class DuelsApiService {

  constructor(private readonly api: ApiService) {}

  getDuel(duelId: number | string): Observable<Duel> {
    return this.api.get(`duels/${duelId}`);
  }

  getProblemAttempts(duelId: number, duelProblem: string) {
    return this.api.get('attempts', {
      duel_problem: duelProblem,
      duel_id: duelId,
      page_size: 20,
    });
  }

  getDuelResults(duelId: number | string): Observable<DuelResults> {
    return this.api.get(`duels/${duelId}/results`);
  }

  getReadyStatus(): Observable<DuelReadyStatus> {
    return this.api.get('duels/ready-status');
  }

  updateReadyStatus(ready: boolean): Observable<DuelReadyStatus> {
    return this.api.put('duels/ready-status', { ready });
  }

  getReadyPlayers(params: Record<string, any>): Observable<PageResult<DuelReadyPlayer>> {
    return this.api.get('duels/ready-users', params);
  }

  getDuelPresets(username: string): Observable<DuelPreset[]> {
    return this.api.get('duels/duel-presets', { username });
  }

  createDuel(body: { duel_username: string; duel_preset: number; start_time: string }) {
    return this.api.post('duels/duel-create', body);
  }

  getDuels(params: Record<string, any>): Observable<PageResult<Duel>> {
    return this.api.get('duels', params);
  }

  getMyDuels(params: Record<string, any>): Observable<PageResult<Duel>> {
    return this.api.get('duels/my', params);
  }

  confirmDuel(duelId: number) {
    return this.api.post(`duels/${duelId}/confirm`);
  }

  getDuelsRating(params: Record<string, any>): Observable<PageResult<DuelsRating>> {
    return this.api.get('duels-rating', params);
  }

}
