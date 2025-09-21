import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { User } from "@users/domain";

type RatingKey = 'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating';

interface RatingInfo {
  value: number;
  rank?: number;
  percentile?: number;
  title?: string;
}

interface UserRatingsResponse {
  skillsRating?: RatingInfo;
  activityRating?: RatingInfo;
  contestsRating?: RatingInfo;
  challengesRating?: RatingInfo;
}

interface RatingStat {
  key: RatingKey;
  translationKey: string;
  value: number;
  rank?: number;
  percentile?: number;
  title?: string;
  format: string;
}

@Component({
  selector: 'user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class UserPopoverComponent implements OnInit {

  @Input() username: string;
  @Input() streak = 0;
  @Input() textColor = 'dark';
  @Input() placement = 'auto';
  @Input() customClass = 'darken-5';
  @Input() customContent = false;

  public user: User;
  public userRatings: UserRatingsResponse;
  public ratingStats: RatingStat[] = [];
  protected cdr = inject(ChangeDetectorRef);

  private readonly ratingConfig: Array<{ key: RatingKey; translationKey: string }> = [
    { key: 'skillsRating', translationKey: 'SkillsRating' },
    { key: 'activityRating', translationKey: 'ActivityRating' },
    { key: 'contestsRating', translationKey: 'Contests.ContestsRating' },
    { key: 'challengesRating', translationKey: 'PageTitle.Challenges.ChallengesRating' },
  ];

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  loadUser() {
    if (!this.user) {
      this.api.get(`users/${this.username}`).subscribe((user: any) => {
        this.user = user;
        this.cdr.detectChanges();
      });
      this.api.get(`users/${this.username}/ratings`).subscribe((userRatings: UserRatingsResponse) => {
        this.userRatings = userRatings;
        this.ratingStats = this.buildRatingStats(userRatings);
        this.cdr.detectChanges();
      });
    }
  }

  private buildRatingStats(userRatings: UserRatingsResponse): RatingStat[] {
    if (!userRatings) {
      return [];
    }

    return this.ratingConfig
      .map(({ key, translationKey }) => {
        const rating = userRatings[key];
        if (!rating || typeof rating.value !== 'number') {
          return null;
        }

        const format = Number.isInteger(rating.value) ? '1.0-0' : '1.0-1';

        return {
          key,
          translationKey,
          value: rating.value,
          rank: rating.rank,
          percentile: rating.percentile,
          title: rating.title,
          format,
        } as RatingStat;
      })
      .filter((stat): stat is RatingStat => !!stat);
  }

}
