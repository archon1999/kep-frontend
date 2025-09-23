import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContestsService } from '@contests/contests.service';
import {
  ContestUserStatistics,
  ContestUserStatisticsLanguage,
  ContestUserStatisticsVerdict,
} from '@contests/models';
import { Subscription } from 'rxjs';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { colors as Colors } from '@core/config/colors';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { AuthUser } from '@auth';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';

interface OverviewCard {
  key: string;
  titleKey: string;
  value: number | string;
  icon: string;
  isNumber?: boolean;
  subtitle?: string;
  subtitleKey?: string;
  subtitleParams?: Record<string, unknown>;
}

@Component({
  selector: 'contests-user-statistics',
  standalone: true,
  templateUrl: './user-statistics.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepCardComponent,
    SpinnerComponent,
    KepIconComponent,
    ApexChartModule,
    ResourceByIdPipe,
  ],
})
export class ContestsUserStatisticsComponent extends BasePageComponent implements OnDestroy {
  public username: string | null = null;
  public isLoading = true;
  public statistics: ContestUserStatistics | null = null;
  public overviewCards: OverviewCard[] = [];
  public timelineChart: ChartOptions | null = null;
  public languagesTotal = 0;
  public verdictsTotal = 0;

  private statisticsSubscription: Subscription | null = null;

  constructor(
    private readonly contestsService: ContestsService,
  ) {
    super();
  }

  override ngOnDestroy(): void {
    this.statisticsSubscription?.unsubscribe();
    super.ngOnDestroy();
  }

  protected override afterChangeCurrentUser(currentUser: AuthUser): void {
    if (!currentUser?.username || currentUser.username === this.username) {
      return;
    }

    this.username = currentUser.username;
    this.loadContentHeader();
    this.loadStatistics();
  }

  protected getContentHeader(): ContentHeader {
    const links: Array<{ name?: string; isLink?: boolean; link?: string }> = [
      {
        name: 'Contests.Contests',
        isLink: true,
        link: '..',
      },
    ];

    if (this.username) {
      links.push({
        name: this.username,
        isLink: false,
      });
    }

    return {
      headerTitle: 'Contests.UserStatistics',
      breadcrumb: {
        links,
      },
    };
  }

  public getLanguagePercentage(language: ContestUserStatisticsLanguage): number {
    if (!this.languagesTotal) {
      return 0;
    }

    return (language.attemptsCount / this.languagesTotal) * 100;
  }

  public getLanguageColor(lang: string): string {
    return Colors.lang?.[lang] ?? Colors.solid.primary;
  }

  public getVerdictPercentage(verdict: ContestUserStatisticsVerdict): number {
    if (!this.verdictsTotal) {
      return 0;
    }

    return (verdict.attemptsCount / this.verdictsTotal) * 100;
  }

  public getVerdictColor(verdict: string): string {
    switch (verdict) {
      case 'AC':
        return Colors.solid.success;
      case 'WA':
        return Colors.solid.danger;
      case 'TLE':
        return Colors.solid.warning;
      default:
        return Colors.solid.secondary;
    }
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

  public formatDelta(delta: number | null | undefined): string {
    if (typeof delta !== 'number') {
      return '0';
    }

    if (delta > 0) {
      return `+${delta}`;
    }

    return `${delta}`;
  }

  public getDeltaBadgeClass(delta: number | null | undefined): string {
    if (typeof delta !== 'number' || delta === 0) {
      return 'badge bg-secondary';
    }

    return delta > 0 ? 'badge bg-success' : 'badge bg-danger';
  }

  private loadStatistics(): void {
    if (!this.username) {
      return;
    }

    this.isLoading = true;
    this.statisticsSubscription?.unsubscribe();
    this.statisticsSubscription = this.contestsService.getUserContestsStatistics(this.username)
      .subscribe({
        next: (statistics) => {
          this.statistics = statistics;
          this.buildOverviewCards(statistics);
          this.buildTimelineChart(statistics);
          this.calculateAggregations(statistics);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private buildOverviewCards(statistics: ContestUserStatistics): void {
    this.overviewCards = [
      {
        key: 'rating',
        titleKey: 'Contests.UserStats.CurrentRating',
        value: statistics.general.rating,
        icon: 'rating',
        isNumber: true,
        subtitle: statistics.general.ratingTitle,
      },
      {
        key: 'maxRating',
        titleKey: 'Contests.UserStats.BestRating',
        value: statistics.general.maxRating,
        icon: 'ranking',
        isNumber: true,
        subtitle: statistics.general.maxRatingTitle,
      },
      {
        key: 'ratingPlace',
        titleKey: 'Contests.UserStats.RatingPlace',
        value: `#${statistics.general.ratingPlace}`,
        icon: 'users',
        subtitleKey: 'Contests.UserStats.OutOfContestants',
        subtitleParams: { count: statistics.general.contestantsCount },
      },
      {
        key: 'totalSolved',
        titleKey: 'Contests.UserStats.TotalSolved',
        value: statistics.overview.totalAccepted,
        icon: 'verdict',
        isNumber: true,
        subtitleKey: 'Contests.UserStats.AttemptsSubtitle',
        subtitleParams: { attempts: statistics.overview.totalAttempts },
      },
    ];
  }

  private buildTimelineChart(statistics: ContestUserStatistics): void {
    const categories = statistics.timeline?.map(item => item.range) ?? [];
    const data = statistics.timeline?.map(item => item.attempts) ?? [];

    if (!categories.length || !data.length) {
      this.timelineChart = null;
      return;
    }

    const attemptsLabel = this.translateService.instant('Attempts');

    this.timelineChart = {
      series: [
        {
          name: attemptsLabel,
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
        },
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
        },
      },
      colors: [Colors.solid.primary],
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)} ${attemptsLabel}`,
        },
      },
    } as ChartOptions;
  }

  private calculateAggregations(statistics: ContestUserStatistics): void {
    this.languagesTotal = (statistics.languages || []).reduce((total, item) => total + (item.attemptsCount || 0), 0);
    this.verdictsTotal = (statistics.verdicts || []).reduce((total, item) => total + (item.attemptsCount || 0), 0);
  }
}
