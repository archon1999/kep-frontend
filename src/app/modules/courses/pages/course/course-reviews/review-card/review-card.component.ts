import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { CourseParticipantReview } from '@courses/interfaces';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';

@Component({
  selector: 'review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    UserPopoverModule,
    NgbRatingModule,
    MathjaxModule,
    NgbTooltipModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReviewCardComponent {
  @Input() review: CourseParticipantReview;
}
