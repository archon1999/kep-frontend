import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContestsService } from '@contests/contests.service';
import { UserChallengesRating, UserContestsRating, UserProblemsRating } from '@users/users.models';
import { UsersApiService } from '@users/users-api.service';
import { colors } from '@app/colors';
import { ChallengesService } from '@challenges/services';
import { CoreConfigService } from '@core/services/config.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ProblemsActivityCardComponent } from '@problems/components/problems-activity-card/problems-activity-card.component';
import { difficultyLabels } from '@problems/constants/difficulties.enum';

@Component({
  selector: 'user-ratings',
  templateUrl: './user-ratings.component.html',
  styleUrls: ['./user-ratings.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ProblemDifficultyColorPipe,
    ApexChartModule,
    ContestantViewModule,
    KepIconComponent,
    NgbButtonsModule,
    ProblemsActivityCardComponent,
  ]
})
export class UserRatingsComponent implements OnInit {

  public userContestsRating: UserContestsRating;
  public userProblemsRating: UserProblemsRating;
  public userChallengesRating: UserChallengesRating;

  public contestRatingChangesChart: ChartOptions;
  public challengesRatingChangesChart: ChartOptions;

  public username: string;

  protected readonly difficultyLabels = difficultyLabels;

  constructor(
    public service: UsersApiService,
    public route: ActivatedRoute,
    public router: Router,
    public translateService: TranslateService,
    public contestsService: ContestsService,
    public challengesService: ChallengesService,
    public coreConfigService: CoreConfigService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ userProblemsRating, userContestsRating, userChallengesRating }) => {
      this.userProblemsRating = userProblemsRating;
      this.userContestsRating = userContestsRating;
      this.userChallengesRating = userChallengesRating;
    });

    this.route.params.subscribe((params: any) => {
      this.username = params['username'];
      this.loadContestRatingChanges();
      this.loadChallengesRatingChanges();
    });
  }

  loadContestRatingChanges() {
    const username = this.username;
    const router = this.router;
    this.contestsService.getContestsRatingChanges(this.username).subscribe(
      (ratingChanges: any) => {
        const data = [];
        for (const ratingChange of ratingChanges) {
          data.push({
            x: ratingChange.contestStartDate,
            y: ratingChange.newRating,
          });
        }
        this.contestRatingChangesChart = {
          series: [{
            name: '',
            data: data,
          }],
          chart: {
            type: 'area',
            stacked: false,
            height: 350,
            events: {
              click: function (event, chartContext, config) {
                const contestId = ratingChanges[config.dataPointIndex].contestId;
                router.navigate(['/competitions', 'contests', 'contest', contestId, 'standings']);
              }
            }
          },
          xaxis: {
            type: 'datetime'
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }): any {
              const data = ratingChanges[dataPointIndex];
              let deltaColor: string;
              if (data.delta > 0) {
                deltaColor = 'success';
              } else if (data.delta === 0) {
                deltaColor = 'secondary';
              } else {
                deltaColor = 'danger';
              }
              return `
              <div class="card">
                <div class="card-body">
                  <h4 class="text-center">
                    ${ data.contestTitle }
                  </h4>
                  <div class="d-flex">
                    <div class="text-dark">#${ data.rank }</div>
                    <div class="text-dark ml-1">
                      ${ username }
                      <img src="assets/images/contests/ratings/${ data.newRatingTitle.toLowerCase() }.png" height=20>
                      ${ data.newRating }
                    </div>
                    <span class="ml-1 badge badge-light-${ deltaColor }">${ data.delta }</span>
                  </div>
                </div>
              </div>
              `;
            }
          },
          colors: [colors.solid.primary],
        };
      }
    );
  }

  loadChallengesRatingChanges() {
    this.challengesService.getRatingChanges(this.username).subscribe(
      (ratingChanges: any) => {
        const data = [];
        for (const ratingChange of ratingChanges) {
          data.push({
            x: ratingChange.date,
            y: ratingChange.value,
          });
        }
        this.challengesRatingChangesChart = {
          series: [{
            name: '',
            data: data,
          }],
          chart: {
            type: 'area',
            stacked: false,
            height: 350,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false,
            },
          },
          xaxis: {
            type: 'datetime'
          },
        };
      }
    );
  }
}
