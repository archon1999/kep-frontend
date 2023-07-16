import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Arena } from './arena.models';
import { ArenaService } from './arena.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeInOnEnterAnimation({ duration: 3000 }),
  ]
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
    )
  }

}
