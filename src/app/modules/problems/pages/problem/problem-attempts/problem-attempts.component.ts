import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { Problem } from '@problems/models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { CoreCommonModule } from '@core/common.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';

@Component({
  selector: 'problem-attempts',
  templateUrl: './problem-attempts.component.html',
  styleUrls: ['./problem-attempts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, AttemptsTableModule, KepPaginationComponent],
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
