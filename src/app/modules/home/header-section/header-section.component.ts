import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, KepIconComponent],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
  ],
})
export class HeaderSectionComponent implements OnInit, OnDestroy {

  public currentUser: User;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
