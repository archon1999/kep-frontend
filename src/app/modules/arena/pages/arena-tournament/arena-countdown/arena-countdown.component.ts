import { Component, Input, OnInit } from '@angular/core';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { Arena, ArenaStatus } from '@arena/arena.models';
import { BaseComponent } from '@app/common';

@Component({
  selector: 'arena-countdown',
  standalone: true,
  imports: [
    CountdownComponent,
    TranslateModule
  ],
  templateUrl: './arena-countdown.component.html',
  styleUrl: './arena-countdown.component.scss'
})
export class ArenaCountdownComponent implements OnInit {
  @Input() arena: Arena;

  public leftTime = 0;

  protected readonly ArenaStatus = ArenaStatus;
  protected readonly location = location;

  ngOnInit() {
    if (this.arena.status === ArenaStatus.NotStarted) {
      this.leftTime = new Date(this.arena.startTime).valueOf() - Date.now();
    } else if (this.arena.status === ArenaStatus.Already) {
      this.leftTime = new Date(this.arena.finishTime).valueOf() - Date.now();
    }
  }
}
