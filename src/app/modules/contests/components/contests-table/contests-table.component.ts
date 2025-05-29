import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService, AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contests-table',
  templateUrl: './contests-table.component.html',
  styleUrls: ['./contests-table.component.scss'],
  standalone: false,
})
export class ContestsTableComponent implements OnInit, OnDestroy {

  @Input() contests: Array<Contest>;

  public ContestStatus = ContestStatus;

  public currentUser: AuthUser;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: AuthUser) => this.currentUser = user);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
