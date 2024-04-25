import { Component, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Observable } from 'rxjs';
import { User } from '@auth';
import { ChallengesStatisticsService } from '@challenges/services';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ChallengesRating } from '@challenges/interfaces/challenges-rating';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ChallengesUserViewComponent,
  ],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SectionHeaderComponent extends BaseLoadComponent<ChallengesRating> {
  protected readonly Math = Math;
  override loadOnInit = false;

  constructor(public statisticsService: ChallengesStatisticsService) {
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

  afterLoadData(data: ChallengesRating) {
    data.all = (data.wins + data.draws + data.losses) || 1;
  }
}
