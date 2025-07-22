import { Component } from '@angular/core';
import { BasePageComponent } from '@core/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  standalone: true,
  imports: [
    ContentHeaderModule,
    NgbNav,
    CoreDirectivesModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    TranslatePipe
  ]
})
export class AccountSettingsComponent extends BasePageComponent {
  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'SETTINGS',
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.currentUser?.username,
            isLink: false,
          },
        ]
      }
    };
  }
}
