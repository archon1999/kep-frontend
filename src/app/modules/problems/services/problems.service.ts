import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';
import { ProblemFilter } from '../models/problems.models';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {

  constructor(
    public api: ApiService,
  ) { }

  getProblems(filter: ProblemFilter, topic=0, page=1, ordering='id', pageSize=9){
    var params: any = {
      page: page,
      page_size: pageSize,
      ordering: ordering,
    };

    if(filter?.difficulty){
      params.difficulty = filter.difficulty;
    }

    if(filter?.title){
      params.title = filter.title;
    }

    if(filter?.tags?.length > 0){
      params.tags = filter.tags.join(',');
    }

    if(topic){
      params.topic = topic;
    }

    if(filter?.status){
      var status = filter.status;
      if(status == 1){
        params.has_solved = 1;
      } else if(status == 2){
        params.has_solved = 0;
        params.has_attempted = 1;
      } else if(status == 3) {
        params.has_solved = 0;
        params.has_attempted = 0;
      }
    }

    return this.api.get('problems', params);
  }

  getProblem(id: number | string){
    return this.api.get(`problems/${id}`);
  }

  getStudyPlans(){
    return this.api.get('study-plans');
  }

  getStudyPlan(id: number | string){
    return this.api.get(`study-plans/${id}`);
  }
  
  getAttempt(id: number | string){
    return this.api.get(`attempts/${id}`);
  }

  getUserAttempts(username: string, page: number, pageSize: number){
    var params = { username: username, page: page, page_size: pageSize };
    return this.api.get('attempts', params);
  }

  getProblemAttempts(problemId: number, page: number, pageSize: number){
    var params = { problem_id: problemId, page: page, page_size: pageSize };
    return this.api.get('attempts', params);
  }

  getUserProblemAttempts(username: string, problemId: number, page: number, pageSize: number){
    var params = {
      'username': username,
      'problem_id': problemId,
      'page_size': pageSize,
      'page': page,
    };
    return this.api.get('attempts', params);
  }

  getTags(){
    return this.api.get('tags');
  }

  getDifficulties(){
    return this.api.get('problems/difficulties');
  }

  getProblemsRating(page: number, pageSize=10, ordering='-solved'){
    let params = { page: page, ordering: ordering, page_size: pageSize };
    return this.api.get('problems-rating', params)
  }

  getProblemsList(){
    return this.api.get('problems/list');
  }

  getProblemsRatingToday(){
    return this.api.get('problems-rating/today/');
  }

  getProblemsRatingWeek(){
    return this.api.get('problems-rating/week/');
  }

  getProblemsRatingMonth(){
    return this.api.get('problems-rating/month/');
  }

  getProblemRatingHistory(type: number){
    let params = { type: type, ordering: '-result' }
    return this.api.get('problems-rating-history', params);
  }

  getProblemVerdictStatistics(problemId: number){
    return this.api.get(`problems/${problemId}/attempt-statistics/`);
  }

  getProblemLangStatistics(problemId: number){
    return this.api.get(`problems/${problemId}/lang-statistics/`);
  }
  
  getProblemTopAttempts(problemId: number, ordering: string, lang=null, page: number=1, pageSize: number=10){
    var params = { ordering: ordering, lang: lang };
    return this.api.get(`problems/${problemId}/top-attempts/`, params);
  }
  
  getAttemptsForSolveStatistics(problemId){
    return this.api.get(`problems/${problemId}/attempts-for-solve-statistics/`);
  }

  getProblemSolution(problemId){
    return this.api.get(`problems/${problemId}/solution/`);
  }
  
  addTag(problemId, tagId){
    let params = { tag_id: tagId };
    return this.api.post(`problems/${problemId}/add-tag/`, params);
  }

  removeTag(problemId, tagId){
    let params = { tag_id: tagId };
    return this.api.post(`problems/${problemId}/remove-tag/`, params);
  }

  getVerdicts(){
    return this.api.get('attempts/verdicts');
  }

  attemptRerun(attemptId: number){
    return this.api.post(`attempts/${attemptId}/rerun/`);
  }
  
  problemLike(problemId: number){
    return this.api.post(`problems/${problemId}/like/`);
  }

  problemDislike(problemId: number){
    return this.api.post(`problems/${problemId}/dislike/`);
  }

}
