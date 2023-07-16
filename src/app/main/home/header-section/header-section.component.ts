import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 } ),
  ],
})
export class HeaderSectionComponent implements OnInit, OnDestroy {

  public currentUser: User;

  public layoutColor = '#161d31';

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30
  }

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
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
