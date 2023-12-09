import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/classes/base.component';
import { ChallengesStatisticsService } from '../../../services';
import { AuthenticationService } from 'app/auth/service';
import { ChallengesRatingChange } from '../../../models/challenges.models';
import { ChartOptions } from '../../../../../shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'section-rating-changes',
  templateUrl: './section-rating-changes.component.html',
  styleUrls: ['./section-rating-changes.component.scss']
})
export class SectionRatingChangesComponent extends BaseComponent {

  public challengesRatingChangesChart: ChartOptions;

  constructor(
    public statisticsService: ChallengesStatisticsService,
    public authService: AuthenticationService,
  ) {
    super();
  }

  afterChangeCurrentUser(currentUser) {
    if (currentUser) {
      setTimeout(() => this.loadData());
    }
  }

  loadData() {
    this.statisticsService.getUserChallengesRatingChanges(this.currentUser.username).subscribe(
      (challengesRatingChanges: Array<ChallengesRatingChange>) => {
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
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 90, 100]
            }
          },
          xaxis: {
            type: 'datetime'
          },
          yaxis: {
            labels: {
              formatter: (value) => {
                return value.toString();
              },
            }
          },
          colors: ['#5456da'],
        };
      }
    );
  }
}
