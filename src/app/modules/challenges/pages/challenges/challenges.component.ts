import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInLeftAnimation, fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightAnimation, fadeInRightOnEnterAnimation, fadeInUpAnimation, fadeInUpOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AuthenticationService } from '../../../../auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../users/users.models';
import { Challenge, ChallengeCall, ChallengesRating } from '../../models/challenges.models';
import { ChallengesService } from '../../services/challenges.service';

interface NewChallengeCall {
  timeSeconds: number;
  questionsCount: number;
}

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
  animations: [
    fadeOutOnLeaveAnimation(),
    fadeInOnEnterAnimation(),
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
  ],
})
export class ChallengesComponent implements OnInit, OnDestroy {
  public challengesRating: Array<ChallengesRating> = [];
  public challengeCalls: Array<ChallengeCall> = [];
  public challenges: Array<Challenge> = [];
  public myChallenges: boolean = false;

  public newChallengeCall: NewChallengeCall = {
    timeSeconds: 40,
    questionsCount: 6,
  }

  public currentUser: User;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public service: ChallengesService,
    public authService: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )

    this.service.getChallengesRating(1).subscribe(
      (result: any) => {
        this.challengesRating = result.data;
      }
    )

    this.updateChallengeCalls();
    this._intervalId = setInterval(() => this.updateChallengeCalls(), 5000)

    this.updateChallenges();
  }

  updateChallenges(){
    let username = null;
    if(this.myChallenges){
      username = this.currentUser?.username;
    }
    this.service.getChallenges(1, username).subscribe(
      (result: any) => {
        this.challenges = result.data;
      }
    )
  }

  updateChallengeCalls(){
    this.service.getChallengeCalls().subscribe(
      (challengeCalls: Array<ChallengeCall>) => {
        for(let i = 0; i < this.challengeCalls.length; i++){
          if(!challengeCalls.find((value: ChallengeCall) => value.id == this.challengeCalls[i].id)){
            this.challengeCalls.splice(i, 1);
          }
        }
        for(let challengeCall of challengeCalls){
          if(!this.challengeCalls.find((value: ChallengeCall) => value.id == challengeCall.id)){
            this.challengeCalls.push(challengeCall);
          }
        }
      }
    )
  }

  newChallenge(){
    this.service.newChallengeCall(this.newChallengeCall.timeSeconds, this.newChallengeCall.questionsCount).subscribe(
      (result: any) => {
        if(result.success){
          this.updateChallengeCalls();
        }
      }
    )
  }

  onChallengeCallDelete(challengeCallId: number){
    for(let i = 0; i < this.challengeCalls.length; i++){
      if(this.challengeCalls[i].id == challengeCallId){
        this.challengeCalls.splice(i, 1);
      }
    }
  }

  acceptChallengeCall(challengeCallId: number){
    this.service.acceptChallengeCall(challengeCallId).subscribe(
      (result: any) => {
        if(result.success){
          let challengeId = result.challengeId;
          this.router.navigate(['/practice', 'challenges', 'challenge', challengeId]);
        }
      }
    )
  }

  quickStart(timeSeconds: number, questionsCount: number){
    for(let challengeCall of this.challengeCalls){
      if(challengeCall.timeSeconds == timeSeconds && challengeCall.questionsCount == questionsCount){
        if(challengeCall.username != this.currentUser.username){
          this.acceptChallengeCall(challengeCall.id);
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
