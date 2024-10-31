import { Component, OnDestroy, OnInit, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

// import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '@auth';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreMediaService } from '@core/services/media.service';

import { User } from '@auth';

import { Router } from '@angular/router';

import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthModalComponent } from '@app/modules/auth/auth-modal/auth-modal.component';
import { ApiService } from 'app/shared/services/api.service';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NavbarDailyTasksComponent } from '@layout/components/navbar/navbar-daily-tasks/navbar-daily-tasks.component';
import { NavbarKepcoinComponent } from '@layout/components/navbar/navbar-kepcoin/navbar-kepcoin.component';
import { NavbarNotificationComponent } from '@layout/components/navbar/navbar-notification/navbar-notification.component';
import { coreConfig } from '@app/app.config';

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
    this.coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
      });

    // Toggle Dark skin with prevSkin skin
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
