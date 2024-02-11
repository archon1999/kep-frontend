import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation
} from 'angular-animations';
import { Arena } from '@arena/arena.models';
import { ArenaService } from '@arena/arena.service';
import { CoreCommonModule } from '@core/common.module';
import { ArenaListCardComponent } from '@arena/components/arena-list-card/arena-list-card.component';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { coreConfig } from '@app/app.config';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeInOnEnterAnimation(),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ArenaListCardComponent,
    ContentHeaderModule,
    KepPaginationComponent,
  ],
  encapsulation: ViewEncapsulation.None
})
export class ArenaComponent extends BaseTablePageComponent<Arena> implements OnInit {

  constructor(public service: ArenaService) {
    super();
  }

  get arenaList() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Arena>> {
    return this.service.getArenaAll(this.pageable);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Arena',
      breadcrumb: {
        links: [
          {
            name: coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
