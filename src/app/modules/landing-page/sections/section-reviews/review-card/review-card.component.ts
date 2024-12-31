import { Component, Input } from '@angular/core';

import { Review } from '@app/modules/landing-page/sections/section-reviews/review';

@Component({
  selector: 'review-card',
  standalone: true,
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  @Input() review: Review;
}
