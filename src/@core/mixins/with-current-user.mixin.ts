import { Component, inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService, User } from '@auth';
import { takeUntil } from 'rxjs/operators';

export type WithCurrentUserType = {
  currentUser: User;
  afterChangeCurrentUser(currentUser: User): void;
};

export function WithCurrentUserMixin<T extends Constructor<Component>>(Base: T) {
  @Component({
    template: '',
    standalone: true
  })
  class WithCurrentUserClass extends Base implements WithCurrentUserType, OnDestroy {
    public currentUser: User;
    protected authService = inject(AuthService);
    protected _unsubscribeAll = new Subject();

    constructor(...args: any[]) {
      super(...args);
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

  return WithCurrentUserClass;
}

type Constructor<T = {}> = new (...args: any[]) => T;
