import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { Contest } from '@contests/models/contest';
import { ContestsService } from '@contests/contests.service';
import {
  ContestStatistics,
  ContestStatisticsFirstSolve,
  ContestStatisticsBadges,
  ContestStatisticsContestant,
} from '@contests/models';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { colors as Colors } from '@core/config/colors';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
interface OverviewCard {
  key: string;
  label: string;
  value: number;
  format?: 'percent';
  icon: string;
  iconColor: string;
}

interface BadgeCard {
  key: keyof ContestStatisticsBadges;
  title: string;
  icon: string;
  color: string;
  contestant: ContestStatisticsContestant | null;
  problem?: string;
  time?: string;
  attempts?: number;
  solvedProblems?: number;
  wrongAttempts?: number;
}

@Component({
  selector: 'contest-statistics',
  standalone: true,
  templateUrl: './contest-statistics.component.html',
  styleUrls: ['./contest-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestClassesPipe,
    KepCardComponent,
    ApexChartModule,
    ContestantViewModule,
  ],
})
export class ContestStatisticsComponent extends BasePageComponent implements OnInit {

  public contest: Contest;
  public statistics: ContestStatistics | null = null;
  public isLoading = true;

  public overviewCards: OverviewCard[] = [];
  public timelineChart: ChartOptions;
  public problemsChart: ChartOptions;
  public verdictsChart: ChartOptions;
  public firstSolvesEntries: Array<{ problem: string; record: ContestStatisticsFirstSolve }> = [];
  public badges: BadgeCard[] = [];

  constructor(
    private contestsService: ContestsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
      this.fetchStatistics();
    });
  }

  protected getContentHeader() {
    if (!this.contest) {
      return null;
    }

    return {
      headerTitle: this.contest.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id + '',
            isLink: true,
            link: '..'
          },
          {
            name: 'Statistics',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  private fetchStatistics() {
    if (!this.contest) {
      return;
    }

    this.isLoading = true;
    this.contestsService.getContestStatistics(this.contest.id).subscribe({
      next: (statistics) => {
        this.statistics = statistics;
        this.buildOverviewCards(statistics);
        this.buildTimelineChart(statistics);
        this.buildProblemsChart(statistics);
        this.buildVerdictsChart(statistics);
        this.buildFirstSolves(statistics);
        this.buildBadges(statistics);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private buildOverviewCards(statistics: ContestStatistics) {
    this.overviewCards = [
      {
        key: 'participants',
        label: 'Contests.Participants',
        value: statistics.general.participants,
        icon: 'users',
        iconColor: 'primary',
      },
      {
        key: 'totalAttempts',
        label: 'Contests.TotalAttempts',
        value: statistics.general.attempts.total,
        icon: 'attempts',
        iconColor: 'warning',
      },
      {
        key: 'totalAccepted',
        label: 'Contests.TotalAccepted',
        value: statistics.general.accepted.total,
        icon: 'verdict',
        iconColor: 'success',
      },
      {
        key: 'acceptanceRate',
        label: 'Contests.AcceptanceRate',
        value: statistics.general.acceptanceRate,
        icon: 'statistics',
        iconColor: 'info',
        format: 'percent',
      },
    ];
  }

  private buildTimelineChart(statistics: ContestStatistics) {
    const categories = statistics.timeline.map(item => item.range);
    const data = statistics.timeline.map(item => item.attempts);

    this.timelineChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data,
        }
      ],
      chart: {
        type: 'area',
        height: 320,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        }
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
        }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
        },
        min: 0,
      },
      colors: [Colors.solid.primary],
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)} ${this.translateService.instant('Attempts')}`,
        }
      }
    } as ChartOptions;
  }

  private buildProblemsChart(statistics: ContestStatistics) {
    const problems = Object.keys(statistics.general.attempts.byProblem).sort();
    const attemptData = problems.map(symbol => statistics.general.attempts.byProblem[symbol] || 0);
    const acceptedData = problems.map(symbol => statistics.general.accepted.byProblem[symbol] || 0);

    this.problemsChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data: attemptData,
        },
        {
          name: this.translateService.instant('Solved'),
          data: acceptedData,
        }
      ],
      chart: {
        type: 'bar',
        height: 360,
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 6,
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: problems,
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
      },
      colors: [Colors.solid.primary, Colors.solid.success],
      tooltip: {
        shared: true,
        intersect: false,
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
        }
      }
    } as ChartOptions;
  }

  private buildVerdictsChart(statistics: ContestStatistics) {
    const labels = [
      this.translateService.instant('Contests.Verdicts.Accepted'),
      this.translateService.instant('Contests.Verdicts.WrongAnswer'),
      this.translateService.instant('Contests.Verdicts.TimeLimitExceeded'),
      this.translateService.instant('Contests.Verdicts.Other'),
    ];

    this.verdictsChart = {
      series: [
        statistics.verdicts.accepted,
        statistics.verdicts.wrongAnswer,
        statistics.verdicts.timeLimitExceeded,
        statistics.verdicts.other,
      ] as any,
      labels,
      chart: {
        type: 'donut',
        height: 320,
      },
      colors: [
        Colors.solid.success,
        Colors.solid.danger,
        Colors.solid.warning,
        Colors.solid.secondary,
      ],
      legend: {
        position: 'bottom',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: this.translateService.instant('Attempts'),
              },
              value: {
                formatter: (value: string) => `${value}`,
              }
            }
          }
        }
      }
    } as unknown as ChartOptions;
  }

  private buildFirstSolves(statistics: ContestStatistics) {
    const entries = Object.entries(statistics.records.firstSolves || {});
    this.firstSolvesEntries = entries.map(([problem, record]) => ({ problem, record })).sort(
      (a, b) => a.problem.localeCompare(b.problem)
    );
  }

  private buildBadges(statistics: ContestStatistics) {
    const badgeConfig: Array<Omit<BadgeCard, 'contestant' | 'problem' | 'time' | 'attempts' | 'solvedProblems' | 'wrongAttempts'>> = [
      {
        key: 'sniper',
        title: 'Contests.BadgeSniper',
        icon: 'contest',
        color: 'info',
      },
      {
        key: 'grinder',
        title: 'Contests.BadgeGrinder',
        icon: 'attempts',
        color: 'warning',
      },
      {
        key: 'optimizer',
        title: 'Contests.BadgeOptimizer',
        icon: 'statistics',
        color: 'success',
      },
      {
        key: 'neverGiveUp',
        title: 'Contests.BadgeNeverGiveUp',
        icon: 'question',
        color: 'primary',
      }
    ];

    this.badges = [];
    badgeConfig.forEach(config => {
      const badgeData = statistics.badges?.[config.key];
      if (!badgeData) {
        return;
      }

      const badgeCard: BadgeCard = {
        ...config,
        contestant: badgeData.contestant ?? null,
      };

      if ('problem' in badgeData) {
        badgeCard.problem = badgeData.problem;
      }

      if ('time' in badgeData) {
        badgeCard.time = badgeData.time;
      }

      if ('attempts' in badgeData) {
        badgeCard.attempts = badgeData.attempts;
      }

      if ('solvedProblems' in badgeData) {
        badgeCard.solvedProblems = badgeData.solvedProblems;
      }

      if ('wrongAttempts' in badgeData) {
        badgeCard.wrongAttempts = badgeData.wrongAttempts;
      }

      this.badges.push(badgeCard);
    });
  }
}
