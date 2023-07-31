import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { SwiperComponent } from 'ngx-useful-swiper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import { Blog } from '../blog/blog.models';
import { Contest } from '../contests/contests.models';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public isMenuToggled: boolean;
  public isMenuCollapsed: boolean;

  public postsSwiperConfig: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    lazy: true,
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 50
      },
    }
  };

  public contestsSwiperConfig: SwiperOptions = {
    slidesPerView: 1,
    pagination: { el: '.swiper-pagination', clickable: true },
    lazy: true,
    spaceBetween: 30
  };

  public chartTheme: {
    mode: string,
  };

  @ViewChild('postsSwiper') postsSwiper: SwiperComponent;
  @ViewChild('contestsSwiper') contestsSwiper: SwiperComponent;

  @ViewChild('audio') audio: any;

  public lastContests: Array<Contest> = [];
  public contestsCurrentPage = 1;

  public lastPosts: Array<Blog> = [];
  public lastPostsPage = 1;

  public topUsers: Array<User> = [];

  public coreConfig: CoreConfig;

  public today: number = Date.now();
  public days = Math.trunc((Date.now() - new Date('2021-07-07').valueOf()) / 1000 / 60 / 60 / 24);

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public service: HomeService,
    public authService: AuthenticationService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.audio.nativeElement.play();
    }, 100);

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: any) => {
        this.coreConfig = config;
        this.isMenuCollapsed = this.coreConfig.layout.menu.collapsed;
        if (this.coreConfig.layout.type === 'horizontal') {
          this.isMenuToggled = false;
        } else {
          this.isMenuToggled = true;
        }

        if(config.layout.skin == 'dark'){
          this.chartTheme = {
            mode: 'dark',
          }
        } else {
          this.chartTheme = {
            mode: 'light',
          }
        }
      });


    this.service.getLastPosts(1, 3)
      .subscribe((result: any) => {
        this.lastPosts = result.data;
        this.postsSwiper.swiper.on('slideChange', () => {
          var index = this.postsSwiper.swiper.realIndex;
          if (index + 2 >= this.lastPosts.length && index < 50) {
            this.lastPostsPage++;
            this.service.getLastPosts(this.lastPostsPage, 3)
              .subscribe((result: any) => {
                for (let post of result.data) {
                  this.lastPosts.push(post);
                }
              })
          }
        });
      });

    this.service.getContests(1, 3)
      .subscribe((result: any) => {
        this.lastContests = result.data.sort((ca, cb) => {
          if(ca.status != cb.status){
            return +(ca.status < cb.status);
          } else {
            if(ca.status == -1){
              return -(ca.startTime < cb.startTime);
            } else {
              return +(ca.startTime < cb.startTime);
            }
          }
        }).map(contest => Contest.fromJSON(contest));
        this.contestsSwiper.swiper.on('slideChange', () => {
          var index = this.contestsSwiper.swiper.realIndex;
          if (index + 1 == this.lastContests.length && index < 15) {
            this.contestsCurrentPage++;
            this.service.getContests(this.contestsCurrentPage+2, 1)
              .subscribe((result: any) => {
                for (let contest of result.data) {
                  this.lastContests.push(contest);
                }
              })
          }
        });
      });

    this.service.getTopUsers()
      .subscribe((result: any) => {
        this.topUsers = result;
      })

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
