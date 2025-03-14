import { Component } from '@angular/core';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Arena, ArenaStatus } from '@arena/arena.models';
import { Observable } from 'rxjs';
import { ArenaService } from '@arena/arena.service';
import { CoreCommonModule } from '@core/common.module';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { PageResult } from '@app/common/classes/page-result';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-arenas',
  standalone: true,
  imports: [CoreCommonModule, ChallengesUserViewComponent, ResourceByIdPipe, KepCardComponent],
  templateUrl: './section-arenas.component.html',
  styleUrl: './section-arenas.component.scss'
})
export class SectionArenasComponent extends BaseLoadComponent<PageResult<Arena>> {

  constructor(public arenaService: ArenaService) {
    super();
  }

  get arenaList() {
    return this.data.data;
  }

  getData(): Observable<PageResult<Arena>> {
    return this.arenaService.getArenaAll({
      status: ArenaStatus.Finished,
      pageSize: 8,
    });
  }

}
