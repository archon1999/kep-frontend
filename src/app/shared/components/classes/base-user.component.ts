import { Component, inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '@auth/models';
import { AuthService } from '@auth/service';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
  standalone: true
})
export class BaseUserComponent implements OnDestroy {
  public currentUser: User;
  protected authService = inject(AuthService);
  protected _unsubscribeAll = new Subject();

  constructor() {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        this.afterChangeCurrentUser(user);
      }
    );
  }

  afterChangeCurrentUser(currentUser: User) {}

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
