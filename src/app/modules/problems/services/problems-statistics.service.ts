import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

export interface ProblemsStatisticsRequest {
  year?: number | null;
  days?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemsStatisticsService {

  constructor(
    public api: ApiService,
  ) { }

  getStatistics(username: string, params: ProblemsStatisticsRequest) {
    return this.api.get(`problems-rating/${username}/statistics`, params);
  }

}
