import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contests-table',
  templateUrl: './contests-table.component.html',
  styleUrls: ['./contests-table.component.scss'],
})
export class ContestsTableComponent implements OnInit, OnDestroy {

  @Input() contests: Array<Contest>;

  public ContestStatus = ContestStatus;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => this.currentUser = user);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
