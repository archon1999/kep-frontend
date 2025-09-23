import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SectionProfileComponent } from '@problems/pages/statistics/section-profile/section-profile.component';
import { SectionDifficultiesComponent } from '@problems/pages/statistics/section-difficulties/section-difficulties.component';
import { SectionActivityComponent } from '@problems/pages/statistics/section-activity/section-activity.component';
import { SectionHeatmapComponent } from '@problems/pages/statistics/section-heatmap/section-heatmap.component';
import { SectionFactsComponent } from '@problems/pages/statistics/section-facts/section-facts.component';
import { SectionTimeComponent } from '@problems/pages/statistics/section-time/section-time.component';
import { SectionAttemptsForSolveComponent } from '@problems/pages/statistics/section-attempts-for-solve/section-attempts-for-solve.component';
import { BaseComponent } from '@core/common/classes/base.component';
import { AuthUser } from '@auth';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { takeUntil } from 'rxjs/operators';
import {
  ProblemsStatisticsResponse,
  ProblemsStatisticsMeta,
  HeatmapEntry,
} from '@problems/models/statistics.models';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

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
    SpinnerComponent,
    KepCardComponent,
    KepIconComponent,
  ]
})
export class StatisticsComponent extends BaseComponent implements OnInit {
  public username: string;

  public isLoading = false;
  public statistics: ProblemsStatisticsResponse;
  public overviewCards: StatisticsOverviewCard[] = [];
  public allowedDays: number[] = [];
  public selectedDays = 7;
  public availableYears: number[] = [];
  public selectedYear = new Date().getFullYear();

  private queryUsername: string;

  constructor(
    private statisticsService: ProblemsStatisticsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        this.queryUsername = params['username'];
        this.applyUsername();
      }
    );
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    this.applyUsername();
  }

  onActivityRangeChange(days: number) {
    this.selectedDays = days;
    this.fetchStatistics();
  }

  onHeatmapYearChange(year: number) {
    this.selectedYear = year;
    this.fetchStatistics();
  }

  private applyUsername() {
    const targetUsername = this.queryUsername || this.currentUser?.username;

    if (!targetUsername || targetUsername === this.username) {
      return;
    }

    if (this.username && this.username !== targetUsername) {
      this.statisticsService.clearCache(this.username);
    }

    this.username = targetUsername;
    this.fetchStatistics();
  }

  private fetchStatistics() {
    if (!this.username) {
      return;
    }

    this.isLoading = true;

    this.statisticsService.getStatistics(this.username, {
      days: this.selectedDays,
      year: this.selectedYear,
    }).pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.statistics = response;
          this.updateMeta(response.meta, response.heatmap);
          this.buildOverviewCards(response);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private updateMeta(meta: ProblemsStatisticsMeta, heatmap: HeatmapEntry[]) {
    this.allowedDays = (meta?.allowedLastDays || []).slice().sort((a, b) => a - b);

    if (meta?.lastDays && meta.lastDays !== this.selectedDays) {
      this.selectedDays = meta.lastDays;
    } else if (this.allowedDays.length && !this.allowedDays.includes(this.selectedDays)) {
      this.selectedDays = this.allowedDays[0];
    }

    const yearsFromRange = this.buildYears(meta?.heatmapRange);
    const yearsFromHeatmap = Array.from(new Set((heatmap || []).map((entry) => new Date(entry.date).getFullYear())));
    const combinedYears = Array.from(new Set([...yearsFromRange, ...yearsFromHeatmap]));

    this.availableYears = combinedYears.sort((a, b) => b - a);

    if (this.availableYears.length && !this.availableYears.includes(this.selectedYear)) {
      this.selectedYear = this.availableYears[0];
    }
  }

  private buildOverviewCards(statistics: ProblemsStatisticsResponse) {
    this.overviewCards = [
      {
        key: 'solved',
        label: 'Solved',
        value: statistics.general?.solved ?? 0,
        icon: 'check-circle',
        iconColor: 'success',
      },
      {
        key: 'rating',
        label: 'Rating',
        value: statistics.general?.rating ?? 0,
        icon: 'rating',
        iconColor: 'warning',
      },
      {
        key: 'rank',
        label: 'Rank',
        value: statistics.general?.rank ?? 0,
        subtitle: statistics.general?.usersCount ? this.translateService.instant('Users') + ': ' + statistics.general.usersCount : '',
        icon: 'users',
        iconColor: 'primary',
      },
      {
        key: 'singleAttempt',
        label: 'SolvedWithSingleAttempt',
        value: statistics.facts?.solvedWithSingleAttempt ?? 0,
        subtitle: statistics.facts?.solvedWithSingleAttemptPercentage !== undefined
          ? statistics.facts.solvedWithSingleAttemptPercentage + '%'
          : '',
        icon: 'zap',
        iconColor: 'info',
      },
    ];
  }

  private buildYears(range?: { from: string; to: string }): number[] {
    if (!range?.from || !range?.to) {
      return [];
    }

    const startYear = new Date(range.from).getFullYear();
    const endYear = new Date(range.to).getFullYear();

    const years: number[] = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  }
}

interface StatisticsOverviewCard {
  key: string;
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor: 'primary' | 'success' | 'warning' | 'info';
}
