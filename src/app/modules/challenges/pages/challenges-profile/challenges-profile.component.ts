import { Component, OnInit } from '@angular/core';
import { ChallengesService } from '../../services/challenges.service';
import { ChallengesStatisticsService } from '../../services/challenges-statistics.service';
import { ChallengesRating } from '../../models/challenges.models';
import { BaseComponent } from '../../../../shared/components/classes/base.component';
import { AuthenticationService } from '../../../../auth/service';

@Component({
  selector: 'app-challenges-profile',
  templateUrl: './challenges-profile.component.html',
  styleUrls: ['./challenges-profile.component.scss', '../../challenges.styles.scss']
})
export class ChallengesProfileComponent extends BaseComponent implements OnInit {

  public challengesRating: ChallengesRating;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

}
