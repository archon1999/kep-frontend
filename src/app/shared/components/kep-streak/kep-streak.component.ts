import { Component, Input, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'streak',
  templateUrl: './kep-streak.component.html',
  styleUrls: ['./kep-streak.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
  ]
})
export class KepStreakComponent implements OnInit {

  @Input() streak: number;
  @Input() maxStreak = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
