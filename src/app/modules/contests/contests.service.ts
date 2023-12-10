import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthenticationService } from 'app/auth/service';
import { Contest, ContestAttemptsFilter, ContestStatus } from './contests.models';
import { map } from 'rxjs/operators';
import { Pageable } from '@shared/components/classes/pageable';
import { paramsMapper } from '@shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ContestsService {

  constructor(
    public api: ApiService,
    public authService: AuthenticationService,
  ) { }

  getContests(params: Partial<Pageable> & { category?: number, type?: string, isParticipated?: boolean, creator?: string }) {
    return this.api.get('contests', paramsMapper(params)).pipe(
      map((result: any) => {
        result.data = result.data.map(contest => Contest.fromJSON(contest));
        return result;
      })
    );
  }

  getUserContests(params: Partial<Pageable> & { category?: number, type?: string, isParticipated?: boolean, creator?: string }) {
    return this.api.get('user-contests', paramsMapper(params)).pipe(
      map((result: any) => {
        result.data = result.data.map(contest => Contest.fromJSON(contest));
        return result;
      })
    );
  }

  getContest(contestId: number | string) {
    return this.api.get(`contests/${ contestId }`).pipe(
      map(contest => Contest.fromJSON(contest))
    );
  }

  getContestants(contestId: number | string) {
    return this.api.get(`contests/${ contestId }/contestants`);
  }

  getMe(contestId: number | string) {
    return this.api.get(`contests/${ contestId }/me`);
  }

  getContestProblems(contestId: number | string) {
    return this.api.get(`contests/${ contestId }/problems`);
  }

  getContestProblem(contestId: number | string, symbol: string) {
    return this.api.get(`contests/${ contestId }/problem`, { symbol: symbol });
  }

  getUpcomingContests() {
    return this.api.get('contests', { status: ContestStatus.NOT_STARTED });
  }

  getAlreadyContests() {
    return this.api.get('contests', { status: ContestStatus.ALREADY });
  }

  getPastContests(page: number) {
    return this.api.get('contests', { status: ContestStatus.FINISHED, page: page });
  }

  getContestsRating(page: number, pageSize) {
    const params = { page: page, page_size: pageSize };
    return this.api.get('contests-rating', params);
  }

  getContestAttempts(contestId: number | string, page: number, pageSize: number, filter: ContestAttemptsFilter) {
    const params: any = {
      contest_id: contestId,
      page: page,
      page_size: pageSize,
    };

    if (filter?.userOnly) {
      params.username = this.authService.currentUserValue?.username;
    }

    if (filter?.verdict) {
      params.verdict = filter.verdict;
    }

    if (filter?.contestProblem) {
      params.contest_problem = filter.contestProblem;
    }

    return this.api.get('attempts', params);
  }

  getContestsRatingChanges(username: string) {
    return this.api.get(`contests-rating/${ username }/rating-changes`);
  }

  getContestQuestions(id: number | string) {
    return this.api.get(`contests/${ id }/questions`);
  }

  newQuestion(id: number | string, problem: string | null, question: string) {
    return this.api.post(`contests/${ id }/new-question/`, {
      problem: problem,
      question: question,
    });
  }

  contestRegistration(contestId: number | string) {
    return this.api.post(`contests/${ contestId }/registration/`);
  }

  virtualContestStart(contestId: number | string) {
    return this.api.post(`contests/${ contestId }/virtual-contest-start/`);
  }

  getTop3Contestants(contestId: number | string) {
    return this.api.get(`contests/${ contestId }/top3-contestants`);
  }

  createContest(contest: any) {
    return this.api.post('contests/create-contest/', contest);
  }

  getProblemsList() {
    return this.api.get('problems/list');
  }

  getContestRegistrants(contestId: number | string) {
    return this.api.get(`contests/${contestId}/registrants`);
  }
}
