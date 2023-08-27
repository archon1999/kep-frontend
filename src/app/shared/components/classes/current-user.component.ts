import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "app/auth/models";
import { AuthenticationService } from "app/auth/service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  template: '',
})
export class CurrentUser implements OnInit, OnDestroy {

  public currentUser: User | null;

  protected _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();    
    this._unsubscribeAll.complete();    
  }

}
