import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestsRatingColorPipe } from '@contests/pipes/contests-rating-color.pipe';

@Component({
  selector: 'contests-rating-badge',
  standalone: true,
  imports: [CommonModule, ContestsRatingColorPipe],
  templateUrl: './contests-rating-badge.component.html',
  styleUrl: './contests-rating-badge.component.scss'
})
export class ContestsRatingBadgeComponent {
  @Input() rating: number;
  @Input() badgeLight = true;
}
