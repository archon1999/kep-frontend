import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentsApiService {
  protected api = inject(ApiService);

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
