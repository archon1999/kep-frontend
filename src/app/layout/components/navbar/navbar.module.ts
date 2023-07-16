import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { CoreCommonModule } from '@core/common.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { NavbarComponent } from 'app/layout/components/navbar/navbar.component';
import { NavbarBookmarkComponent } from 'app/layout/components/navbar/navbar-bookmark/navbar-bookmark.component';
import { NavbarSearchComponent } from 'app/layout/components/navbar/navbar-search/navbar-search.component';

import { NavbarNotificationComponent } from 'app/layout/components/navbar/navbar-notification/navbar-notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarKepcoinComponent } from './navbar-kepcoin/navbar-kepcoin.component';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NavbarDailyTasksComponent } from './navbar-daily-tasks/navbar-daily-tasks.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [NavbarComponent, NavbarSearchComponent, NavbarBookmarkComponent, NavbarNotificationComponent, NavbarKepcoinComponent, NavbarDailyTasksComponent],
  imports: [RouterModule, NgbModule, CoreCommonModule, PerfectScrollbarModule, CoreTouchspinModule, TranslateModule, NgbPopoverModule, CoreDirectivesModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [NavbarComponent]
})
export class NavbarModule {}
