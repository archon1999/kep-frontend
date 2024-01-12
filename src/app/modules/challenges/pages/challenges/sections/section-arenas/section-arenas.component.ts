import { Component } from '@angular/core';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { Arena } from '@arena/arena.models';
import { Observable } from 'rxjs';
import { ArenaService } from '@arena/arena.service';
import { CoreCommonModule } from '@core/common.module';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'section-arenas',
  standalone: true,
  imports: [CoreCommonModule, ChallengesUserViewComponent, ResourceByIdPipe],
  templateUrl: './section-arenas.component.html',
  styleUrl: './section-arenas.component.scss'
})
export class SectionArenasComponent extends BaseLoadComponent<Arena[]> {

  constructor(public arenaService: ArenaService) {
    super();
  }

  get arenaList() {
    return this.data;
  }

  getData(): Observable<Arena[]> {
    return this.arenaService.getArenaAll();
  }

}
