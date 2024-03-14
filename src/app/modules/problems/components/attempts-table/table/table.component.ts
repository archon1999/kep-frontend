import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bounceAnimation, fadeInOnEnterAnimation, shakeAnimation } from 'angular-animations';
import { AuthService, User } from '@auth';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Attempt } from '../../../models/attempts.models';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    bounceAnimation({ duration: 2000 }),
    shakeAnimation({ duration: 2000 }),
    fadeInOnEnterAnimation(),
  ]
})
export class TableComponent implements OnInit {
  @Input() contest: Contest;
  @Input() hideSourceCodeSize = false;
  @Input() attempts: Array<Attempt> = [];
  @Output() clicked = new EventEmitter<number>();

  public currentUser: User | null;

  constructor(
    public authService: AuthService,
    public service: ProblemsApiService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  rerun(attemptId: number) {
    this.service.attemptRerun(attemptId).subscribe(() => {});
  }

  onPurchaseSuccess(attempt: Attempt) {
    attempt.canView = true;
  }

  onPurchaseTestSuccess(attempt: Attempt) {
    attempt.canTestView = true;
  }
  isOwner(attempt: Attempt) {
    if (attempt?.user?.username === this.currentUser?.username) {
      return true;
    }
    if (attempt.team && attempt.team.members.filter(member => member.username === this.currentUser?.username).length) {
      return true;
    }
    return false;
  }
}
