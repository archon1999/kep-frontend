import { Component } from '@angular/core';
import { ChallengesRating } from '@challenges/models/challenges.models';
import { ChallengesStatisticsService } from '@challenges/services';
import { AuthService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Observable } from 'rxjs';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'section-profile',
  templateUrl: './section-profile.component.html',
  styleUrls: ['./section-profile.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
  ]
})
export class SectionProfileComponent extends BaseLoadComponent<ChallengesRating> {

  protected readonly Math = Math;

  constructor(
    public statisticsService: ChallengesStatisticsService,
    public authService: AuthService,
  ) {
    super();
  }

  get challengesRating() {
    return this.data;
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      setTimeout(() => this.loadData());
    }
  }

  getData(): Observable<ChallengesRating> | null {
    return this.statisticsService.getUserChallengesRating(this.currentUser?.username);
  }

  afterLoadData(challengesRating: ChallengesRating) {
    challengesRating.all = (challengesRating.wins + challengesRating.draws + challengesRating.losses) || 1;
  }

}
