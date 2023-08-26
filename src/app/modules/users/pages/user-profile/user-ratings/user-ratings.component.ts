import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContestsService } from '../../../../contests/contests.service';
import { ProblemsStatisticsService } from '../../../../problems/services/problems-statistics.service';
import { UserChallengesRating, UserContestsRating, UserProblemsRating } from '../../../users.models';
import { UsersService } from '../../../users.service';
import { colors } from '../../../../../colors.const';
import { ChallengesService } from '../../../../challenges/services/challenges.service';
import { Subject } from 'rxjs';
import { CoreConfigService } from '../../../../../../@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '../../../../../../@core/types';

@Component({
  selector: 'user-ratings',
  templateUrl: './user-ratings.component.html',
  styleUrls: ['./user-ratings.component.scss']
})
export class UserRatingsComponent implements OnInit {

  public userContestsRating: UserContestsRating;
  public userProblemsRating: UserProblemsRating;
  public userChallengesRating: UserChallengesRating;

  public activityDays = 7;
  public activitySolved = 0;
  public activityChart: any;
  public solvedText: string;

  public contestRatingChangesChart: any;
  public challengesRatingChangesChart: any;

  public chartTheme: {
    mode: string,
  };

  public username: string;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: UsersService,
    public route: ActivatedRoute,
    public router: Router,
    public translateService: TranslateService,
    public problemsService: ProblemsStatisticsService,
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
      this.activityDataUpdate(this.activityDays);
      this.loadContestRatingChanges();
      this.loadChallengesRatingChanges();
    });

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        if (config.layout.skin == 'dark') {
          this.chartTheme = {
            mode: 'dark',
          };
        } else {
          this.chartTheme = {
            mode: 'light',
          };
        }
      }
    );

    this.translateService.get('Solved').subscribe(
      (text: string) => {
        this.solvedText = text;
      }
    );
  }

  activityDataUpdate(days: number) {
    this.activityDays = days;
    let username = this.username;
    this.problemsService.getLastDays(username, days).subscribe((result: any) => {
      this.activitySolved = result.solved;
      let data = [];
      let days = 0;
      for (let y of result.series) {
        let dt = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
        data.push({
          x: dt.toDateString(),
          y: y,
        });
        days++;
      }
      this.activityChart = {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          fontFamily: 'Quicksand, Raleway',
        },
        colors: [colors.solid.primary],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 5
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            gradientToColors: ['#A9A2F6'],
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function (val) {
              return val + '';
            },
          }
        },
        series: [
          {
            name: this.solvedText,
            data: data,
          }
        ],
        tooltip: {
          x: { show: false }
        },
      };

    });
  }

  loadContestRatingChanges() {
    let username = this.username;
    let router = this.router;
    this.contestsService.getContestsRatingChanges(this.username).subscribe(
      (ratingChanges: any) => {
        let data = [];
        for (let ratingChange of ratingChanges) {
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
            fontFamily: 'Quicksand, Raleway',
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false,
            },
            events: {
              click: function (event, chartContext, config) {
                let contestId = ratingChanges[config.dataPointIndex].contestId;
                console.log(ratingChanges[config.dataPointIndex]);
                router.navigate(['/competitions', 'contests', 'contest', contestId, 'standings']);
              }
            }
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
                return value;
              },
            }
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              let data = ratingChanges[dataPointIndex];
              let deltaColor: string;
              if (data.delta > 0) {
                deltaColor = 'success';
              } else if (data.delta == 0) {
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
        let data = [];
        for (let ratingChange of ratingChanges) {
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
            fontFamily: 'Quicksand, Raleway',
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
                return value;
              },
            }
          },
          tooltip: {
            show: false,
          },
          colors: [colors.solid.primary],
        };
      }
    );
  }
}
