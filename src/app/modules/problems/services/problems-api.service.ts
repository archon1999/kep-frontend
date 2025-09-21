import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { Category, Problem, ProblemsFilter } from '@problems/models/problems.models';
import { map } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { Pageable } from '@core/common/classes/pageable';
import { getCategoryIcon } from '@problems/utils/category';
import { Observable } from 'rxjs';
import { Verdicts } from '@problems/constants';

@Injectable({
  providedIn: 'root'
})
export class ProblemsApiService {
  constructor(public api: ApiService) {}

  getProblems(params: Partial<ProblemsFilter & Pageable & { hasSolved: number, hasAttempted: number }>) {
    if (params.status == 1) {
      params.hasSolved = 1;
    } else if (params.status == 2) {
      params.hasSolved = 0;
      params.hasAttempted = 1;
    } else if (params.status == 3) {
      params.hasSolved = 0;
      params.hasAttempted = 0;
    }
    if (params.tags) {
      // @ts-ignore
      params.tags = params.tags.join(',');
    }
    return this.api.get('problems', params);
  }

  getProblem(id: number | string) {
    return this.api.get(`problems/${id}`);
  }

  getNextProblemId(id: number) {
    return this.api.get(`problems/${id}/next`);
  }

  getPreviousProblemId(id: number) {
    return this.api.get(`problems/${id}/prev`);
  }

  getStudyPlans() {
    return this.api.get('study-plans');
  }

  getStudyPlan(id: number | string) {
    return this.api.get(`study-plans/${id}`);
  }

  getAttempt(id: number | string) {
    return this.api.get(`attempts/${id}`).pipe(
      map(attempt => Attempt.fromJSON(attempt))
    );
  }

  getUserAttempts(params: Partial<Pageable> & { username: string }) {
    return this.api.get('attempts', params);
  }

  getProblemAttempts(problemId: number, page: number, pageSize: number) {
    const params = {problem_id: problemId, page: page, page_size: pageSize};
    return this.api.get('attempts', params);
  }

  getUserProblemAttempts(username: string, problemId: number, page: number, pageSize: number) {
    const params = {
      'username': username,
      'problem_id': problemId,
      'page_size': pageSize,
      'page': page,
    };
    return this.api.get('attempts', params);
  }

  getTags() {
    return this.api.get('tags');
  }

  getLangs() {
    return this.api.get('problems/langs');
  }

  getDifficulties() {
    return this.api.get('problems/difficulties');
  }

  getProblemsRating(page: number, pageSize = 10, ordering = '-solved') {
    const params = {page, ordering, pageSize};
    return this.api.get('problems-rating', params);
  }

  getProblemVerdictStatistics(problemId: number) {
    return this.api.get(`problems/${problemId}/attempt-statistics/`);
  }

  getProblemLangStatistics(problemId: number) {
    return this.api.get(`problems/${problemId}/lang-statistics/`);
  }

  getProblemTopAttempts(problemId: number, ordering: string, lang = null, page: number = 1, pageSize: number = 10) {
    const params = {ordering, lang};
    return this.api.get(`problems/${problemId}/top-attempts/`, params);
  }

  getAttemptsForSolveStatistics(problemId: number) {
    return this.api.get(`problems/${problemId}/attempts-for-solve-statistics/`);
  }

  getProblemSolution(problemId: number) {
    return this.api.get(`problems/${problemId}/solution/`);
  }

  addTag(problemId: number, tagId: number) {
    const params = {tagId};
    return this.api.post(`problems/${problemId}/add-tag/`, params);
  }

  removeTag(problemId: number, tagId: number) {
    const params = {tagId};
    return this.api.post(`problems/${problemId}/remove-tag/`, params);
  }

  getVerdicts(): Observable<Array<{
    label: string,
    value: Verdicts,
  }>> {
    return this.api.get('attempts/verdicts');
  }

  attemptRerun(attemptId: number) {
    return this.api.post(`attempts/${attemptId}/rerun/`);
  }

  problemLike(problemId: number) {
    return this.api.post(`problems/${problemId}/like/`);
  }

  problemDislike(problemId: number) {
    return this.api.post(`problems/${problemId}/dislike/`);
  }

  getTopics() {
    return this.api.get('problems/topics');
  }

  addTopic(problemId: number | string, topicId: number) {
    const params = {topic_id: topicId};
    return this.api.post(`problems/${problemId}/add-topic/`, params);
  }

  removeTopic(problemId: number | string, topicId: number) {
    const params = {topic_id: topicId};
    return this.api.post(`problems/${problemId}/remove-topic/`, params);
  }

  hackSubmit(attemptId: number | string, body: { input?: string, generatorSource?: string, generatorLang?: string }) {
    return this.api.post(`attempts/${attemptId}/hack-submit`, body);
  }

  hackAttemptRerun(hackAttemptId: number) {
    return this.api.post(`hack-attempts/${hackAttemptId}/rerun/`);
  }

  getHackAttempts(params: any) {
    return this.api.get('hack-attempts', params);
  }

  getCategories() {
    return this.api.get('categories').pipe(
      map(
        (categories: Array<Category>) => {
          return categories.map((category) => {
            category.icon = getCategoryIcon(category.id);
            return category;
          });
        }
      )
    );
  }

  getCategory(categoryId: number) {
    return this.api.get(`categories/${categoryId}`);
  }

  getCategoryTopUsers(categoryId: number) {
    return this.api.get(`categories/${categoryId}/top-users`);
  }

  getCategoryStudyPlans(categoryId: number) {
    return this.api.get(`categories/${categoryId}/study-plans`);
  }

  getCurrentProblemsRating(period: 'today' | 'week' | 'month') {
    return this.api.get(`problems-rating/${period}`);
  }

  getMostViewedProblems(): Observable<Array<Partial<Problem>>> {
    return this.api.get('problems/most-viewed');
  }

  getLastContest() {
    return this.api.get('problems/last-contest');
  }
}

