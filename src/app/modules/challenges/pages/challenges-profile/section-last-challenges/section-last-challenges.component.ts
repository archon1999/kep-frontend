import { Component } from '@angular/core';
import { ChallengesStatisticsService } from '@challenges/services';
import { Challenge } from '@challenges/models/challenges.models';
import { User } from '@auth/models';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@shared/components/classes/page-result';

@Component({
  selector: 'section-last-challenges',
  templateUrl: './section-last-challenges.component.html',
  styleUrls: ['./section-last-challenges.component.scss']
})
export class SectionLastChallengesComponent extends BaseTablePageComponent<Challenge> {
  override defaultPageSize = 7;
  override maxSize = 5;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

  get challenges() {
    return this.pageResult?.data;
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      setTimeout(() => this.reloadPage());
    }
  }

  getPage(): Observable<PageResult<Challenge>> {
    return this.statisticsService.getUserLastChallenges({
      username: this.currentUser.username,
      ...this.pageable,
    });
  }
}
