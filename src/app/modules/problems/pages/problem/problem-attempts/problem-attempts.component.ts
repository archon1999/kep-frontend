import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '../../../models/attempts.models';
import { Problem } from '../../../models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem-attempts',
  templateUrl: './problem-attempts.component.html',
  styleUrls: ['./problem-attempts.component.scss']
})
export class ProblemAttemptsComponent implements OnInit {

  @Input() problem: Problem;
  @Input() submitEvent: Observable<void>;

  @Output() hackSubmitted = new EventEmitter<null>;

  public attempts: Array<Attempt> = [];
  public totalAttemptsCount = 0;
  public currentPage = 1;
  public myAttempts = true;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.currentUser = user;
      });

    this.submitEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.reloadAttempts());

    this.reloadAttempts();
  }

  reloadAttempts() {
    if (this.myAttempts && this.currentUser) {
      this.service.getUserProblemAttempts(this.currentUser.username, this.problem.id, this.currentPage, 10)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        });
    } else {
      this.service.getProblemAttempts(this.problem.id, this.currentPage, 10)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        });
    }
  }

}
