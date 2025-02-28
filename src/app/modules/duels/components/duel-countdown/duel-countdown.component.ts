import { Component, Input, OnInit } from '@angular/core';
import { Duel } from '../../duels.models';

@Component({
  selector: 'duel-countdown',
  templateUrl: './duel-countdown.component.html',
  styleUrls: ['./duel-countdown.component.scss']
})
export class DuelCountdownComponent implements OnInit {

  @Input() duel: Duel;

  public leftTime = 0;

  constructor() { }

  ngOnInit(): void {
    this.updateLeftTime();
  }

  updateLeftTime() {
    if (this.duel.status == -1) {
      this.leftTime = new Date(this.duel.startTime).valueOf() - Date.now();
    } else if (this.duel.status == 0) {
      this.leftTime = new Date(this.duel.finishTime).valueOf() - Date.now();
    }
  }

  finish() {
    if (this.duel.status != 1) {
      window.location.reload();
    }
  }

}
