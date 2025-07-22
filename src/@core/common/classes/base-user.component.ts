import { Component, inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService, AuthUser } from '@auth';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
  standalone: true
})
export class BaseUserComponent implements OnDestroy {
  public currentUser: AuthUser;
  protected authService = inject(AuthService);
  protected _unsubscribeAll = new Subject();

  constructor() {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: AuthUser | null) => {
        this.currentUser = user;
        this.afterChangeCurrentUser(user);
      }
    );
  }

  afterChangeCurrentUser(currentUser: AuthUser) {}

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
