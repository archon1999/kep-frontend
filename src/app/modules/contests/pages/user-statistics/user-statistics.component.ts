import { Component, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContestsService } from '@contests/contests.service';
import {
  ContestUserStatisticsContestDeltas,
  ContestUserStatisticsContestRanks,
  ContestUserStatisticsOpponent,
  ContestUserStatisticsResponse,
  ContestUserStatisticsTimelineEntry,
} from '@contests/models';
import { AuthUser } from '@auth';
import { Subscription } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { colors as Colors } from '@core/config/colors';
import { Resources, getResourceById, getResourceByParams } from '@app/resources';

interface StatisticCard {
  key: string;
  label: string;
  icon: string;
  value: string;
  subtitle?: string;
}

interface HighlightCard {
  key: string;
  label: string;
  icon: string;
  contestTitle?: string;
  contestLink?: string;
  meta?: string;
  valueLabel?: string;
}

interface ContestCard {
  key: string;
  label: string;
  icon: string;
  contestTitle?: string;
  contestLink?: string;
  value?: string;
  subtitle?: string;
}

@Component({
  selector: 'contests-user-statistics',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CoreCommonModule, ContentHeaderModule, KepCardComponent, ApexChartModule],
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class ContestsUserStatisticsComponent extends BasePageComponent implements OnDestroy {
  public isLoading = true;
  public statistics: ContestUserStatisticsResponse | null = null;
  public overviewCards: StatisticCard[] = [];
  public generalCards: StatisticCard[] = [];
  public highlightCards: HighlightCard[] = [];
  public contestRankCards: ContestCard[] = [];
  public contestDeltaCards: ContestCard[] = [];
  public timelineChart: ChartOptions | null = null;
  public languagesChart: ChartOptions | null = null;
  public verdictsChart: ChartOptions | null = null;
  public tagsChart: ChartOptions | null = null;
  public symbolsChart: ChartOptions | null = null;
  public timeline: ContestUserStatisticsTimelineEntry[] = [];
  public topOpponents: ContestUserStatisticsOpponent[] = [];

  private username: string | null = null;
  private readonly contestsService = inject(ContestsService);
  private statisticsSubscription: Subscription | null = null;

  afterChangeCurrentUser(currentUser: AuthUser) {
    if (!currentUser?.username) {
      return;
    }

    this.username = currentUser.username;
    this.loadStatistics();
    this.loadContentHeader();
  }

  ngOnDestroy() {
    this.statisticsSubscription?.unsubscribe();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Contests.UserStatistics.Header',
      breadcrumb: {
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: Resources.Contests,
          },
          {
            name: this.currentUser?.username ?? '',
            isLink: false,
          }
        ]
      }
    };
  }

  public getContestLink(contestId: number) {
    return getResourceById(Resources.Contest, contestId);
  }

  public getContestProblemLink(contestId: number, symbol: string) {
    return getResourceByParams(Resources.ContestProblem, { id: contestId, symbol });
  }

  private loadStatistics() {
    if (!this.username) {
      return;
    }

    this.isLoading = true;
    this.statisticsSubscription?.unsubscribe();
    this.statisticsSubscription = this.contestsService.getContestUserStatistics(this.username)
      .subscribe({
        next: (statistics) => {
          this.statistics = statistics;
          this.isLoading = false;
          this.buildGeneralCards(statistics);
          this.buildOverviewCards(statistics);
          this.buildHighlights(statistics);
          this.buildContestCards(statistics.contestRanks, statistics.contestDeltas);
          this.buildTimeline(statistics);
          this.buildLanguagesChart(statistics);
          this.buildVerdictsChart(statistics);
          this.buildTagAndSymbolCharts(statistics);
          this.buildOpponents(statistics);
          this.cdr.markForCheck();
        },
        error: () => {
          this.statistics = null;
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private buildGeneralCards(statistics: ContestUserStatisticsResponse) {
    const general = statistics.general;
    this.generalCards = [
      {
        key: 'rating',
        label: 'Contests.UserStatistics.CurrentRating',
        icon: 'rating',
        value: this.formatNumber(general.rating),
        subtitle: general.ratingTitle,
      },
      {
        key: 'maxRating',
        label: 'Contests.UserStatistics.BestRating',
        icon: 'contest',
        value: this.formatNumber(general.maxRating),
        subtitle: general.maxRatingTitle,
      },
      {
        key: 'place',
        label: 'Contests.UserStatistics.Rank',
        icon: 'ranking',
        value: `#${general.ratingPlace}`,
        subtitle: this.translateService.instant('Contests.UserStatistics.OutOf', { total: general.contestantsCount }),
      },
      {
        key: 'contestants',
        label: 'Contests.UserStatistics.TotalContestants',
        icon: 'users',
        value: this.formatNumber(general.contestantsCount),
        subtitle: '-',
      }
    ];
  }

  private buildOverviewCards(statistics: ContestUserStatisticsResponse) {
    const overview = statistics.overview;
    this.overviewCards = [
      {
        key: 'totalAttempts',
        label: 'Contests.TotalAttempts',
        icon: 'attempt',
        value: this.formatNumber(overview.totalAttempts),
      },
      {
        key: 'totalAccepted',
        label: 'Contests.TotalAccepted',
        icon: 'statistics',
        value: this.formatNumber(overview.totalAccepted),
      },
      {
        key: 'averageAttempts',
        label: 'Contests.UserStatistics.AverageAttemptsPerProblem',
        icon: 'statistics',
        value: (overview.averageAttemptsPerProblem + 1).toFixed(2),
      },
      {
        key: 'singleAttempt',
        label: 'Contests.UserStatistics.SingleAttemptProblems',
        icon: 'attempt',
        value: this.formatNumber(overview.singleAttemptProblems?.count ?? 0),
        subtitle: overview.singleAttemptProblems
          ? `${overview.singleAttemptProblems.percentage.toFixed(2)}%`
          : undefined,
      }
    ];
  }

  private buildHighlights(statistics: ContestUserStatisticsResponse) {
    const overview = statistics.overview;
    this.highlightCards = [
      {
        key: 'mostAttempts',
        label: 'Contests.UserStatistics.MostAttemptsProblem',
        icon: 'attempt',
        contestTitle: overview.mostAttemptsProblem?.contestTitle,
        contestLink: overview.mostAttemptsProblem
          ? this.getContestProblemLink(overview.mostAttemptsProblem.contestId, overview.mostAttemptsProblem.problemSymbol)
          : undefined,
        meta: overview.mostAttemptsProblem
          ? `${this.formatNumber(overview.mostAttemptsProblem.attemptsCount)} ${this.translateService.instant('Attempts')}`
          : undefined,
        valueLabel: overview.mostAttemptsProblem?.problemSymbol,
      },
      {
        key: 'fastest',
        label: 'Contests.UserStatistics.FastestSolve',
        icon: 'statistics',
        contestTitle: overview.fastestSolve?.contestTitle,
        contestLink: overview.fastestSolve
          ? this.getContestProblemLink(overview.fastestSolve.contestId, overview.fastestSolve.problemSymbol)
          : undefined,
        meta: overview.fastestSolve?.time,
        valueLabel: overview.fastestSolve?.problemSymbol,
      },
      {
        key: 'slowest',
        label: 'Contests.UserStatistics.SlowestSolve',
        icon: 'statistics',
        contestTitle: overview.slowestSolve?.contestTitle,
        contestLink: overview.slowestSolve
          ? this.getContestProblemLink(overview.slowestSolve.contestId, overview.slowestSolve.problemSymbol)
          : undefined,
        meta: overview.slowestSolve?.time,
        valueLabel: overview.slowestSolve?.problemSymbol,
      }
    ];
  }

  private buildContestCards(ranks: ContestUserStatisticsContestRanks | null, deltas: ContestUserStatisticsContestDeltas | null) {
    this.contestRankCards = [
      {
        key: 'bestRank',
        label: 'Contests.UserStatistics.BestRank',
        icon: 'ranking',
        contestTitle: ranks?.best?.contestTitle,
        contestLink: ranks?.best ? this.getContestLink(ranks.best.contestId) : undefined,
        value: ranks?.best ? `#${ranks.best.rank}` : undefined,
        subtitle: ranks?.best ? this.translateService.instant('Contests.UserStatistics.Participants', { total: ranks.best.participantsCount }) : undefined,
      },
      {
        key: 'worstRank',
        label: 'Contests.UserStatistics.ToughestRank',
        icon: 'ranking',
        contestTitle: ranks?.worst?.contestTitle,
        contestLink: ranks?.worst ? this.getContestLink(ranks.worst.contestId) : undefined,
        value: ranks?.worst ? `#${ranks.worst.rank}` : undefined,
        subtitle: ranks?.worst ? this.translateService.instant('Contests.UserStatistics.Participants', { total: ranks.worst.participantsCount }) : undefined,
      }
    ];

    this.contestDeltaCards = [
      {
        key: 'bestDelta',
        label: 'Contests.UserStatistics.BestDelta',
        icon: 'statistics',
        contestTitle: deltas?.best?.contestTitle,
        contestLink: deltas?.best ? this.getContestLink(deltas.best.contestId) : undefined,
        value: deltas?.best ? `+${deltas.best.delta}` : undefined,
        subtitle: deltas?.best ? this.translateService.instant('Contests.UserStatistics.Participants', { total: deltas.best.participantsCount }) : undefined,
      },
      {
        key: 'worstDelta',
        label: 'Contests.UserStatistics.WorstDelta',
        icon: 'statistics',
        contestTitle: deltas?.worst?.contestTitle,
        contestLink: deltas?.worst ? this.getContestLink(deltas.worst.contestId) : undefined,
        value: deltas?.worst ? deltas.worst.delta.toString() : undefined,
        subtitle: deltas?.worst ? this.translateService.instant('Contests.UserStatistics.Participants', { total: deltas.worst.participantsCount }) : undefined,
      }
    ];
  }

  private buildTimeline(statistics: ContestUserStatisticsResponse) {
    this.timeline = statistics.timeline ?? [];

    if (!this.timeline.length) {
      this.timelineChart = null;
      return;
    }

    this.timelineChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data: this.timeline.map(item => item.attempts),
        }
      ],
      chart: {
        type: 'bar',
        height: 340,
      },
      plotOptions: {
        bar: {
          columnWidth: '55%',
          borderRadius: 6,
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.timeline.map(item => item.range),
        labels: {
          rotate: -45,
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
        }
      },
      colors: [Colors.solid.primary],
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)} ${this.translateService.instant('Attempts')}`,
        }
      }
    } as ChartOptions;
  }

  private buildLanguagesChart(statistics: ContestUserStatisticsResponse) {
    const languages = statistics.languages ?? [];
    if (!languages.length) {
      this.languagesChart = null;
      return;
    }

    this.languagesChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data: languages.map(language => language.attemptsCount),
        }
      ],
      chart: {
        type: 'bar',
        height: Math.max(240, languages.length * 38),
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: languages.map(language => language.langFull),
      },
      colors: [Colors.solid.primary],
    } as ChartOptions;
  }

  private buildVerdictsChart(statistics: ContestUserStatisticsResponse) {
    const verdicts = statistics.verdicts ?? [];
    if (!verdicts.length) {
      this.verdictsChart = null;
      return;
    }

    const totalAttempts = verdicts.reduce((sum, item) => sum + item.attemptsCount, 0);
    if (!totalAttempts) {
      this.verdictsChart = null;
      return;
    }

    const labelMap: Record<string, string> = {
      AC: 'Contests.Verdicts.Accepted',
      WA: 'Contests.Verdicts.WrongAnswer',
      TLE: 'Contests.Verdicts.TimeLimitExceeded',
      OTHER: 'Contests.Verdicts.Other',
    };

    this.verdictsChart = {
      series: verdicts.map(item => item.attemptsCount) as any,
      labels: verdicts.map(item => this.translateService.instant(labelMap[item.verdict] ?? item.verdict)),
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
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: this.translateService.instant('Attempts'),
              }
            }
          }
        }
      }
    } as unknown as ChartOptions;
  }

  private buildTagAndSymbolCharts(statistics: ContestUserStatisticsResponse) {
    const tags = (statistics.tags ?? []).slice(0, 10);
    const symbols = (statistics.symbols ?? []).slice(0, 12);

    const palette = [
      Colors.solid.primary,
      Colors.solid.info,
      Colors.solid.success,
      Colors.solid.warning,
      Colors.solid.danger,
      Colors.solid.secondary,
    ];

    const buildDonutChart = (labels: string[], series: number[]) => {
      const total = series.reduce((sum, value) => sum + value, 0);
      if (!total) {
        return null;
      }

      const colors = labels.map((_, index) => palette[index % palette.length]);

      return {
        series: series as any,
        labels,
        chart: {
          type: 'donut',
          height: 320,
        },
        colors,
        legend: {
          position: 'bottom',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: this.translateService.instant('Solved'),
                }
              }
            }
          }
        }
      } as unknown as ChartOptions;
    };

    this.tagsChart = tags.length
      ? buildDonutChart(tags.map(tag => tag.name), tags.map(tag => tag.solved))
      : null;

    this.symbolsChart = symbols.length
      ? buildDonutChart(symbols.map(symbol => symbol.symbol), symbols.map(symbol => symbol.solved))
      : null;
  }

  private buildOpponents(statistics: ContestUserStatisticsResponse) {
    this.topOpponents = (statistics.worthyOpponents ?? []).slice(0, 3);
  }

  private formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
  }
}
