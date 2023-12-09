import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ProblemsFilter } from '@problems/models/problems.models';
import { map } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { paramsMapper } from '@shared/utils';
import { Pageable } from '@shared/components/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {

  constructor(public api: ApiService) {}

  getProblems(params: Partial<ProblemsFilter & Pageable & { hasSolved, hasAttempted }>) {
    if (params.status === 1) {
      params.hasSolved = 1;
    } else if (params.status === 2) {
      params.hasSolved = 0;
      params.hasAttempted = 1;
    } else if (params.status === 3) {
      params.hasSolved = 0;
      params.hasAttempted = 0;
    }
    delete params.status;
    return this.api.get('problems', paramsMapper(params));
  }

  getProblem(id: number | string) {
    return this.api.get(`problems/${ id }`);
  }

  getStudyPlans() {
    return this.api.get('study-plans');
  }

  getStudyPlan(id: number | string) {
    return this.api.get(`study-plans/${ id }`);
  }

  getAttempt(id: number | string) {
    return this.api.get(`attempts/${ id }`).pipe(
      map(attempt => Attempt.fromJSON(attempt))
    );
  }

  getUserAttempts(username: string, page: number, pageSize: number) {
    const params = { username: username, page: page, page_size: pageSize };
    return this.api.get('attempts', params);
  }

  getProblemAttempts(problemId: number, page: number, pageSize: number) {
    const params = { problem_id: problemId, page: page, page_size: pageSize };
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

  getDifficulties() {
    return this.api.get('problems/difficulties');
  }

  getProblemsRating(page: number, pageSize = 10, ordering = '-solved') {
    const params = { page: page, ordering: ordering, page_size: pageSize };
    return this.api.get('problems-rating', params);
  }

  getProblemsList() {
    return this.api.get('problems/list');
  }

  getProblemsRatingToday() {
    return this.api.get('problems-rating/today/');
  }

  getProblemsRatingWeek() {
    return this.api.get('problems-rating/week/');
  }

  getProblemsRatingMonth() {
    return this.api.get('problems-rating/month/');
  }

  getProblemRatingHistory(type: number) {
    const params = { type: type, ordering: '-result' };
    return this.api.get('problems-rating-history', params);
  }

  getProblemVerdictStatistics(problemId: number) {
    return this.api.get(`problems/${ problemId }/attempt-statistics/`);
  }

  getProblemLangStatistics(problemId: number) {
    return this.api.get(`problems/${ problemId }/lang-statistics/`);
  }

  getProblemTopAttempts(problemId: number, ordering: string, lang = null, page: number = 1, pageSize: number = 10) {
    const params = { ordering: ordering, lang: lang };
    return this.api.get(`problems/${ problemId }/top-attempts/`, params);
  }

  getAttemptsForSolveStatistics(problemId) {
    return this.api.get(`problems/${ problemId }/attempts-for-solve-statistics/`);
  }

  getProblemSolution(problemId) {
    return this.api.get(`problems/${ problemId }/solution/`);
  }

  addTag(problemId, tagId) {
    const params = { tag_id: tagId };
    return this.api.post(`problems/${ problemId }/add-tag/`, params);
  }

  removeTag(problemId, tagId) {
    const params = { tag_id: tagId };
    return this.api.post(`problems/${ problemId }/remove-tag/`, params);
  }

  getVerdicts() {
    return this.api.get('attempts/verdicts');
  }

  attemptRerun(attemptId: number) {
    return this.api.post(`attempts/${ attemptId }/rerun/`);
  }

  problemLike(problemId: number) {
    return this.api.post(`problems/${ problemId }/like/`);
  }

  problemDislike(problemId: number) {
    return this.api.post(`problems/${ problemId }/dislike/`);
  }

  getTopics() {
    return this.api.get('problems/topics');
  }

  addTopic(problemId: number | string, topicId: number) {
    const params = { topic_id: topicId };
    return this.api.post(`problems/${ problemId }/add-topic/`, params);
  }

  removeTopic(problemId: number | string, topicId: number) {
    const params = { topic_id: topicId };
    return this.api.post(`problems/${ problemId }/remove-topic/`, params);
  }

  hackSubmit(attemptId: number | string, body: { input?: string, generatorSource?: string, generatorLang?: string }) {
    return this.api.post(`attempts/${ attemptId }/hack-submit`, paramsMapper(body));
  }

  hackAttemptRerun(hackAttemptId: number) {
    return this.api.post(`hack-attempts/${ hackAttemptId }/rerun/`);
  }

  getHackAttempts(params: any) {
    return this.api.get('hack-attempts', paramsMapper(params));
  }

  getCategories() {
    return this.api.get('categories');
  }
}
