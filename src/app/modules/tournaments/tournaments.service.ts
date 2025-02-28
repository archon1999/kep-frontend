import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  constructor(
    public api: ApiService
  ) { }

  getTournaments() {
    return this.api.get('tournaments');
  }

  getTournament(tournamentId: number | string) {
    return this.api.get(`tournaments/${tournamentId}`);
  }

  tournamentRegister(tournamentId: number | string) {
    return this.api.post(`tournaments/${tournamentId}/registration/`);
  }

}
