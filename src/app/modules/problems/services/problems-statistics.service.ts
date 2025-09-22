import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { ProblemsStatistics } from '@problems/models/statistics.models';

@Injectable({
  providedIn: 'root'
})
export class ProblemsStatisticsService {

  constructor(
    public api: ApiService,
  ) { }

  getStatistics(username: string, params: { year?: number; days?: number } = {}) {
    return this.api.get<ProblemsStatistics>(`problems-rating/${username}/statistics/`, params);
  }
}
