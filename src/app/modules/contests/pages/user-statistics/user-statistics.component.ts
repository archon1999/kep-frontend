import { Component, OnDestroy } from '@angular/core';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestsService } from '@contests/contests.service';
import {
  ContestUserStatistics,
  ContestUserStatisticsContestDeltas,
  ContestUserStatisticsContestRanks,
  ContestUserStatisticsLanguage,
  ContestUserStatisticsTopAttempt,
  ContestUserStatisticsUnsolvedProblem,
  ContestUserStatisticsVerdict,
  ContestUserStatisticsWorthyOpponent,
} from '@contests/models';
import { AuthUser } from '@auth';
import { Subscription } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';

interface StatisticCard {
  title: string;
  value: number | string;
  icon: string;
  subtitle?: string;
  format?: 'number' | 'decimal';
}

interface HighlightCard {
  title: string;
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  meta: string;
}

interface SpeedHighlight {
  title: string;
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  time: string;
}

interface DistributionItem<T> {
  data: T;
  percentage: number;
}

@Component({
  selector: 'contests-user-statistics',
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepCardComponent,
    ApexChartModule,
  ],
  templateUrl: './user-statistics.component.html',
})
export class UserStatisticsComponent extends BasePageComponent implements OnDestroy {
  public username: string | null = null;
  public isLoading = false;
  public statistics: ContestUserStatistics | null = null;

  public overviewCards: StatisticCard[] = [];
  public performanceCards: StatisticCard[] = [];
  public highlightCards: HighlightCard[] = [];
  public speedHighlights: SpeedHighlight[] = [];
  public contestRanks: ContestUserStatisticsContestRanks | null = null;
  public contestDeltas: ContestUserStatisticsContestDeltas | null = null;
  public unsolvedProblems: ContestUserStatisticsUnsolvedProblem[] = [];
  public topAttempts: ContestUserStatisticsTopAttempt[] = [];
  public worthyOpponents: ContestUserStatisticsWorthyOpponent[] = [];

  public languages: Array<DistributionItem<ContestUserStatisticsLanguage>> = [];
  public verdicts: Array<DistributionItem<ContestUserStatisticsVerdict>> = [];
  public tags: { name: string; solved: number }[] = [];
  public symbols: { symbol: string; solved: number }[] = [];

  public timelineChart: ChartOptions | null = null;

  private statisticsSubscription: Subscription | null = null;

  constructor(
    private readonly contestsService: ContestsService,
    private readonly translateService: TranslateService,
  ) {
    super();
  }

  override ngOnDestroy(): void {
    this.statisticsSubscription?.unsubscribe();
    super.ngOnDestroy();
  }

  override afterChangeCurrentUser(currentUser: AuthUser | null): void {
    this.username = currentUser?.username ?? null;
    if (this.username) {
      this.loadContentHeader();
      this.fetchStatistics();
    }
  }

