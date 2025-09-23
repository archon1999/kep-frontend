import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SectionProfileComponent } from '@problems/pages/statistics/section-profile/section-profile.component';
import {
  Difficulties,
  SectionDifficultiesComponent
} from '@problems/pages/statistics/section-difficulties/section-difficulties.component';
import { SectionActivityComponent } from '@problems/pages/statistics/section-activity/section-activity.component';
import { SectionHeatmapComponent } from '@problems/pages/statistics/section-heatmap/section-heatmap.component';
import { Facts, SectionFactsComponent } from '@problems/pages/statistics/section-facts/section-facts.component';
import { SectionTimeComponent } from '@problems/pages/statistics/section-time/section-time.component';
import {
  SectionAttemptsForSolveComponent
} from '@problems/pages/statistics/section-attempts-for-solve/section-attempts-for-solve.component';
import { AuthUser } from '@auth';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { Subscription } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralInfo } from '@problems/models/statistics.models';
import { BasePageComponent } from "@core/common";
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { Resources } from "@app/resources";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";

interface ProblemsStatisticsMeta {
  lastDays: number;
  allowedLastDays: number[];
  heatmapRange: {
    from: string;
    to: string;
  };
}

interface ProblemsLastDays {
  series: number[];
  solved: number;
}

interface ProblemsLangStat {
  lang: string;
  langFull: string;
  solved: number;
}

interface ProblemsTagStat {
  name: string;
  value: number;
}

interface ProblemsTopicStat {
  topic: string;
  solved: number;
  code: string;
  id: number;
}

interface ProblemsHeatmapEntry {
  date: string;
  solved: number;
}

interface NumberOfAttemptsStat {
  chartSeries: Array<{ attemptsCount: number; value: number }>;
}

interface TimeDistributionEntry {
  day?: string;
  month?: string;
  period?: string;
  solved: number;
}

interface ProblemsStatisticsResponse {
  general: GeneralInfo;
  byDifficulty: Difficulties;
  byTopic: ProblemsTopicStat[];
  facts: Facts;
  byLang: ProblemsLangStat[];
  byTag: ProblemsTagStat[];
  byWeekday: TimeDistributionEntry[];
  byMonth: TimeDistributionEntry[];
  byPeriod: TimeDistributionEntry[];
  lastDays: ProblemsLastDays;
  heatmap: ProblemsHeatmapEntry[];
  numberOfAttempts: NumberOfAttemptsStat;
  meta: ProblemsStatisticsMeta;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    SectionProfileComponent,
    SectionDifficultiesComponent,
    SectionActivityComponent,
    SectionHeatmapComponent,
    SectionFactsComponent,
    SectionTimeComponent,
    SectionAttemptsForSolveComponent,
    KepCardComponent,
    SpinnerComponent,
    KepIconComponent,
    TranslateModule,
    ContentHeaderModule
  ]
})
export class StatisticsComponent extends BasePageComponent implements OnInit, OnDestroy {
  public username: string;
  public isLoading = false;
  public statistics: ProblemsStatisticsResponse | null = null;
  public selectedDays: number | null = null;
  public selectedYear: number | null = null;
  public availableYears: number[] = [];
  public availableDays: number[] = [];
  public overviewCards: Array<{
    titleKey: string;
    value: string | number;
    icon: string;
    subtitle?: string;
    isNumber?: boolean
  }> = [];

  protected statisticsService = inject(ProblemsStatisticsService);
  private statisticsSubscription: Subscription | null = null;

  afterChangeCurrentUser(currentUser: AuthUser) {
    this.username = currentUser.username;
    this.loadStatistics();
    this.loadContentHeader();
  }

  ngOnDestroy() {
    this.statisticsSubscription?.unsubscribe();
  }

  public handleDaysChange(days: number) {
    if (days === this.selectedDays) {
      return;
    }
    this.selectedDays = days;
    this.loadStatistics();
  }

  public handleYearChange(year: number) {
    if (year === this.selectedYear) {
      return;
    }
    this.selectedYear = year;
    this.loadStatistics();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'UserStatistics',
      breadcrumb: {
        links: [
          {
            name: 'Problems',
            isLink: true,
            link: Resources.Problems,
          },
          {
            name: this.currentUser?.username,
            isLink: false,
          },
        ]
      }
    };
  }

  private loadStatistics() {
    if (!this.username) {
      return;
    }

    const year = this.selectedYear ?? new Date().getFullYear();
    const days = this.selectedDays ?? undefined;
    this.selectedYear = year;

    this.isLoading = true;
    this.statisticsSubscription?.unsubscribe();
    const params: { year: number; days?: number } = {year};
    if (typeof days === 'number') {
      params.days = days;
    }
    this.statisticsSubscription = this.statisticsService.getStatistics(this.username, params)
      .subscribe({
        next: (statistics: ProblemsStatisticsResponse) => {
          this.statistics = statistics;
          this.isLoading = false;
          this.setupMeta(statistics.meta);
          this.buildOverviewCards(statistics);
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  private setupMeta(meta: ProblemsStatisticsMeta) {
    if (!meta) {
      return;
    }

    this.selectedDays = meta.lastDays ?? this.selectedDays;
    this.availableDays = meta.allowedLastDays ?? [];

    const from = new Date(meta.heatmapRange?.from ?? '');
    const to = new Date(meta.heatmapRange?.to ?? '');
    this.availableYears = [2024, 2025];
    if (!this.selectedYear && this.availableYears.length) {
      this.selectedYear = this.availableYears[0];
    }
  }

  private buildOverviewCards(statistics: ProblemsStatisticsResponse) {
    if (!statistics) {
      this.overviewCards = [];
      return;
    }

    const rankSubtitle = statistics.general?.usersCount.toString();

    this.overviewCards = [
      {
        titleKey: 'Solved',
        value: statistics.general?.solved ?? 0,
        icon: 'check-circle',
        subtitle: this.translateService.instant('Problems'),
        isNumber: true
      },
      {
        titleKey: 'Rating',
        value: statistics.general?.rating ?? 0,
        subtitle: '-',
        icon: 'rating',
        isNumber: true
      },
      {
        titleKey: 'Rank',
        value: statistics.general?.rank ?? '-',
        icon: 'users',
        subtitle: rankSubtitle
      },
      {
        titleKey: 'SolvedWithSingleAttempt',
        value: statistics.facts?.solvedWithSingleAttempt ?? 0,
        icon: 'award',
        subtitle: statistics.facts?.solvedWithSingleAttemptPercentage
          ? `${statistics.facts.solvedWithSingleAttemptPercentage}%`
          : undefined,
        isNumber: true
      }
    ];
  }
}
