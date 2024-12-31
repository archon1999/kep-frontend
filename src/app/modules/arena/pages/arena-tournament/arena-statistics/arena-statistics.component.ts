import { Component, inject, Input } from '@angular/core';
import { Arena, ArenaStatistics } from '@arena/arena.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { ArenaService } from '@arena/arena.service';

@Component({
  selector: 'arena-statistics',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule
  ],
  templateUrl: './arena-statistics.component.html',
  styleUrl: './arena-statistics.component.scss'
})
export class ArenaStatisticsComponent extends BaseLoadComponent<ArenaStatistics> {
  @Input() arena: Arena;

  private service = inject(ArenaService);

  getData(): Observable<ArenaStatistics> {
    return this.service.getArenaStatistics(this.arena.id);
  }
}
