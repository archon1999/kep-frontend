import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { ChallengesApiService } from '@challenges/services/challenges-api.service';
import { Pageable } from '@core/common/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class ChallengesStatisticsService {

  constructor(public api: ApiService, public challengesService: ChallengesApiService) {}

  getUserChallengesRating(username: string) {
    return this.api.get(`challenges-rating/${username}`);
  }

  getUserChallengesRatingChanges(username: string) {
    return this.api.get(`challenges-rating/${username}/rating-changes`);
  }

  getUserLastChallenges(params: Partial<Pageable> & { username: string }) {
    return this.challengesService.getChallenges(params);
  }

}
