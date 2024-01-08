import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CoreConfigService } from 'core/services/config.service';
import { CoreMenuService } from 'core/components/core-menu/core-menu.service';
import { CoreSidebarService } from 'core/components/core-sidebar/core-sidebar.service';
import { CoreCommonModule } from '@core/common.module';
import { NgScrollbar } from 'ngx-scrollbar';
import { CoreMenuComponent } from '@core/components/core-menu/core-menu.component';

@Component({
  selector: 'vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    NgScrollbar,
    CoreMenuComponent,
  ]
})
export class VerticalMenuComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  isCollapsed: boolean;
  isScrolled = false;
  // @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.isCollapsed = this._coreSidebarService.getSidebarRegistry('menu').collapsed;

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        if (this._coreSidebarService.getSidebarRegistry('menu')) {
          this._coreSidebarService.getSidebarRegistry('menu').close();
        }
      });

    // this._router.events
    //   .pipe(
    //     filter(event => event instanceof NavigationEnd),
    //     take(1)
    //   )
    //   .subscribe(() => {
    //     setTimeout(() => {
    //       this.directiveRef.scrollToElement('.navigation .active', -180, 500);
    //     });
    //   });

    // Get current menu
    this._coreMenuService.onMenuChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.menu = this._coreMenuService.getCurrentMenu();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  toggleSidebar(): void {
    this._coreSidebarService.getSidebarRegistry('menu').toggleOpen();
  }

  toggleSidebarCollapsible(): void {
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.isCollapsed = config.layout.menu.collapsed;
      });

    if (this.isCollapsed) {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: false } } }, { emitEvent: true });
    } else {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: true } } }, { emitEvent: true });
    }
  }
}
