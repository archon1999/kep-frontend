import { Component, inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService, AuthUser } from '@auth';
import { takeUntil } from 'rxjs/operators';

export type WithCurrentUserType = {
  currentUser: AuthUser;
  afterChangeCurrentUser(currentUser: AuthUser): void;
};

export function WithCurrentUserMixin<T extends Constructor<Component>>(Base: T) {
  @Component({
    template: '',
    standalone: true
  })
  class WithCurrentUserClass extends Base implements WithCurrentUserType, OnDestroy {
    public currentUser: AuthUser;
    protected authService = inject(AuthService);
    protected _unsubscribeAll = new Subject();

    constructor(...args: any[]) {
      super(...args);
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

  return WithCurrentUserClass;
}

type Constructor<T = {}> = new (...args: any[]) => T;
