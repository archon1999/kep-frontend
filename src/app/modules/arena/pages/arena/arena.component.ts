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
  ],
  encapsulation: ViewEncapsulation.None
})
export class ArenaComponent implements OnInit {

  public arenaList: Array<Arena> = [];

  constructor(
    public service: ArenaService,
  ) { }

  ngOnInit(): void {
    this.service.getArenaAll().subscribe(
      (result: any) => {
        this.arenaList = result;
      }
    );
  }

}
