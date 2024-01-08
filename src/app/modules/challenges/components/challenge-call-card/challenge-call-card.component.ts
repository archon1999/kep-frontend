import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../auth/models';
import { AuthService } from '../../../../auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChallengeCall } from '../../models/challenges.models';
import { ChallengesApiService } from '../../services/challenges-api.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'challenge-call-card',
  templateUrl: './challenge-call-card.component.html',
  styleUrls: ['./challenge-call-card.component.scss']
})
export class ChallengeCallCardComponent implements OnInit, OnDestroy {

  @Input() challengeCall: ChallengeCall;
  @Output() delete = new EventEmitter<void>();

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public service: ChallengesApiService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
  }

  deleteChallengeCall(){
    this.service.deleteChallengeCall(this.challengeCall.id).subscribe(
      (result: any) => {
        if(result.success){
          this.delete.next(null);
        }
      }
    )
  }

  acceptChallengeCall(){
    this.service.acceptChallengeCall(this.challengeCall.id).subscribe(
      (result: any) => {
        if(result.success){
          let challengeId = result.challengeId;
          this.router.navigate(['/practice', 'challenges', 'challenge', challengeId]);
        }
      }
    )
  }

  ngOnDestroy(): void {
    
  }
  
}
