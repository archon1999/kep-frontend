import { Component, inject, Input } from '@angular/core';
import {
  ArenaPlayerStatisticsComponent
} from '@arena/components/arena-player-statistics/arena-player-statistics.component';
import { Arena, ArenaPlayerStatistics, toArenaPlayerStatistics } from '@arena/arena.models';
import { bounceOnEnterAnimation } from 'angular-animations';
import { ArenaService } from '@arena/arena.service';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'arena-winners',
  standalone: true,
  imports: [
    ArenaPlayerStatisticsComponent,
    SpinnerComponent
  ],
  templateUrl: './arena-winners.component.html',
  styleUrl: './arena-winners.component.scss',
  animations: [
    bounceOnEnterAnimation({anchor: 'bounce3', delay: 1000, duration: 1000}),
    bounceOnEnterAnimation({anchor: 'bounce2', delay: 2000, duration: 1000}),
    bounceOnEnterAnimation({anchor: 'bounce1', delay: 3000, duration: 1000}),
  ]
})
export class ArenaWinnersComponent extends BaseLoadComponent<ArenaPlayerStatistics[]> {
  @Input() arena: Arena;

  private service = inject(ArenaService);

  get top3() {
    return this.data;
  }

  getData(): Observable<ArenaPlayerStatistics[]> {
    return this.service.getTop3(this.arena.id).pipe(
      map((stats: Array<ArenaPlayerStatistics>) => stats.map(toArenaPlayerStatistics))
    );
  }
}
