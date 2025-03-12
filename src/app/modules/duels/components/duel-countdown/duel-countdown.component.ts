import { Component, Input, OnInit } from '@angular/core';
import { Duel } from '../../duels.interfaces';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';

@Component({
  selector: 'duel-countdown',
  templateUrl: './duel-countdown.component.html',
  styleUrls: ['./duel-countdown.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    TranslatePipe,
    CountdownComponent
  ]
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
