import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Arena, ArenaPlayer, ArenaStatus } from '@arena/arena.models';
import { ArenaService } from '@arena/arena.service';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { CoreCommonModule } from '@core/common.module';
import { BaseTablePageComponent } from '@app/common';
import { interval, Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { takeUntil } from 'rxjs/operators';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'arena-players',
  standalone: true,
  imports: [
    ChallengesUserViewComponent,
    KepPaginationComponent,
    KepTableComponent,
    CoreCommonModule,
  ],
  templateUrl: './arena-players.component.html',
  styleUrl: './arena-players.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class ArenaPlayersComponent extends BaseTablePageComponent<ArenaPlayer> implements OnInit {
  @Input() arena: Arena;
  @Output() arenaPlayerClick = new EventEmitter<ArenaPlayer>();

  override defaultPageSize = 10;
  override maxSize = 5;
  override pageOptions = [10, 20, 50];

  private service = inject(ArenaService);

  get arenaPlayers(): ArenaPlayer[] {
    return this.pageResult?.data || [];
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.arena.status === ArenaStatus.Already) {
      interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
        () => {
          this.reloadPage();
        }
      );
    }
  }

  getPage(): Observable<PageResult<ArenaPlayer>> {
    return this.service.getArenaPlayers(this.arena.id, this.pageable);
  }
}
