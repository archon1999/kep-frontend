import { Component, Input, OnInit } from '@angular/core';
import { Achievement } from '@users/users.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
  ]
})
export class AchievementComponent implements OnInit {

  @Input() achievement: Achievement;

  public hover = false;

  constructor() { }

  getColor() {
    if (this.achievement.type === 2) {
      return 'danger';
    }

    if (this.achievement.type === 4) {
      return 'warning';
    }

    if (this.achievement.type === 5) {
      return 'dark';
    }

    return 'primary';
  }

  ngOnInit(): void {}

}
