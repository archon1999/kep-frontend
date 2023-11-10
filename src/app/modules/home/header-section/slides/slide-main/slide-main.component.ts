import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'slide-modules',
  templateUrl: './slide-main.component.html',
  styleUrls: ['./slide-main.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 } ),
  ],
})
export class SlideMainComponent implements OnInit {

  public currentUser: User;

  public layoutColor = '#161d31';

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
