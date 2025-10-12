import { Component, OnInit } from '@angular/core';
import { Arena } from '@arena/arena.models';
import { ArenaService } from '@arena/arena.service';
import { CoreCommonModule } from '@core/common.module';
import { ArenaListCardComponent } from '@arena/components/arena-list-card/arena-list-card.component';
import { BaseTablePageComponent } from '@core/common';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ArenaListCardComponent,
    ContentHeaderModule,
    KepPaginationComponent,
    NgxSkeletonLoaderModule,
    KepCardComponent,
    ReactiveFormsModule,
  ]
})
export class ArenaComponent extends BaseTablePageComponent<Arena> implements OnInit {

  public searchControl = new FormControl();

  constructor(public service: ArenaService) {
    super();
  }

  get arenaList() {
    return this.pageResult?.data;
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

  getPage(): Observable<PageResult<Arena>> {
    return this.service.getArenaAll({
      ...this.pageable,
      title: this.searchControl.value,
    });
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
