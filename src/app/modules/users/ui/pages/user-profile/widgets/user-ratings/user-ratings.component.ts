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
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { UsersApiService } from '@app/modules/users';
import { Resources } from '@app/resources';
import { BaseLoadComponent } from '@core/common';
import { Observable, combineLatest, forkJoin, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

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

  public username = '';

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

    const parentParams$ = this.route.parent?.params ?? of({});

    combineLatest([this.route.params, parentParams$])
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(([params, parentParams]) => params?.['username'] ?? parentParams?.['username']),
        filter((username): username is string => !!username),
        distinctUntilChanged(),
      )
      .subscribe(username => {
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
        this.isLoading = true;

        this.loadData();
        this.loadContestRatingChanges(username);
        this.loadChallengesRatingChanges(username);
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

  private loadContestRatingChanges(username: string) {
    const router = this.router;
    this.contestsService.getContestsRatingChanges(username)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (ratingChanges: any) => {
          const data = ratingChanges.map((ratingChange: any) => ({
            x: ratingChange.contestStartDate,
            y: ratingChange.newRating,
          }));

          this.contestRatingChangesChart = {
            series: [{
              name: '',
              data,
            }],
            chart: {
              type: 'area',
              stacked: false,
              height: 350,
              events: {
                click: function (event, chartContext, config) {
                  const contestId = ratingChanges[config.dataPointIndex]?.contestId;
                  if (contestId) {
                    router.navigate(['/competitions', 'contests', 'contest', contestId, 'standings']);
                  }
                }
              }
            },
            xaxis: {
              type: 'datetime'
            },
            tooltip: {
              custom: function ({series, seriesIndex, dataPointIndex, w}): any {
                const data = ratingChanges[dataPointIndex];
                if (!data) {
                  return '';
                }

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

  private loadChallengesRatingChanges(username: string) {
    this.challengesService.getRatingChanges(username)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (ratingChanges: any) => {
          const data = ratingChanges.map((ratingChange: any) => ({
            x: ratingChange.date,
            y: ratingChange.value,
          }));
          this.challengesRatingChangesChart = {
            series: [{
              name: '',
              data,
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
