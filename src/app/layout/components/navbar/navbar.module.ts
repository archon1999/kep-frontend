import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from 'core/common.module';
import { CoreTouchspinModule } from 'core/components/core-touchspin/core-touchspin.module';

import { NavbarComponent } from 'app/layout/components/navbar/navbar.component';
import { NavbarBookmarkComponent } from 'app/layout/components/navbar/navbar-bookmark/navbar-bookmark.component';
import { NavbarSearchComponent } from 'app/layout/components/navbar/navbar-search/navbar-search.component';

import { NavbarNotificationComponent } from 'app/layout/components/navbar/navbar-notification/navbar-notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarKepcoinComponent } from './navbar-kepcoin/navbar-kepcoin.component';
import { CoreDirectivesModule } from 'core/directives/directives';
import { NavbarDailyTasksComponent } from './navbar-daily-tasks/navbar-daily-tasks.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgScrollbar } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarSearchComponent,
    NavbarBookmarkComponent,
    NavbarNotificationComponent,
    NavbarKepcoinComponent,
    NavbarDailyTasksComponent
  ],
  imports: [
    RouterModule,
    NgbModule,
    CoreCommonModule,
    CoreTouchspinModule,
    TranslateModule,
    NgbPopoverModule,
    CoreDirectivesModule,
    KepPaginationComponent,
    NgScrollbar
  ],
  exports: [
    NavbarComponent,
  ]
})
export class NavbarModule {}
