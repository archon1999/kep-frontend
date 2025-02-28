import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { Challenge } from '@challenges/models';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'challenge-countdown',
  standalone: true,
  imports: [
    CountdownComponent,
    TranslateModule,
    KepCardComponent
  ],
  templateUrl: './challenge-countdown.component.html',
  styleUrl: './challenge-countdown.component.scss'
})
export class ChallengeCountdownComponent {
  @Input() challenge: Challenge;
  @Output() finish = new EventEmitter<null>;
  @ViewChild('counter') counter: CountdownComponent;

  reset() {
    this.counter.reset();
  }

  start() {
    this.counter.start();
  }

  pause() {
    this.counter.pause();
  }
}
