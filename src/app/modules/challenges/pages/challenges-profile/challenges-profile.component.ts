import { Component, OnInit } from '@angular/core';
import { ChallengesService } from '../../services/challenges.service';
import { ChallengesStatisticsService } from '../../services/challenges-statistics.service';
import { ChallengesRating } from '../../models/challenges.models';
import { CurrentUser } from '../../../../shared/components/classes/current-user.component';
import { AuthenticationService } from '../../../../auth/service';

@Component({
  selector: 'app-challenges-profile',
  templateUrl: './challenges-profile.component.html',
  styleUrls: ['./challenges-profile.component.scss', '../../challenges.styles.scss']
})
export class ChallengesProfileComponent extends CurrentUser implements OnInit {

  public challengesRating: ChallengesRating;

  constructor(
    public statisticsService: ChallengesStatisticsService,
    public authService: AuthenticationService,
  ) {
    super(authService);
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

}
