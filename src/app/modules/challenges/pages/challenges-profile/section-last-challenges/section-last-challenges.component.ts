import { Component } from '@angular/core';
import { BaseComponent } from '@shared/components/classes/base.component';
import { ChallengesStatisticsService } from 'app/modules/challenges/services';
import { Challenge } from 'app/modules/challenges/models/challenges.models';
import { PageResult } from '@shared/components/classes/page-result';
import { User } from 'app/auth/models';

@Component({
  selector: 'section-last-challenges',
  templateUrl: './section-last-challenges.component.html',
  styleUrls: ['./section-last-challenges.component.scss']
})
export class SectionLastChallengesComponent extends BaseComponent {

  public challenges: Array<Challenge> = [];
  public pageSize = 7;
  public currentPage = 1;
  public total = 0;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      setTimeout(() => this.loadChallenges());
    }
  }

  loadChallenges() {
    this.statisticsService.getUserLastChallenges({
      username: this.currentUser.username,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe(
      (result: PageResult) => {
        this.challenges = result.data;
        this.total = result.total;
      }
    );
  }

}
