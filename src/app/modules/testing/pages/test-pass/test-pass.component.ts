import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '@shared/services/title.service';
import { TestingApiService } from '../../testing-api.service';
import Swal from 'sweetalert2';
import { fadeInLeftAnimation, fadeInRightAnimation, fadeInUpAnimation } from 'angular-animations';
import { CoreConfig } from '@core/types';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { randomShuffle } from '@shared/utils';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-test-pass',
  templateUrl: './test-pass.component.html',
  styleUrls: ['./test-pass.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 1500 }),
    fadeInRightAnimation({ duration: 1000 }),
    fadeInUpAnimation({ duration: 1000 }),
  ]
})
export class TestPassComponent implements OnInit, OnDestroy {
  public startAnimationState = false;

  public testPass: any;
  public test: any;
  public question: any;
  public questions = [];

  public selectedOption: number;

  public leftTime = 0;
  public conformityGroupOne: Array<string>;
  public conformityGroupTwo: Array<string>;
  public orderingList: Array<string>;

  public editorOptions: any;

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public service: TestingApiService,
    public dragulaService: DragulaService,
    public titleService: TitleService,
    public router: Router,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.dragulaService.createGroup('handle-list', {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });

    setTimeout(() => this.startAnimationState = true, 0);
    this.route.data.subscribe(({ testPass }) => {
      this.testPass = testPass;
      this.titleService.updateTitle(this.route, { testTitle: testPass.test.title })
      this.test = testPass.test;
      let duration = this.test.duration.split(":");
      let time = +duration[0]*60*60 + +duration[1]*60 + +duration[2];
      this.leftTime = time*1000 - (Date.now() - new Date(testPass.started).valueOf());
      this.questions = this.test.questions;
      this.changeQuestion(0);
    })

    this.coreConfigService.getConfig()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config: CoreConfig) => {
      if(config.layout.skin == 'dark'){
        this.editorOptions = {
          theme: 'vs-dark',
          language: 'python',
        }
      } else {
        this.editorOptions = {
          theme: 'vs-light',
          language: 'python',
        }
      }
    })
  }

  changeQuestion(index: number){
    index %= this.questions.length;
    this.question = this.questions[index];
    if(this.question.type == 1){
      this.selectedOption = this.question.options.findIndex((option: any) => option.selected);
    }

    if(this.question.type == 4){
      let a = [], b = [];
      for(let option of this.question.options){
        a.push(option.optionMain);
        b.push(option.optionSecondary);
      }
      this.conformityGroupOne = randomShuffle(a);
      this.conformityGroupTwo = randomShuffle(b);
    } else if(this.question.type == 5){
      this.orderingList = [];
      for(let option of this.question.options){
        this.orderingList.push(option.option);
      }
      this.orderingList = randomShuffle(this.orderingList);
    }
  }

  answerSubmit(){
    let answer: any;
    let isEmpty = false;
    let question = this.question;
    if(this.question.type == 1){
      answer = this.selectedOption;
      if(answer == -1){
        isEmpty = true;
      }
    } else if(this.question.type == 2){
      answer = [];
      for(let i = 0; i < this.question.options.length; i++){
        if(this.question.options[i].selected){
          answer.push(i);
        }
      }
      if(answer.length == 0){
        isEmpty = true;
      }
    } else if(this.question.type == 3 || this.question.type == 7){
      answer = this.question.input;
      if(!answer){
        isEmpty = true;
      }
    }
    if(!isEmpty){
      this.service.answerSubmit(this.testPass.id, this.question.number, answer).subscribe(
        () => {
          question.answered = true;
        }
      )
    }
    this.changeQuestion(this.question.number);
  }

  testPassFinish(){
    this.service.testPassFinish(this.testPass.id).subscribe(
      (data: any) => {
        if(data.success){
          let result = data.result;
          let router = this.router;
          let testId = this.test.id;
          let questionCount = this.questions.length;
          Swal.fire({
            title: 'Test yakunlandi',
            html: `<b>Natija</b>: <span class="text-success">${result}</span>/${questionCount}`,
            icon: 'info',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-success',
            }
          }).then(function (result) {
            router.navigate(['/practice', 'tests', 'test', testId]);
          });      
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('handle-list');
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
