import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { SwiperComponent } from 'ngx-useful-swiper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public startAnimationState = false;
  public slideMainAnimationState = false;
  public slideLearnAnimationState = false;
  public slidePracticeAnimationState = false;
  public slideCompetitionsAnimationState = false;
  public slideStatisticsAnimationState = false;

  public activeSlide = 0;

  public isDarkSkin: boolean = false;
  public appName: string;

  private _unsubscribeAll = new Subject();

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    lazy: true,
    navigation: {

    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    a11y: {
      enabled: false,
    },
  };

  @ViewChild('swiper') swiper: SwiperComponent;

  public windowHeight: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public coreConfigService: CoreConfigService,
  ) {
    this.updateWindowHeight();
    this.coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.startAnimationState = true;
      this.slideMainAnimationState = true;
    }, 0);

    this.coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.isDarkSkin = config.layout.skin == 'dark';
        this.appName = config.app.appName;
      }
    )

    setTimeout(() => {
      this.swiper.swiper.on('slideChange', () => {
        var index = this.swiper.swiper.realIndex;
        this.activeSlide = index;
        if(index == 0){
          this.slideMainAnimationState = false;
          setTimeout(() => this.slideMainAnimationState = true, 0);
        } else if(index == 1){
          this.slideLearnAnimationState = false;
          setTimeout(() => this.slideLearnAnimationState = true, 0);
        } else if(index == 2){
          this.slidePracticeAnimationState = false;
          setTimeout(() => this.slidePracticeAnimationState = true, 0);
        } else if(index == 3){
          this.slideCompetitionsAnimationState = false;
          setTimeout(() => this.slideCompetitionsAnimationState = true, 0);
        } else if(index == 4){
          this.slideStatisticsAnimationState = false;
          setTimeout(() => this.slideStatisticsAnimationState = true, 0);
        }
      })
    }, 100)
  }

  slideTo(index: number){
    this.swiper.swiper.slideTo(index);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateWindowHeight();
  }

  updateWindowHeight(){
    this.windowHeight = Math.max(600, window.innerHeight - 1);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
