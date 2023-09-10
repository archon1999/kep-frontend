import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../../auth/models';
import { AuthenticationService } from '../../../../auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest, ContestStatus } from '../../contests.models';

@Component({
  selector: 'contests-table',
  templateUrl: './contests-table.component.html',
  styleUrls: ['./contests-table.component.scss', '../../contests.colors.scss'],
})
export class ContestsTableComponent implements OnInit, OnDestroy {

  @Input() contests: Array<Contest>;

  public ContestStatus = ContestStatus;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))  
      .subscribe((user: User) => this.currentUser = user)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
