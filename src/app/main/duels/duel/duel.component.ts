import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Attempt } from 'app/main/problems/attempts.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Duel, DuelProblem } from '../duels.models';
import { DuelsService } from '../duels.service';

@Component({
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.scss']
})
export class DuelComponent implements OnInit, OnDestroy {

  public duel: Duel;

  public duelProblem: DuelProblem;
  public attempts: Array<Attempt> = [];
  public availableLang: any;
  public selectedLang: string;

  public currentUser: User;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: DuelsService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ duel }) => {
      this.duel = duel;
      if(this.duel.problems){
        this.changeProblem(this.duel.problems[0]);
      }
      this.changeLang(localStorage.getItem('problems-selected-lang')||'py');
      if(this.duel.status == 0){
        this._intervalId = setInterval(
          () => {
            this.reloadResults();
          }, 10000
        )
      }
    })

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
        if(this.duel.isPlayer){
          this.reloadAttempts();
        }
      }
    )
  }

  changeProblem(duelProblem: DuelProblem){
    this.duelProblem = duelProblem;
    if(this.currentUser && this.duel.isPlayer){
      this.reloadAttempts();
    }
  }

  changeLang(lang: string){
    this.selectedLang = lang;
    for(let availableLang of this.duelProblem.problem.availableLanguages){
      if(availableLang.lang == this.selectedLang){
        this.availableLang = availableLang;
      }
    }
    if(!this.availableLang){
      this.availableLang = this.duelProblem.problem.availableLanguages[0];
      this.selectedLang = this.availableLang.lang;
    }
    localStorage.setItem('problems-selected-lang', this.selectedLang);
  }

  reloadAttempts(){
    this.service.getProblemAttempts(this.duel.id, this.duelProblem.symbol, this.currentUser.username).subscribe(
      (result: any) => {
        this.attempts = result.data;
      }
    )
  }

  reloadResults(){
    this.service.getDuelResults(this.duel.id).subscribe(
      (results: any) => {
        let playerFirstBalls = 0;
        let playerSecondBalls = 0;
        for(let i = 0; i < this.duel.problems.length; i++){
          this.duel.problems[i].playerFirstBall = results.playerFirst[i];
          this.duel.problems[i].playerSecondBall = results.playerSecond[i];
          playerFirstBalls += results.playerFirst[i];
          playerSecondBalls += results.playerSecond[i];
        }
        this.duel.playerFirst.balls = playerFirstBalls;
        this.duel.playerSecond.balls = playerSecondBalls;
      }
    )
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId);
    }

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
