import { Component, OnInit } from '@angular/core';
import {
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation
} from 'angular-animations';
import { DictionaryWord, InterestingFact, Question, Trick } from './lugavar.models';
import { LugavarService } from './lugavar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lugavar',
  templateUrl: './lugavar.component.html',
  styleUrls: ['./lugavar.component.scss'],
  standalone: false,
})
export class LugavarComponent implements OnInit {

  public dailyTrick: Trick;
  public dailyQuestion: Question;
  public dailyInterestingFact: InterestingFact;

  public dictionary: Array<DictionaryWord> = [];
  public totalWords = 0;
  public pageNumber = 1;
  public searchText = "";
  public pageSize = 10;
  public selectedWords: Array<DictionaryWord> = [];
  public training = false;

  constructor(
    public service: LugavarService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({dailyTrick, dailyQuestion, dailyInterestingFact}) => {
      this.dailyTrick = dailyTrick;
      this.dailyQuestion = dailyQuestion;
      this.dailyQuestion.totalAnswered = 0;
      for (let option of this.dailyQuestion.options) {
        this.dailyQuestion.totalAnswered += option.selected;
      }
      this.dailyInterestingFact = dailyInterestingFact;
    })

    this.service.getDictionary().subscribe(
      (dictionary: any) => {
        this.dictionary = dictionary;
        this.totalWords = this.dictionary.length;
        this.updateWords();
      }
    )
  }

  optionClick(index: number) {
    this.service.dailyQuestionAnswer(this.dailyQuestion.options[index].id).subscribe(
      () => {
        this.dailyQuestion.options[index].selected++;
        this.dailyQuestion.totalAnswered++;
        this.dailyQuestion.isAnswered = true;
      }
    )
  }

  updateWords() {
    this.selectedWords.splice(0, this.selectedWords.length);
    if (this.searchText.length > 1) {
      this.dictionary.forEach(word => {
        if (word.word.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1 ||
          word.meaning.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1) {
          this.selectedWords.push(word);
        }
      });
    } else {
      let start = this.pageSize * (this.pageNumber - 1);
      let end = Math.min(start + this.pageSize, this.dictionary.length - 1);
      for (let i = start; i <= end; i++) {
        this.selectedWords.push(this.dictionary[i]);
      }
    }
  }

}
