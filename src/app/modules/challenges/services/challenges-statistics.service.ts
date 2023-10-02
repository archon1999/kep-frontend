import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesStatisticsService {

  constructor(public api: ApiService) {
  }

  getUserChallengesRating(username: string) {
    return this.api.get(`challenges-rating/${ username }`);
  }

  getUserChallengesRatingChanges(username: string) {
    return this.api.get(`challenges-rating/${ username }/rating-changes`);
  }

  getUserLastChallenges(username: string, page: number, pageSize: number) {
    return this.api.get('challenges', {
      username: username,
      page: page,
      page_size: pageSize,
    });
  }

}
