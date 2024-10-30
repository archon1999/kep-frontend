import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { scrollTo } from '@shared/utils';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CoreCommonModule, NgbDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent extends BaseComponent implements OnInit {
  public navbarClass = '';
  protected readonly window = window;

  ngOnInit() {
    interval(1000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        const el = document.getElementById('navbar');
        if (window.scrollY > 10) {
          el.classList.add('navbar-active');
        } else {
          el.classList.remove('navbar-active');
        }
      }
    );
  }

  switchMode() {
    this.coreConfigService.setConfig({
      layout: {
        skin: this.isDarkMode ? 'default' : 'dark'
      }
    }, { emitEvent: false });
    location.reload();
  }

  scrollTo(tagName: string) {
    scrollTo(document.getElementsByTagName(tagName)[0]);
  }
}
