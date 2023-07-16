import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemsStatisticsService {

  constructor(
    public api: ApiService,
  ) { }

  getGeneral(username: string){
    return this.api.get(`problems-rating/${username}/statistics-general/`);
  }

  getByDifficulty(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-difficulty/`);
  }

  getByTag(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-tag/`);
  }

  getByVerdict(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-verdict/`);
  }

  getByLang(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-lang/`);
  }
  
  getByTopic(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-topic/`);
  }
  
  getByWeekday(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-weekday/`);
  }

  getByPeriod(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-period/`);
  }

  getByMonth(username: string){
    return this.api.get(`problems-rating/${username}/statistics-by-month/`);
  }
  
  getFacts(username: string){
    return this.api.get(`problems-rating/${username}/statistics-facts/`);
  }
  
  getNumberOfAttemptsForSolve(username: string){
    return this.api.get(`problems-rating/${username}/statistics-number-of-attempts-for-solve/`);
  }

  getLastDays(username: string, days: number){
    let params = { days: days };
    return this.api.get(`problems-rating/${username}/statistics-last-days/`, params);
  }

  getHeatmap(username: string, year: number){
    let params = { year: year };
    return this.api.get(`problems-rating/${username}/statistics-heatmap/`, params);
  }

}
