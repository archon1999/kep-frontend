import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseTablePageComponent } from '@core/common';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { CoreCommonModule } from '@core/common.module';
import {
  TournamentListCardComponent
} from '@app/modules/tournaments/ui/components/tournament-list-card/tournament-list-card.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TournamentsApiService } from "@app/modules/tournaments/data-access/tournaments-api.service";
import { Tournament } from "@app/modules/tournaments/domain";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'page-tournaments',
  templateUrl: './tournaments-list.page.html',
  styleUrls: ['./tournaments.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    TournamentListCardComponent,
    ContentHeaderModule,
    KepPaginationComponent,
    NgxSkeletonLoaderModule,
    KepCardComponent,
    ReactiveFormsModule,
  ]
})
export class TournamentsListPage extends BaseTablePageComponent<Tournament> implements OnInit {
  protected tournamentsApiService = inject(TournamentsApiService);

  public searchControl = new FormControl();

  get tournaments() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Tournament>> {
    return this.tournamentsApiService.getTournaments({
      ...this.pageable,
      title: this.searchControl.value,
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.searchControl.valueChanges.pipe(
      takeUntil(this._unsubscribeAll),
      debounceTime(1000),
    ).subscribe(() => {
      this.pageNumber = this.defaultPageNumber;
      this.reloadPage();
    });
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
