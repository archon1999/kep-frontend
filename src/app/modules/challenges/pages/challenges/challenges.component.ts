import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutOnLeaveAnimation
} from 'angular-animations';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { Challenge, ChallengeCall, ChallengesRating } from '../../models/challenges.models';
import { ChallengesService } from '../../services/challenges.service';
import { Chapter } from 'app/modules/testing/testing.models';
import { BaseComponent } from '../../../../shared/components/classes/base.component';
import { PageResult } from '../../../../shared/page-result';

interface NewChallengeCall {
  timeSeconds: number;
  questionsCount: number;
}

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss', '../../challenges.styles.scss'],
  animations: [
    fadeOutOnLeaveAnimation(),
    fadeInOnEnterAnimation(),
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
  ],
})
export class ChallengesComponent extends BaseComponent implements OnInit, OnDestroy {
  public challengeCalls: Array<ChallengeCall> = [];
  public challengeCallsSkeletonVisible = true;

  public challengesRating: Array<ChallengesRating> = [];
  public challengesRatingSkeletonVisible = true;

  public challenges: Array<Challenge> = [];
  public challengesPage = 1;
  public challengesTotal = 0;
  public challengesSkeletonVisible = true;

  public myChallenges = false;

  public chapters: Chapter[] = [];
  public selectedChapters = [];
  public newChallengeCall: NewChallengeCall = {
    timeSeconds: 40,
    questionsCount: 6,
  };

  private _intervalId: any;

  constructor(
    public service: ChallengesService,
    public authService: AuthenticationService,
    public router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.service.getChapters().subscribe(
      (chapters: Array<Chapter>) => {
        this.chapters = chapters;
      }
    );

    this.service.getChallengesRating(1).subscribe(
      (result: any) => {
        this.challengesRatingSkeletonVisible = false;
        this.challengesRating = result.data;
      }
    );

    this.updateChallengeCalls();
    this._intervalId = setInterval(() => this.updateChallengeCalls(), 5000);

    this.updateChallenges();
  }

  updateChallenges() {
    this.service.getChallenges(this.challengesPage, null, 7).subscribe(
      (result: PageResult) => {
        this.challengesSkeletonVisible = false;
        this.challenges = result.data;
        this.challengesTotal = result.total;
      }
    );
  }

  updateChallengeCalls() {
    this.service.getChallengeCalls().subscribe(
      (challengeCalls: Array<ChallengeCall>) => {
        for (let i = 0; i < this.challengeCalls.length; i++) {
          if (!challengeCalls.find((value: ChallengeCall) => value.id === this.challengeCalls[i].id)) {
            this.challengeCalls.splice(i, 1);
          }
        }
        for (const challengeCall of challengeCalls) {
          if (!this.challengeCalls.find((value: ChallengeCall) => value.id === challengeCall.id)) {
            this.challengeCalls.push(challengeCall);
          }
        }
        this.challengeCallsSkeletonVisible = false;
      }
    );
  }

  newChallenge() {
    if (!this.currentUser) {
      this.router.navigateByUrl('login');
      return;
    }

    this.service.newChallengeCall(
      this.newChallengeCall.timeSeconds,
      this.newChallengeCall.questionsCount,
      this.selectedChapters,
    ).subscribe(
      (result: any) => {
        if (result.success) {
          this.updateChallengeCalls();
        }
      }
    );
  }

  onChallengeCallDelete(challengeCallId: number) {
    for (let i = 0; i < this.challengeCalls.length; i++) {
      if (this.challengeCalls[i].id === challengeCallId) {
        this.challengeCalls.splice(i, 1);
      }
    }
  }

  acceptChallengeCall(challengeCallId: number) {
    this.service.acceptChallengeCall(challengeCallId).subscribe(
      (result: any) => {
        if (result.success) {
          const challengeId = result.challengeId;
          this.router.navigate(['/practice', 'challenges', 'challenge', challengeId]);
        }
      }
    );
  }

  quickStart(timeSeconds: number, questionsCount: number) {
    for (const challengeCall of this.challengeCalls) {
      if (challengeCall.timeSeconds === timeSeconds && challengeCall.questionsCount === questionsCount) {
        if (challengeCall.username !== this.currentUser.username) {
          this.acceptChallengeCall(challengeCall.id);
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
