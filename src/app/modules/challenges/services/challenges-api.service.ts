import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { AuthService } from '@auth';
import { Pageable } from '@core/common/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class ChallengesApiService {

  constructor(
    public api: ApiService,
    public authService: AuthService,
  ) {}

  getChallengesRating(params: Partial<Pageable>) {
    return this.api.get('challenges-rating', params);
  }

  getChallengeCalls() {
    return this.api.get('challenge-calls');
  }

  getChallenges(params: Partial<Pageable> & { username?: string, arenaId?: number }) {
    return this.api.get('challenges', params);
  }

  getChallenge(challengeId: number | string) {
    return this.api.get(`challenges/${challengeId}`);
  }

  challengeStart(challengeId: number) {
    return this.api.post(`challenges/${challengeId}/start/`);
  }

  acceptChallengeCall(challengeCallId: number) {
    return this.api.post(`challenge-calls/${challengeCallId}/accept/`);
  }

  deleteChallengeCall(challengeCallId: number) {
    return this.api.delete(`challenge-calls/${challengeCallId}/delete`);
  }

  newChallengeCall(timeSeconds: number, questionsCount: number, chapters: Number[]) {
    const data = {
      time_seconds: timeSeconds,
      questions_count: questionsCount,
      chapters: chapters,
    };
    return this.api.post('challenge-calls/new/', data);
  }

  checkAnswer(challengeId: number, answer: any, isFinish?: boolean) {
    const body: any = {answer};
    if (isFinish) { body.finish = true; }
    return this.api.post(`challenges/${challengeId}/check-answer/`, body);
  }

  getRatingChanges(username: string) {
    return this.api.get(`challenges-rating/${username}/rating-changes`);
  }

  getChapters() {
    return this.api.get('chapters');
  }

}
