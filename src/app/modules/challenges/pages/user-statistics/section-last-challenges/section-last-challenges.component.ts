import { Component } from '@angular/core';
import { ChallengesStatisticsService } from '@challenges/services';
import { Challenge } from '@challenges/models/challenges';
import { AuthUser } from '@auth';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { CoreCommonModule } from '@core/common.module';
import { ChallengeCardComponent } from '@challenges/components/challenge-card/challenge-card.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'section-last-challenges',
  templateUrl: './section-last-challenges.component.html',
  styleUrls: ['./section-last-challenges.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengeCardComponent,
    KepPaginationComponent,
    ResourceByIdPipe,
  ]
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

  afterChangeCurrentUser(currentUser: AuthUser) {
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
