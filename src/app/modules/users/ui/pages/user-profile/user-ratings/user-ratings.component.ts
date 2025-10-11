import { Component, inject } from '@angular/core';
import { ContestsService } from '@contests/contests.service';
import { UserChallengesRating, UserContestsRating, UserProblemsRating } from '@users/domain';
import { ChallengesApiService } from '@challenges/services';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import {
  ProblemsActivityCardComponent
} from '@problems/components/problems-activity-card/problems-activity-card.component';
import { difficultyLabels } from '@problems/constants/difficulties.enum';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { UsersApiService } from "@app/modules/users";
import { Resources } from "@app/resources";
import { BaseLoadComponent } from "@core/common";
import { Observable, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
    ProblemsActivityCardComponent,
    KepCardComponent,
  ]
})
export class UserRatingsComponent extends BaseLoadComponent<{userProblemsRating: UserProblemsRating; userContestsRating: UserContestsRating; userChallengesRating: UserChallengesRating;}> {

  public userContestsRating: UserContestsRating | null = null;
  public userProblemsRating: UserProblemsRating | null = null;
  public userChallengesRating: UserChallengesRating | null = null;

  public contestRatingChangesChart: ChartOptions | null = null;
  public challengesRatingChangesChart: ChartOptions | null = null;

  public username: string;

  public hasRatingsLoaded = false;

  protected readonly difficultyLabels = difficultyLabels;

  private readonly usersService = inject(UsersApiService);
  private readonly contestsService = inject(ContestsService);
  private readonly challengesService = inject(ChallengesApiService);

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const username = params?.['username'];

        if (!username) {
          return;
        }

        const hasChanged = username !== this.username;
        this.username = username;

        if (!hasChanged && this.hasRatingsLoaded) {
          return;
        }

        this.hasRatingsLoaded = false;
        this.userProblemsRating = null;
        this.userContestsRating = null;
        this.userChallengesRating = null;
        this.contestRatingChangesChart = null;
        this.challengesRatingChangesChart = null;

        this.loadData();
        this.loadContestRatingChanges();
        this.loadChallengesRatingChanges();
      });
  }

  getData(): Observable<{userProblemsRating: UserProblemsRating; userContestsRating: UserContestsRating; userChallengesRating: UserChallengesRating;}> {
    return forkJoin({
      userProblemsRating: this.usersService.getUserProblemsRating(this.username),
      userContestsRating: this.usersService.getUserContestsRating(this.username),
      userChallengesRating: this.usersService.getUserChallengesRating(this.username),
    });
  }

  override afterLoadData({userProblemsRating, userContestsRating, userChallengesRating}: {userProblemsRating: UserProblemsRating; userContestsRating: UserContestsRating; userChallengesRating: UserChallengesRating;}): void {
    this.userProblemsRating = userProblemsRating;
    this.userContestsRating = userContestsRating;
    this.userChallengesRating = userChallengesRating;
    this.hasRatingsLoaded = true;
  }

  loadContestRatingChanges() {
    const username = this.username;
    const router = this.router;
    this.contestsService.getContestsRatingChanges(this.username)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
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
            custom: function ({series, seriesIndex, dataPointIndex, w}): any {
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
                    ${data.contestTitle}
                  </h4>
                  <div class="d-flex">
                    <div class="text-dark">#${data.rank}</div>
                    <div class="text-dark ms-1">
                      ${username}
                      <img src="assets/images/contests/ratings/${data.newRatingTitle.toLowerCase()}.png" height=20>
                      ${data.newRating}
                    </div>
                    <span class="ms-1 badge bg-${deltaColor}-transparent">${data.delta}</span>
                  </div>
                </div>
              </div>
              `;
            }
          },
        };
      }
    );
  }

  loadChallengesRatingChanges() {
    this.challengesService.getRatingChanges(this.username)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
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

  protected readonly Resources = Resources;
}
