import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../auth/models';
import { AuthenticationService } from '../../../../auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChallengeCall } from '../../models/challenges.models';
import { ChallengesService } from '../../services/challenges.service';

@Component({
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
    public authService: AuthenticationService,
    public service: ChallengesService,
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
          this.delete.next();
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
