import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { AuthenticationService } from '../../../auth/service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  constructor(
    public api: ApiService,
    public authService: AuthenticationService,
  ) {
  }

  getChallengesRating(page: number) {
    return this.api.get('challenges-rating');
  }

  getChallengeCalls() {
    return this.api.get('challenge-calls');
  }

  getChallenges(page: number, username = null, pageSize = 10) {
    const params: any = { page: page, page_size: pageSize };
    if (username) {
      params.username = username;
    }
    return this.api.get('challenges', params);
  }

  getChallenge(challengeId: number | string) {
    return this.api.get(`challenges/${ challengeId }`);
  }

  challengeStart(challengeId: number) {
    return this.api.post(`challenges/${ challengeId }/start/`);
  }

  acceptChallengeCall(challengeCallId: number) {
    return this.api.post(`challenge-calls/${ challengeCallId }/accept/`);
  }

  deleteChallengeCall(challengeCallId: number) {
    return this.api.delete(`challenge-calls/${ challengeCallId }/delete`);
  }

  newChallengeCall(timeSeconds: number, questionsCount: number, chapters: Number[]) {
    const data = {
      time_seconds: timeSeconds,
      questions_count: questionsCount,
      chapters: chapters,
    };
    return this.api.post('challenge-calls/new/', data);
  }

  checkAnswer(challengeId: number, data: any) {
    return this.api.post(`challenges/${ challengeId }/check-answer/`, data);
  }

  getRatingChanges(username: string) {
    return this.api.get(`challenges-rating/${ username }/rating-changes`);
  }

  getChapters() {
    return this.api.get('chapters');
  }

}
