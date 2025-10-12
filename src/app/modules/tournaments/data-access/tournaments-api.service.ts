import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { Pageable } from '@core/common/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class TournamentsApiService {
  protected api = inject(ApiService);

  getTournaments(params?: Partial<Pageable> & { title?: string }) {
    return this.api.get('tournaments', params);
  }

  getTournament(tournamentId: number | string) {
    return this.api.get(`tournaments/${tournamentId}`);
  }

  tournamentRegister(tournamentId: number | string) {
    return this.api.post(`tournaments/${tournamentId}/registration/`);
  }
}
