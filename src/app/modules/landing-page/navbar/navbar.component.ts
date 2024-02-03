import { Component } from '@angular/core';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { scrollTo } from '@shared/utils';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CoreCommonModule, NgbDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent extends BaseComponent {
  protected readonly window = window;

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