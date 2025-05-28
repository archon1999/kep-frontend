import { Component, OnInit } from '@angular/core';
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
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

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
    NgxSkeletonLoaderModule,
    KepCardComponent,
  ]
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
            name: 'Competitions',
            isLink: false,
          },
          {
            name: 'Arena',
            isLink: false,
          },
        ]
      }
    };
  }
}
