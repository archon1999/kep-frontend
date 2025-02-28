import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ArenaStatus } from '@arena/arena.models';
import { Pageable } from '@app/common/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  constructor(
    public api: ApiService,
  ) { }

  getArenaAll(params?: { status?: ArenaStatus } & Partial<Pageable>) {
    return this.api.get('arena', params);
  }

  getArena(id: number | string) {
    return this.api.get(`arena/${id}`);
  }

  arenaRegistration(id: number | string) {
    return this.api.post(`arena/${id}/registration/`);
  }

  getArenaPlayers(id: number | string, params: any) {
    return this.api.get('arena-players', {...params, arena_id: id});
  }

  getStandingsPage(id: number | string) {
    return this.api.get(`arena/${id}/standings-page`);
  }

  getArenaChallenges(id: number | string) {
    return this.api.get(`arena/${id}/last-challenges`);
  }

  arenaPause(id: number | string) {
    return this.api.post(`arena/${id}/pause/`);
  }

  arenaStart(id: number | string) {
    return this.api.post(`arena/${id}/start/`);
  }

  nextChallenge(id: number | string) {
    return this.api.get(`arena/${id}/next-challenge/`);
  }

  getArenaPlayerStatistics(arenaId: number | string, username) {
    return this.api.get(`arena/${arenaId}/arena-player-statistics/`, {username: username});
  }

  getTop3(arenaId: number | string) {
    return this.api.get(`arena/${arenaId}/top-3/`);
  }

  getArenaStatistics(arenaId: number | string) {
    return this.api.get(`arena/${arenaId}/statistics/`);
  }

}