  protected override getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Contests.UserStatistics',
      breadcrumb: {
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: this.Resources.Contests,
          },
          {
            name: this.username ?? '',
            isLink: false,
          },
        ],
      },
    };
  }

  public getVerdictTranslationKey(verdict: string): string {
    switch (verdict) {
      case 'AC':
        return 'Contests.Verdicts.Accepted';
      case 'WA':
        return 'Contests.Verdicts.WrongAnswer';
      case 'TLE':
        return 'Contests.Verdicts.TimeLimitExceeded';
      default:
        return 'Contests.Verdicts.Other';
    }
  }

  private fetchStatistics(): void {
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
          this.buildOverview(statistics);
          this.buildPerformance(statistics);
          this.buildHighlights(statistics);
          this.buildRanks(statistics);
          this.buildDeltas(statistics);
          this.buildTimeline(statistics);
          this.buildDistributions(statistics);
          this.buildCollections(statistics);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.statistics = null;
          this.cdr.markForCheck();
        }
      });
  }

  private buildOverview(statistics: ContestUserStatistics): void {
    const general = statistics.general;
    if (!general) {
      this.overviewCards = [];
      return;
    }

    this.overviewCards = [
      {
        title: 'Contests.CurrentRating',
        value: general.rating ?? 0,
        icon: 'rating',
        subtitle: general.ratingTitle,
        format: 'number',
      },
      {
        title: 'Contests.MaxRating',
        value: general.maxRating ?? 0,
        icon: 'contest',
        subtitle: general.maxRatingTitle,
        format: 'number',
      },
      {
        title: 'Contests.RatingPlace',
        value: general.ratingPlace ?? '-',
        icon: 'statistics',
        subtitle: general.contestantsCount
          ? this.translateService.instant('Contests.OutOfContestants', { count: general.contestantsCount })
          : undefined,
      },
      {
        title: 'Contests.ContestantsCount',
        value: general.contestantsCount ?? 0,
        icon: 'users',
        format: 'number',
      },
    ];
  }

  private buildPerformance(statistics: ContestUserStatistics): void {
    const overview = statistics.overview;
    if (!overview) {
      this.performanceCards = [];
      return;
    }

    this.performanceCards = [
      {
        title: 'Contests.TotalAttempts',
        value: overview.totalAttempts ?? 0,
        icon: 'attempts',
        format: 'number',
      },
      {
        title: 'Contests.TotalAccepted',
        value: overview.totalAccepted ?? 0,
        icon: 'verdict',
        format: 'number',
      },
      {
        title: 'Contests.AverageAttemptsPerProblem',
        value: overview.averageAttemptsPerProblem ?? 0,
        icon: 'statistics',
        format: 'decimal',
      },
      {
        title: 'Contests.SingleAttemptProblems',
        value: overview.singleAttemptProblems?.count ?? 0,
        icon: 'contest',
        subtitle: typeof overview.singleAttemptProblems?.percentage === 'number'
          ? this.translateService.instant('Contests.SingleAttemptProblemsSubtitle', {
            percentage: overview.singleAttemptProblems.percentage,
          })
          : undefined,
        format: 'number',
      },
    ];
  }

  private buildHighlights(statistics: ContestUserStatistics): void {
    this.highlightCards = [];
    this.speedHighlights = [];

    const mostAttempts = statistics.overview?.mostAttemptsProblem;
    if (mostAttempts) {
      this.highlightCards.push({
        title: 'Contests.MostAttemptsProblem',
        contestId: mostAttempts.contestId,
        contestTitle: mostAttempts.contestTitle,
        problemSymbol: mostAttempts.problemSymbol,
        meta: this.translateService.instant('Contests.AttemptsCount', { count: mostAttempts.attemptsCount }),
      });
    }

    const fastestSolve = statistics.overview?.fastestSolve;
    if (fastestSolve) {
      this.speedHighlights.push({
        title: 'Contests.FastestSolve',
        contestId: fastestSolve.contestId,
        contestTitle: fastestSolve.contestTitle,
        problemSymbol: fastestSolve.problemSymbol,
        time: fastestSolve.time,
      });
    }

    const slowestSolve = statistics.overview?.slowestSolve;
    if (slowestSolve) {
      this.speedHighlights.push({
        title: 'Contests.SlowestSolve',
        contestId: slowestSolve.contestId,
        contestTitle: slowestSolve.contestTitle,
        problemSymbol: slowestSolve.problemSymbol,
        time: slowestSolve.time,
      });
    }
  }

  private buildRanks(statistics: ContestUserStatistics): void {
    this.contestRanks = statistics.contestRanks ?? null;
  }

  private buildDeltas(statistics: ContestUserStatistics): void {
    this.contestDeltas = statistics.contestDeltas ?? null;
  }

  private buildTimeline(statistics: ContestUserStatistics): void {
    const timeline = statistics.timeline ?? [];
    if (!timeline.length) {
      this.timelineChart = null;
      return;
    }

    const categories = timeline.map(item => item.range);
    const data = timeline.map(item => item.attempts);

    this.timelineChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data,
        },
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
        },
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
          trim: false,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value} ${this.translateService.instant('Attempts')}`,
        },
      },
    };
  }

  private buildDistributions(statistics: ContestUserStatistics): void {
    const languages = statistics.languages ?? [];
    const totalLanguageAttempts = languages.reduce((total, item) => total + (item.attemptsCount ?? 0), 0);
    this.languages = languages.map(item => ({
      data: item,
      percentage: totalLanguageAttempts ? Math.round((item.attemptsCount / totalLanguageAttempts) * 1000) / 10 : 0,
    }));

    const verdicts = statistics.verdicts ?? [];
    const totalVerdictAttempts = verdicts.reduce((total, item) => total + (item.attemptsCount ?? 0), 0);
    this.verdicts = verdicts.map(item => ({
      data: item,
      percentage: totalVerdictAttempts ? Math.round((item.attemptsCount / totalVerdictAttempts) * 1000) / 10 : 0,
    }));
  }

  private buildCollections(statistics: ContestUserStatistics): void {
    this.tags = (statistics.tags ?? []).slice(0, 20);
    this.symbols = statistics.symbols ?? [];
    this.unsolvedProblems = statistics.unsolvedProblems ?? [];
    this.topAttempts = statistics.topAttempts ?? [];
    this.worthyOpponents = statistics.worthyOpponents ?? [];
  }
}
