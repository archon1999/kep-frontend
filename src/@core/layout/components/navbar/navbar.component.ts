import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

// import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { CoreMediaService } from '@core/services/media.service';

import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthModalComponent } from '@app/modules/auth/auth-modal/auth-modal.component';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NavbarDailyTasksComponent } from '@layout/components/navbar/navbar-daily-tasks/navbar-daily-tasks.component';
import { NavbarKepcoinComponent } from '@layout/components/navbar/navbar-kepcoin/navbar-kepcoin.component';
import { NavbarNotificationComponent } from '@layout/components/navbar/navbar-notification/navbar-notification.component';
import { coreConfig } from '@app/app.config';
import themeToggleEffects from '@layout/components/navbar/theme-toggle-effects';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    KepIconComponent,
    NavbarDailyTasksComponent,
    NavbarKepcoinComponent,
    NavbarNotificationComponent,
    NgbDropdownModule,
  ]
})
export class NavbarComponent extends BaseComponent implements OnInit, OnDestroy {
  public horizontalMenu: boolean;
  public hiddenMenu: boolean;

  public coreConfig: any;
  public currentSkin: string;
  public prevSkin: string;

  public defaultCoreConfig = coreConfig;

  @HostBinding('class.fixed-top')
  public isFixed = false;

  constructor(
    private _coreMediaService: CoreMediaService,
    private _mediaObserver: MediaObserver,
    public modalService: NgbModal,
  ) {
    super();
  }

  toggleSidebar(key): void {
    this.coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

  toggleDarkSkin() {
    // Get the current skin
    if (!(document as any).startViewTransition) {
      this.switch();
    }
    (document as any).startViewTransition(() => {
      this.switch();
    });
  }

  switch() {
    const themeToggleEffect = this.localStorageService.get('theme-toggle-effect') || 'polygon';
    document.getElementById('toggle-effect-style').textContent = themeToggleEffects[themeToggleEffect];
    setTimeout(() => {
      this.coreConfigService
        .getConfig()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(config => {
          this.currentSkin = config.layout.skin;
        });

      this.prevSkin = localStorage.getItem('prevSkin');

      if (this.currentSkin === 'dark') {
        this.coreConfigService.setConfig(
          { layout: { skin: this.prevSkin ? this.prevSkin : 'default' } },
          { emitEvent: true }
        );
      } else {
        localStorage.setItem('prevSkin', this.currentSkin);
        this.coreConfigService.setConfig({ layout: { skin: 'dark' } }, { emitEvent: true });
      }
    }, 100);
  }

  loginModalOpenForm() {
    this.modalService.open(AuthModalComponent, {
      animation: false,
      centered: true,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl(this.router.url);
  }

  ngOnInit(): void {
    // Subscribe to the config changes
    this.coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
      this.horizontalMenu = config.layout.type === 'horizontal';
      this.hiddenMenu = config.layout.menu.hidden === true;
      this.currentSkin = config.layout.skin;

      // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
      if (this.coreConfig.layout.type === 'vertical') {
        setTimeout(() => {
          if (this.coreConfig.layout.navbar.type === 'fixed-top') {
            this.isFixed = true;
          }
        }, 0);
      }
    });

    // Horizontal Layout Only: Add class fixed-top to navbar below large screen
    if (this.coreConfig.layout.type === 'horizontal') {
      // On every media(screen) change
      this._coreMediaService.onMediaUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
        this.isFixed = !isFixedTop;
      });
    }
  }
}
