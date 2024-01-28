import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseUserComponent } from '@shared/components/classes/base-user.component';
import { ContestsService } from '@contests/contests.service';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { ContestsRating } from '@contests/models';
import { User } from '@auth/models';
import { Observable } from 'rxjs';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestsRatingBadgeComponent } from '@contests/components/contests-rating-badge/contests-rating-badge.component';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, ContestantViewModule, ContestsRatingBadgeComponent],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent extends BaseLoadComponent<ContestsRating> {
  override loadOnInit = false;

  constructor(public service: ContestsService) {
    super();
  }

  getData(): Observable<ContestsRating> {
    return this.service.getUserContestsRating(this.currentUser?.username);
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      this.loadData();
    }
  }
}
