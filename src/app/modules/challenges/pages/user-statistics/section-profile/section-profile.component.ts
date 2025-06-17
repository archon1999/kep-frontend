import { Component } from '@angular/core';
import { ChallengesStatisticsService } from '@challenges/services';
import { AuthService, AuthUser } from '@auth';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Observable } from 'rxjs';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesRating } from '@challenges/interfaces/challenges-rating';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'section-profile',
  templateUrl: './section-profile.component.html',
  styleUrls: ['./section-profile.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    KepCardComponent,
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

  afterChangeCurrentUser(currentUser: AuthUser) {
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
