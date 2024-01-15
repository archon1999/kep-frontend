import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/auth/service';
import { map } from 'rxjs/operators';
import { Pageable } from '@shared/components/classes/pageable';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestAttemptsFilter } from '@contests/models/contest-attempts-filter';
import { Contest } from '@contests/models/contest';
import { ContestCategory } from '@contests/models';
import { getCategoryIcon } from '@contests/utils/category-icon';

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
    return this.api.get(`contests/${contestId}`).pipe(
      map(contest => Contest.fromJSON(contest))
    );
  }

  getContestants(contestId: number | string) {
    return this.api.get(`contests/${contestId}/contestants`);
  }

  getMe(contestId: number | string) {
    return this.api.get(`contests/${contestId}/me`);
  }

  getContestProblems(contestId: number | string) {
    return this.api.get(`contests/${contestId}/problems`);
  }

  getContestProblem(contestId: number | string, symbol: string) {
    return this.api.get(`contests/${contestId}/problem`, { symbol: symbol });
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
    return this.api.get(`contests-rating/${username}/rating-changes`);
  }

  getContestQuestions(id: number | string) {
    return this.api.get(`contests/${id}/questions`);
  }

  newQuestion(id: number | string, problem: string | null, question: string) {
    return this.api.post(`contests/${id}/new-question/`, {
      problem: problem,
      question: question,
    });
  }

  contestRegistration(contestId: number | string) {
    return this.api.post(`contests/${contestId}/registration/`);
  }

  virtualContestStart(contestId: number | string) {
    return this.api.post(`contests/${contestId}/virtual-contest-start/`);
  }

  getTop3Contestants(contestId: number | string) {
    return this.api.get(`contests/${contestId}/top3-contestants`);
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

  getUserContestsRating(username: string) {
    return this.api.get(`contests-rating/${username}`);
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
}
