import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LugavarService {

  constructor(
    public api: ApiService,
  ) { }

  getDailyTrick() {
    return this.api.get('daily-trick');
  }

  getDailyQuestion() {
    return this.api.get('daily-question');
  }

  dailyQuestionAnswer(optionId: number) {
    return this.api.post('daily-question-answer/', {optionId: optionId});
  }

  getDailyInterestingFact() {
    return this.api.get('daily-interesting-fact');
  }

  getDictionary() {
    return this.api.get('dictionary');
  }

}
