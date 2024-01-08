import { Component } from '@angular/core';
import { ChallengesStatisticsService } from '@challenges/services';
import { ChallengesRatingChange } from '@challenges/models/challenges.models';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { Observable } from 'rxjs';
import { User } from '@auth/models';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';

@Component({
  selector: 'section-rating-changes',
  templateUrl: './section-rating-changes.component.html',
  styleUrls: ['./section-rating-changes.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
  ]
})
export class SectionRatingChangesComponent extends BaseLoadComponent<Array<ChallengesRatingChange>> {
  override loadOnInit = false;
  public challengesRatingChangesChart: ChartOptions;

  constructor(
    public statisticsService: ChallengesStatisticsService,
  ) {
    super();
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      setTimeout(() => this.loadData());
    }
  }

  getData(): Observable<Array<ChallengesRatingChange>> | null {
    return this.statisticsService.getUserChallengesRatingChanges(this.currentUser.username);
  }

  afterLoadData(challengesRatingChanges: Array<ChallengesRatingChange>) {

    const data = challengesRatingChanges.map(
      (ratingChanges: ChallengesRatingChange) => {
        return {
          x: ratingChanges.date,
          y: ratingChanges.value,
        };
      }
    );
    this.challengesRatingChangesChart = {
      series: [{
        name: '',
        data: data,
      }],
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
      },
      xaxis: {
        type: 'datetime'
      },
    };
  }
}
