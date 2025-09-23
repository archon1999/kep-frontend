import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  LastDaysStatistics,
  ProblemsFacts,
  ProblemsStatisticsResponse,
  DifficultyStatistics,
  LangStatistics,
  TagStatistics,
  TopicStatistics,
  WeekdayStatistics,
  MonthStatistics,
  PeriodStatistics,
  NumberOfAttemptsStatistics,
  GeneralInfo,
  HeatmapEntry,
} from '@problems/models/statistics.models';

export interface ProblemsStatisticsParams {
  year?: number;
  days?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemsStatisticsService {

  private cache = new Map<string, Observable<ProblemsStatisticsResponse>>();

  constructor(
    public api: ApiService,
  ) { }

  getStatistics(username: string, params: ProblemsStatisticsParams = {}): Observable<ProblemsStatisticsResponse> {
    const query = this.buildQuery(params);
    const cacheKey = this.buildCacheKey(username, query.year, query.days);

    if (!this.cache.has(cacheKey)) {
      const request$ = this.api.get<ProblemsStatisticsResponse>(`problems-rating/${username}/statistics`, query).pipe(
        tap({
          error: () => this.cache.delete(cacheKey),
        }),
        shareReplay(1),
      );

      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey);
  }

  clearCache(username?: string) {
    if (!username) {
      this.cache.clear();
      return;
    }

    Array.from(this.cache.keys())
      .filter((key) => key.startsWith(`${username}|`))
      .forEach((key) => this.cache.delete(key));
  }

  getGeneral(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.general as GeneralInfo));
  }

  getByDifficulty(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byDifficulty as DifficultyStatistics));
  }

  getByTag(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byTag as TagStatistics[]));
  }

  getByLang(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byLang as LangStatistics[]));
  }

  getByTopic(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byTopic as TopicStatistics[]));
  }

  getByWeekday(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byWeekday as WeekdayStatistics[]));
  }

  getByPeriod(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byPeriod as PeriodStatistics[]));
  }

  getByMonth(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.byMonth as MonthStatistics[]));
  }

  getFacts(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.facts as ProblemsFacts));
  }

  getNumberOfAttemptsForSolve(username: string, params: ProblemsStatisticsParams = {}) {
    return this.getStatistics(username, params).pipe(map((response) => response.numberOfAttempts as NumberOfAttemptsStatistics));
  }

  getLastDays(username: string, days: number, year?: number) {
    return this.getStatistics(username, { days, year }).pipe(map((response) => response.lastDays as LastDaysStatistics));
  }

  getHeatmap(username: string, year?: number) {
    return this.getStatistics(username, { year }).pipe(map((response) => response.heatmap as HeatmapEntry[]));
  }

  private buildQuery(params: ProblemsStatisticsParams) {
    const currentYear = new Date().getFullYear();

    return {
      year: params.year ?? currentYear,
      days: params.days ?? 7,
    };
  }

  private buildCacheKey(username: string, year: number, days: number) {
    return `${username}|${year}|${days}`;
  }
}
