import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SectionProfileComponent } from '@problems/pages/statistics/section-profile/section-profile.component';
import {
  SectionDifficultiesComponent
} from '@problems/pages/statistics/section-difficulties/section-difficulties.component';
import { SectionHeatmapComponent } from '@problems/pages/statistics/section-heatmap/section-heatmap.component';
import { SectionFactsComponent } from '@problems/pages/statistics/section-facts/section-facts.component';
import { SectionTimeComponent } from '@problems/pages/statistics/section-time/section-time.component';
import {
  SectionAttemptsForSolveComponent
} from '@problems/pages/statistics/section-attempts-for-solve/section-attempts-for-solve.component';
import { BaseComponent } from '@core/common/classes/base.component';
import { AuthUser } from '@auth';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { ProblemsActivityCardComponent } from '@problems/components/problems-activity-card/problems-activity-card.component';
import {
  Difficulties,
  Facts,
  GeneralInfo,
  LangInfo,
  TagInfo,
  TopicInfo,
  ProblemsStatistics,
  WeekdaySolved,
  MonthSolved,
  PeriodSolved,
  LastDays,
  HeatmapEntry,
  NumberOfAttempts
} from '@problems/models/statistics.models';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

interface OverviewCard {
  titleKey: string;
  value: string;
  description?: string;
  icon: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    CommonModule,
    SectionProfileComponent,
    SectionDifficultiesComponent,
    SectionHeatmapComponent,
    SectionFactsComponent,
    SectionTimeComponent,
    SectionAttemptsForSolveComponent,
    ProblemsActivityCardComponent,
    SpinnerComponent,
    KepIconComponent,
  ]
})
export class StatisticsComponent extends BaseComponent implements OnInit {
  public username: string;

  public general: GeneralInfo | null = null;
  public langs: LangInfo[] = [];
  public tags: TagInfo[] = [];
  public topics: TopicInfo[] = [];
  public facts: Facts | null = null;
  public difficulties: Difficulties | null = null;
  public byWeekday: WeekdaySolved[] = [];
  public byMonth: MonthSolved[] = [];
  public byPeriod: PeriodSolved[] = [];
  public lastDays: LastDays | null = null;
  public heatmap: HeatmapEntry[] = [];
  public numberOfAttempts: NumberOfAttempts | null = null;

  public overviewCards: OverviewCard[] = [];

  public allowedDays: number[] = [3, 7, 14, 30];
  public selectedDays = 7;
  public availableYears: number[] = [];
  public selectedYear: number | null = null;

  public isLoading = false;
  public hasError = false;

  constructor(
    private statisticsService: ProblemsStatisticsService,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params['username']) {
          this.setUsername(params['username']);
        } else if (!this.username) {
          this.loadStatistics();
        }
      }
    );
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    if (!this.username) {
      this.setUsername(currentUser.username);
    }
  }

  public onDaysChange(days: number) {
    this.selectedDays = days;
    this.loadStatistics({ days });
  }

  public onYearChange(year: number) {
    this.selectedYear = year;
    this.loadStatistics({ year });
  }

  private setUsername(username: string) {
    if (username && username !== this.username) {
      this.username = username;
      this.loadStatistics({ reset: true });
    }
  }

  private loadStatistics(options: { year?: number; days?: number; reset?: boolean } = {}) {
    if (!this.username) {
      return;
    }

    if (options.reset) {
      this.selectedYear = null;
      this.selectedDays = 7;
    }

    const query: { year?: number; days?: number } = {};
    const year = options.year ?? this.selectedYear ?? new Date().getFullYear();
    const days = options.days ?? this.selectedDays ?? 7;
    if (year) {
      query.year = year;
    }
    if (days) {
      query.days = days;
    }

    this.isLoading = true;
    this.hasError = false;

    this.statisticsService.getStatistics(this.username, query).subscribe({
      next: (statistics: ProblemsStatistics) => {
        this.isLoading = false;
        this.hasError = false;
        this.applyStatistics(statistics, options);
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  private applyStatistics(statistics: ProblemsStatistics, options: { year?: number; days?: number }) {
    this.general = statistics.general;
    this.langs = statistics.byLang || [];
    this.tags = statistics.byTag || [];
    this.topics = statistics.byTopic || [];
    this.facts = statistics.facts;
    this.difficulties = statistics.byDifficulty;
    this.byWeekday = statistics.byWeekday || [];
    this.byMonth = statistics.byMonth || [];
    this.byPeriod = statistics.byPeriod || [];
    this.lastDays = statistics.lastDays;
    this.heatmap = statistics.heatmap || [];
    this.numberOfAttempts = statistics.numberOfAttempts;

    this.selectedDays = statistics.meta?.lastDays ?? options.days ?? this.selectedDays ?? 7;
    this.allowedDays = statistics.meta?.allowedLastDays?.length ? statistics.meta.allowedLastDays : this.allowedDays;

    const defaultYear = this.resolveDefaultYear(statistics);
    this.availableYears = this.buildYearRange(statistics.meta?.heatmapRange, defaultYear);

    if (options.year) {
      this.selectedYear = options.year;
    } else if (!this.selectedYear || !this.availableYears.includes(this.selectedYear)) {
      this.selectedYear = defaultYear;
    }

    this.buildOverviewCards();
  }

  private buildOverviewCards() {
    if (!this.general) {
      this.overviewCards = [];
      return;
    }

    const usersLabel = this.translateService.instant('Users');
    const singleAttempt = this.facts?.solvedWithSingleAttempt ?? 0;
    const singleAttemptPercentage = this.facts?.solvedWithSingleAttemptPercentage ?? 0;

    this.overviewCards = [
      {
        titleKey: 'Solved',
        value: this.formatNumber(this.general.solved),
        icon: 'check-circle',
      },
      {
        titleKey: 'Rating',
        value: this.formatNumber(this.general.rating),
        icon: 'rating',
      },
      {
        titleKey: 'Rank',
        value: `#${this.formatNumber(this.general.rank)}`,
        description: `${this.formatNumber(this.general.usersCount)} ${usersLabel}`,
        icon: 'users',
      },
      {
        titleKey: 'SolvedWithSingleAttempt',
        value: this.formatNumber(singleAttempt),
        description: `${singleAttemptPercentage}%`,
        icon: 'zap',
      }
    ];
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat().format(value);
  }

  private resolveDefaultYear(statistics: ProblemsStatistics): number {
    const to = statistics.meta?.heatmapRange?.to;
    if (to) {
      return new Date(to).getFullYear();
    }
    return new Date().getFullYear();
  }

  private buildYearRange(range?: { from: string; to: string }, fallback?: number): number[] {
    if (!range) {
      return fallback ? [fallback] : [];
    }
    const fromYear = new Date(range.from).getFullYear();
    const toYear = new Date(range.to).getFullYear();
    const years: number[] = [];
    for (let year = toYear; year >= fromYear; year--) {
      years.push(year);
    }
    if (!years.length && fallback) {
      years.push(fallback);
    }
    return years;
  }
}
