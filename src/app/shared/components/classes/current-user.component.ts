import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
})
// tslint:disable-next-line:component-class-suffix
export class CurrentUser implements OnInit, OnDestroy {

  public currentUser: User | null;

  protected _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        console.log(user);
        this.currentUser = user;
      }
    );
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
