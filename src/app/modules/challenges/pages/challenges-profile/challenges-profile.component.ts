import { Component, OnInit } from '@angular/core';
import { ChallengesStatisticsService } from '@challenges/services';
import { ChallengesRating } from '../../models/challenges.models';
import { BaseComponent } from '@shared/components/classes/base.component';

@Component({
  selector: 'app-challenges-profile',
  templateUrl: './challenges-profile.component.html',
  styleUrls: ['./challenges-profile.component.scss', '../../challenges.styles.scss']
})
export class ChallengesProfileComponent extends BaseComponent {

  public challengesRating: ChallengesRating;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

}
