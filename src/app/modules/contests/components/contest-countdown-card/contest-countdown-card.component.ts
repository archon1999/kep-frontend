import { Component, Input } from '@angular/core';
import { Contest } from '@contests/contests.models';

@Component({
  selector: 'contest-card-countdown',
  templateUrl: './contest-card-countdown.component.html',
  styleUrls: ['./contest-card-countdown.component.scss']
})
export class ContestCardCountdownComponent {
  @Input() contest: Contest;
}
