import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'app/shared/components/classes/current-user.component';
import { ChallengesStatisticsService } from '../../../services';
import { AuthenticationService } from '../../../../../auth/service';
import { Challenge } from '../../../models/challenges.models';
import { PageResult } from '../../../../../shared/page-result';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'section-last-challenges',
  templateUrl: './section-last-challenges.component.html',
  styleUrls: ['./section-last-challenges.component.scss']
})
export class SectionLastChallengesComponent extends CurrentUser implements OnInit {

  public challenges: Array<Challenge> = [];
  public pageSize = 7;
  public currentPage = 1;
  public total = 0;

  constructor(
    public statisticsService: ChallengesStatisticsService,
    public authService: AuthenticationService,
  ) {
    super(authService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  afterChangeCurrentUser() {
    if (this.currentUser) {
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
