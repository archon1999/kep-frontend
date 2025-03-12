import { Component, ElementRef, HostListener, inject, TemplateRef } from '@angular/core';
import {
  ModalDismissReasons,
  NgbDropdown, NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas
} from '@ng-bootstrap/ng-bootstrap';
import { SwitcherComponent } from '../switcher/switcher.component';
import { AppStateService } from '../../services/app-state.service';
import { BaseComponent } from "@app/common";
import { CoreCommonModule } from "@core/common.module";
import { HeaderNotificationsComponent } from "@core/components/header/notifications/header-notifications.component";
import { HeaderKepcoinComponent } from "@core/components/header/kepcoin/header-kepcoin.component";
import { HeaderDailyTasksComponent } from "@core/components/header/daily-tasks/header-daily-tasks.component";
import { LanguagesComponent } from "@core/components/languages/languages.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    HeaderNotificationsComponent,
    HeaderKepcoinComponent,
    HeaderDailyTasksComponent,
    NgbDropdownMenu,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownItem,
    LanguagesComponent
  ]
})
export class HeaderComponent extends BaseComponent {

  public localdata: any;
  closeResult = '';
// Full Screen event start //
  isFullscreen: boolean = false;
  // cartItemCount: number = 5;
  notificationCount: number = 4;
  isNotifyEmpty: boolean = false;
  //Toggled Shortcuts
  private offcanvasService = inject(NgbOffcanvas);

  constructor(public elementRef: ElementRef) {
    super();
    this.appStateService.state$.subscribe(state => {
      this.localdata = state;
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  togglesidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? 'close'
          : 'detached-close'
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (html?.getAttribute('data-vertical-style') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'double-menu-close' && document.querySelector(".slide.open")?.classList.contains("has-sub") ? 'double-menu-open' : 'double-menu-close');
    }
  }

  toggleFullscreen() {
    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.requestFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreenChange(event: any) {
    this.isFullscreen = this.isFullScreen();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {position: 'end'});
  }

  //Full Screen event close //

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  removeNotify(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.notificationCount--;
    this.isNotifyEmpty = this.notificationCount === 0;
  }

  //Notifications

  toggleSwitcher() {
    this.offcanvasService.open(SwitcherComponent, {
      position: 'end',
      scroll: true,
    });
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  private isFullScreen(): boolean {
    return !!document.fullscreenElement;
  }

  private requestFullscreen() {
    const elem = document.documentElement as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  private exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
