import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

@Injectable({
  providedIn: 'root'
})
export class HackathonsApiService {
  protected api = inject(ApiService);

  getHackathons() {
    return this.api.get('hackathons');
  }

  getHackathon(id: number | string) {
    return this.api.get(`hackathons/${id}`);
  }

  getHackathonProjects(id: number | string) {
    return this.api.get(`hackathons/${id}/projects`);
  }

  getHackathonProject(id: number | string, symbol: string) {
    return this.api.get(`hackathons/${id}/projects/${symbol}`);
  }

  registration(id: number | string) {
    return this.api.post(`hackathons/${id}/registration`);
  }

  getHackathonRegistrants(id: number | string) {
    return this.api.get(`hackathons/${id}/standings`);
  }

  getHackathonStandings(id: number | string) {
    return this.api.get(`hackathons/${id}/standings`);
  }
}
