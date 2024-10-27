import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from '@auth';
import { map } from 'rxjs/operators';
import { Pageable } from '@app/common/classes/pageable';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestAttemptsFilter } from '@contests/models/contest-attempts-filter';
import { Contest } from '@contests/models/contest';
import { Contestant, ContestCategory } from '@contests/models';
import { getCategoryIcon } from '@contests/utils/category-icon';
import { PageResult } from '@app/common/classes/page-result';
import { Attempt } from '@problems/models/attempts.models';

@Injectable({
  providedIn: 'root'
})
export class ContestsService {

  constructor(
    public api: ApiService,
    public authService: AuthService,
  ) { }

  getContests(params: Partial<Pageable> & { category?: number, type?: string, isParticipated?: number, creator?: string }) {
    return this.api.get('contests', params).pipe(
      map((result: any) => {
        result.data = result.data.map((contest: Contest) => Contest.fromJSON(contest));
        return result;
      })
    );
  }

  getUserContests(params: Partial<Pageable> & { category?: number, type?: string, isParticipated?: boolean, creator?: string }) {
    return this.api.get('user-contests', params).pipe(
      map((result: any) => {
        result.data = result.data.map((contest: Contest) => Contest.fromJSON(contest));
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
    return this.api.get(`contests/${ contestId }/contestants`).pipe(
      map((contestants: Array<Contestant>) => {
        return contestants.map((c) => Contestant.fromJSON(c));
      })
    );
  }

  getNewContestants(contestId: number | string, params: any) {
    return this.api.get(`contests/${ contestId }/new-contestants`, params).pipe(
      map((pageResult: PageResult<Contestant>) => {
        pageResult.data = pageResult.data.map((c) => Contestant.fromJSON(c));
        return pageResult;
      })
    );
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

  getContestsRating(params: Partial<Pageable>) {
    return this.api.get('contests-rating', params);
  }

  getContestAttempts(params: Partial<Pageable> & { contestId: number, filter: ContestAttemptsFilter } & any) {
    if (params.filter?.userOnly) {
      params.username = this.authService.currentUserValue?.username;
    }

    if (params.filter?.verdict) {
      params.verdict = params.filter.verdict;
    }

    if (params.filter?.contestProblem) {
      params.contest_problem = params.filter.contestProblem;
    }

    delete params.filter;
    return this.api.get('attempts', params).pipe(
      map((result: PageResult<Attempt>) => {
        result.data = result.data.map((attempt: Attempt) => Attempt.fromJSON(attempt));
        return result;
      })
    );
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

  contestRegistration(contestId: number | string, teamId?: number) {
    return this.api.post(`contests/${ contestId }/registration/`, { team_id: teamId });
  }

  cancelRegistration(contestId: number | string) {
    return this.api.get(`contests/${ contestId }/cancel-registration/`);
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
    return this.api.get(`contests/${ contestId }/registrants`);
  }

  getUserContestsRating(username: string) {
    return this.api.get(`contests-rating/${ username }`);
  }

  getContestsCategories() {
    return this.api.get('contests-categories').pipe(
      map((categories: Array<ContestCategory>) => categories.map(
        (category) => {
          category.icon = getCategoryIcon(category.id);
          return category;
        }
      ))
    );
  }

  getUserTeams() {
    return this.api.get('user-teams');
  }
}
