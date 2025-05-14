import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation
} from 'angular-animations';
import { Tournament } from './tournaments.models';
import { TournamentsService } from './tournaments.service';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { CoreCommonModule } from '@core/common.module';
import {
  TournamentListCardComponent
} from '@app/modules/tournaments/tournament-list-card/tournament-list-card.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CoreCommonModule, TournamentListCardComponent, ContentHeaderModule, KepPaginationComponent, NgxSkeletonLoaderModule, KepCardComponent]
})
export class TournamentsComponent extends BaseTablePageComponent<Tournament> implements OnInit {

  constructor(public service: TournamentsService) {
    super();
  }

  getPage(): Observable<PageResult<Tournament>> {
    return this.service.getTournaments();
  }

  get tournaments() {
    return this.pageResult?.data;
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Tournaments',
      breadcrumb: {
        links: [
          {
            name: 'Competitions',
            isLink: false,
          },
          {
            name: 'Tournaments',
            isLink: false,
          },
        ]
      }
    };
  }

}
