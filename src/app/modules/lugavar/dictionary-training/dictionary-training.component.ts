import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { randomInt } from '../../../shared/utils/random';
import { ToastrService } from 'ngx-toastr';
import { DictionaryWord } from '../lugavar.models';

@Component({
  selector: 'dictionary-training',
  templateUrl: './dictionary-training.component.html',
  styleUrls: ['./dictionary-training.component.scss'],
  standalone: false,
})
export class DictionaryTrainingComponent implements OnInit {

  @Input() dictionary: Array<DictionaryWord> = [];

  public questionBody: string = "";
  public questionOptions = [];
  public correctAnswerIndex: number;
  public singleRadio: number;
  public score = 0;
  public all = 0;

  public correctText: string;
  public inCorrectText: string;

  constructor(
    public toastr: ToastrService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.makeRandomQuestion();
    this.translateService.get('CorrectAnswer').subscribe(
      (text: string) => {
        this.correctText = text;
      }
    )

    this.translateService.get('IncorrectAnswer').subscribe(
      (text: string) => {
        this.inCorrectText = text;
      }
    )
  }

  makeRandomQuestion() {
    let randomIndex = randomInt(0, this.dictionary.length - 1);
    let randomKeyword = this.dictionary[randomIndex];
    this.questionBody = randomKeyword.meaning;
    this.questionOptions = [];
    while (this.questionOptions.length != 4) {
      let randomIndex = randomInt(0, this.dictionary.length - 1);
      if (this.dictionary[randomIndex].word == randomKeyword.word) continue;
      if (this.questionOptions.indexOf(this.dictionary[randomIndex].word) != -1) continue;
      this.questionOptions.push(this.dictionary[randomIndex].word);
    }
    if (Math.random() < 0.8) {
      this.questionOptions.push(randomKeyword.word);
    } else {
      this.questionOptions.push("To`g`ri javob keltirilmagan")
    }
    randomIndex = randomInt(0, 4);
    this.correctAnswerIndex = randomIndex;
    [this.questionOptions[randomIndex], this.questionOptions[4]] = [
      this.questionOptions[4], this.questionOptions[randomIndex]];
  }

  answerCheck() {
    if (this.singleRadio == this.correctAnswerIndex) {
      this.score++;
      this.toastr.success('', this.correctText, );
    } else {
      this.toastr.error('', this.inCorrectText, );
    }
    this.all++;
    this.singleRadio = null;
    this.makeRandomQuestion();
  }

}
