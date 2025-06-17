import { Component, ElementRef, inject, Renderer2, TemplateRef, } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from "@core/components/header/header.component";
import { FooterComponent } from "@core/components/footer/footer.component";
import { SidebarComponent } from "@core/components/sidebar/sidebar.component";
import { HoverEffectSidebarDirective } from "@core/components/sidebar/directives/hover-effect-sidebar.directive";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SidebarComponent,
    HoverEffectSidebarDirective
  ]
})
export class ContentLayoutComponent {
  lastSegment: any;
  public menuItems!: Menu[];
  private offcanvasService = inject(NgbOffcanvas);

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    public navServices: NavService,
    public renderer: Renderer2
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {position: 'end'});
  }

  clickOnBody() {
    document.querySelector('#cartitemclose')?.classList.remove('show');
    document.querySelector('#header-cart-items-scroll')?.removeAttribute('class');
    // @ts-ignore
    document.querySelector('#notificationitemclose')?.classList.remove('show') || document.querySelector('#notificationitemclose')?.classList.remove('show');
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.removeAttribute(htmlElement, 'data-icon-overlay');

    if (document.documentElement.getAttribute('data-toggled') == 'icon-text-close') {
      this.renderer.removeAttribute(htmlElement, 'data-icon-text');
    }

    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal'
      //  ||document.documentElement.getAttribute('data-nav-layout') == 'vertical'
      //    && window.innerWidth > 992
    ) {
      this.closeMenu();
    }

    const switcher = this.elementRef.nativeElement.querySelector('.switcher');
    if (switcher) {
      this.renderer.removeClass(switcher, 'show');
      document.querySelector('#responsive-overlay')?.classList.add('active');
    } else {
      // this.renderer.addClass('data-toggle', 'close');
      document.querySelector('#responsive-overlay')?.classList.remove('active');
    }
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    if (sidebar) {
      this.renderer.removeClass(sidebar, 'show');
    }

    document.querySelector('#responsive-overlay')?.classList.remove('active');
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }

  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
    });
  }

  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    // html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }

  ngOndistroy() {}
}
