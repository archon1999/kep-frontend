import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

@Injectable({
  providedIn: 'root'
})
export class TestingApiService {

  constructor(protected readonly api: ApiService) {}

  getChapters() {
    return this.api.get('chapters');
  }

  getTest(testId: number | string) {
    return this.api.get(`tests/${testId}`);
  }

  getTests(params: any = {}) {
    return this.api.get('tests', params);
  }

  getTestBestResults(testId: number | string) {
    return this.api.get(`tests/${testId}/best-results`);
  }

  getTestLastResults(testId: number | string) {
    return this.api.get(`tests/${testId}/last-results`);
  }

  testStart(testId: number) {
    return this.api.get(`tests/${testId}/start`);
  }

  getTestPass(testPassId: number | string) {
    return this.api.get(`test-pass/${testPassId}`);
  }

  answerSubmit(testPassId: number, questionNumber: number, answer: any) {
    const data = {
      questionNumber: questionNumber,
      answer: answer,
    };
    return this.api.post(`test-pass/${testPassId}/submit-answer/`, data);
  }

  testPassFinish(testPassId: number) {
    return this.api.get(`test-pass/${testPassId}/finish`);
  }

}
