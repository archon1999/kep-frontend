import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/components/classes/base.component';
import { ChallengesStatisticsService } from 'app/modules/challenges/services';
import { Challenge } from 'app/modules/challenges/models/challenges.models';
import { PageResult } from '@shared/page-result';
import { User } from 'app/auth/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'section-last-challenges',
  templateUrl: './section-last-challenges.component.html',
  styleUrls: ['./section-last-challenges.component.scss']
})
export class SectionLastChallengesComponent extends BaseComponent implements OnInit {

  public challenges: Array<Challenge> = [];
  public pageSize = 7;
  public currentPage = 1;
  public total = 0;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      this.loadChallenges();
    }
  }

  loadChallenges() {
    this.statisticsService.getUserLastChallenges(
      this.currentUser.username,
      this.currentPage,
      this.pageSize,
    ).subscribe(
      (result: PageResult) => {
        this.challenges = result.data;
        this.total = result.total;
      }
    );
  }

}
