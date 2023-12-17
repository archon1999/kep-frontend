import { DOCUMENT, registerLocaleData } from '@angular/common';
import { Component, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import * as Waves from 'node-waves';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from 'core/components/core-menu/core-menu.service';
import { CoreConfigService } from 'core/services/config.service';
import { CoreLoadingScreenService } from 'core/services/loading-screen.service';
import { CoreTranslationService } from 'core/services/translation.service';

import { locale as menuEnglish } from 'app/i18n/en';
import { locale as menuRussian } from 'app/i18n/ru';
import { locale as menuUzbek } from 'app/i18n/uz';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import localeUz from '@angular/common/locales/uz';

import { menu } from '@layout/components/menu/menu';

import { ApiService } from '@shared/services/api.service';
import { AuthenticationService } from '@auth/service';
import { WebsocketService } from '@shared/services/websocket';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { isPresent } from '@shared/c-validators/utils';
import { SwipeService } from '@shared/services/swipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  appLanguage = this._translateService.getBrowserLang(); // Set application default language i.e fr
  defaultTouch = { x: 0, y: 0, time: 0 };

  @HostBinding('@.disabled')
  public animationsDisabled = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _title: Title,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    public _coreConfigService: CoreConfigService,
    private _coreLoadingScreenService: CoreLoadingScreenService,
    private _coreMenuService: CoreMenuService,
    private _coreTranslationService: CoreTranslationService,
    private _translateService: TranslateService,
    private api: ApiService,
    public router: Router,
    private authService: AuthenticationService,
    public wsService: WebsocketService,
    public swipeService: SwipeService,
  ) {
    this.menu = menu;

    this._coreMenuService.register('main', this.menu);

    this._coreMenuService.setCurrentMenu('main');

    this._translateService.addLangs(['en', 'ru', 'uz']);

    let browserLang = this._translateService.getBrowserLang();
    if (!_translateService.langs.includes(browserLang)) {
      browserLang = 'en';
    }
    this._translateService.setDefaultLang(browserLang);

    this._coreTranslationService.translate(menuEnglish, menuRussian, menuUzbek);

    this._unsubscribeAll = new Subject();
  }

  setLanguage(language: string): void {
    this.api.post('set-language/', { language: language }).subscribe();
  }

  ngOnInit(): void {
    // Init wave effect (Ripple effect)
    Waves.init();

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      if (!isPresent(config.layout.enableAnimation)) {
        this._coreConfigService.setConfig({ layout: { enableAnimation: true } });
      }
      this.animationsDisabled = !config.layout.enableAnimation;
      this.coreConfig = config;

      // Set application default language.

      // Change application language? Read the ngxTranslate Fix

      // ? Use app-config.ts file to set default language
      let appLanguage = this.coreConfig.app.appLanguage || this._translateService.getBrowserLang();
      if (!this._translateService.langs.includes(appLanguage)) {
        appLanguage = 'en';
      }
      this._translateService.use(appLanguage);

      setTimeout(() => {
        this._translateService.setDefaultLang(appLanguage);
        if (environment.production) {
          this.setLanguage(appLanguage);
        }
      });

      this._elementRef.nativeElement.classList.remove(
        'vertical-layout',
        'vertical-menu-modern',
        'horizontal-layout',
        'horizontal-menu'
      );

      if (this.coreConfig.layout.type === 'vertical') {
        this._elementRef.nativeElement.classList.add('vertical-layout', 'vertical-menu-modern');
      } else if (this.coreConfig.layout.type === 'horizontal') {
        this._elementRef.nativeElement.classList.add('horizontal-layout', 'horizontal-menu');
      }

      this._elementRef.nativeElement.classList.remove(
        'navbar-floating',
        'navbar-static',
        'navbar-sticky',
        'navbar-hidden'
      );

      if (this.coreConfig.layout.navbar.type === 'navbar-static-top') {
        this._elementRef.nativeElement.classList.add('navbar-static');
      } else if (this.coreConfig.layout.navbar.type === 'fixed-top') {
        this._elementRef.nativeElement.classList.add('navbar-sticky');
      } else if (this.coreConfig.layout.navbar.type === 'floating-nav') {
        this._elementRef.nativeElement.classList.add('navbar-floating');
      } else {
        this._elementRef.nativeElement.classList.add('navbar-hidden');
      }
      this._elementRef.nativeElement.classList.remove('footer-fixed', 'footer-static', 'footer-hidden');

      if (this.coreConfig.layout.footer.type === 'footer-sticky') {
        this._elementRef.nativeElement.classList.add('footer-fixed');
      } else if (this.coreConfig.layout.footer.type === 'footer-static') {
        this._elementRef.nativeElement.classList.add('footer-static');
      } else {
        this._elementRef.nativeElement.classList.add('footer-hidden');
      }

      if (
        this.coreConfig.layout.menu.hidden &&
        this.coreConfig.layout.navbar.hidden &&
        this.coreConfig.layout.footer.hidden
      ) {
        this._elementRef.nativeElement.classList.add('blank-page');
        // ! Fix: Transition issue while coming from blank page
        this._renderer.setAttribute(
          this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
          'style',
          'transition:none'
        );
      } else {
        this._elementRef.nativeElement.classList.remove('blank-page');
        // ! Fix: Transition issue while coming from blank page
        setTimeout(() => {
          this._renderer.setAttribute(
            this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
            'style',
            'transition:300ms ease all'
          );
        }, 0);
        // If navbar hidden
        if (this.coreConfig.layout.navbar.hidden) {
          this._elementRef.nativeElement.classList.add('navbar-hidden');
        }
        // Menu (Vertical menu hidden)
        if (this.coreConfig.layout.menu.hidden) {
          this._renderer.setAttribute(this._elementRef.nativeElement, 'data-col', '1-column');
        } else {
          this._renderer.removeAttribute(this._elementRef.nativeElement, 'data-col');
        }
        // Footer
        if (this.coreConfig.layout.footer.hidden) {
          this._elementRef.nativeElement.classList.add('footer-hidden');
        }
      }

      // Skin Class (Adding to body as it requires highest priority)
      if (this.coreConfig.layout.skin !== '' && this.coreConfig.layout.skin !== undefined) {
        this.document.body.classList.remove('default-layout', 'bordered-layout', 'dark-layout', 'semi-dark-layout');
        this.document.body.classList.add(this.coreConfig.layout.skin + '-layout');
      }
    });

    this._title.setTitle(this.coreConfig.app.appTitle);

    registerLocaleData(localeUz, 'uz');
    registerLocaleData(localeRu, 'ru');
    registerLocaleData(localeEn, 'en');

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        if (user) {
          this.api.get('my-kepcoin').subscribe(
            (kepcoin: any) => {
              this.authService.updateKepcoin(kepcoin);
            }
          );
        }
      }
    );

    this.wsService.status.pipe(takeUntil(this._unsubscribeAll)).subscribe((status: any) => {
      if (status) {
        this.authService.currentUser
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((user: any) => {
            if (user) {
              this.wsService.send('kepcoin-add', user.username);
              this.wsService.on<number>(`kepcoin-${ user.username }`).subscribe((kepcoin: number) => {
                this.authService.updateKepcoin(kepcoin);
              });
            }
          });
      }
    });
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: any) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      const deltaX = touch.pageX - this.defaultTouch.x;
      const deltaY = touch.pageY - this.defaultTouch.y;
      const deltaTime = event.timeStamp - this.defaultTouch.time;

      const eventValue = {
        pageX: touch.pageX,
        pageY: touch.pageY,
        deltaX: deltaX,
        deltaY: deltaY,
        deltaTime: deltaTime,
      };
      // simulate a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.swipeService.swipeRight.next(eventValue);
          } else {
            this.swipeService.swipeLeft.next(eventValue);
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.swipeService.swipeDown.next(eventValue);
          } else {
            this.swipeService.swipeUp.next(eventValue);
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
