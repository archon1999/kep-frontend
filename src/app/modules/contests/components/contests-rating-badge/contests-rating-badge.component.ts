import { Component, Input } from '@angular/core';

import { ContestsRatingColorPipe } from '@contests/pipes/contests-rating-color.pipe';

@Component({
  selector: 'contests-rating-badge',
  standalone: true,
  imports: [ContestsRatingColorPipe],
  templateUrl: './contests-rating-badge.component.html',
  styleUrl: './contests-rating-badge.component.scss'
})
export class ContestsRatingBadgeComponent {
  @Input() rating: number;
  @Input() badgeLight = true;
}
