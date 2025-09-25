import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersApiService } from '@app/modules/users';
import {
  AchievementUnlockedActivity,
  ArenaParticipationActivity,
  ChallengeSummaryActivity,
  DailyActivityActivity,
  DailyTaskCompletedActivity,
  HardProblemSolvedActivity,
  ProblemAttemptSummaryActivity,
  ProjectAttemptSummaryActivity,
  TestPassSummaryActivity,
  ContestParticipationActivity,
  UserActivityHistoryItem,
  UserActivityHistoryType,
} from '@users/domain';
import { PageResult } from '@core/common/classes/page-result';
import { UserActivityHistoryProblemAttemptSummaryComponent } from './components/problem-attempt-summary.component';
import { UserActivityHistoryChallengeSummaryComponent } from './components/challenge-summary.component';
import { UserActivityHistoryProjectAttemptSummaryComponent } from './components/project-attempt-summary.component';
import { UserActivityHistoryTestPassSummaryComponent } from './components/test-pass-summary.component';
import { UserActivityHistoryContestParticipationComponent } from './components/contest-participation.component';
import { UserActivityHistoryArenaParticipationComponent } from './components/arena-participation.component';
import { UserActivityHistoryDailyActivityComponent } from './components/daily-activity.component';
import { UserActivityHistoryHardProblemSolvedComponent } from './components/hard-problem-solved.component';
import { UserActivityHistoryAchievementUnlockedComponent } from './components/achievement-unlocked.component';
import { UserActivityHistoryDailyTaskCompletedComponent } from './components/daily-task-completed.component';

interface UserActivityHistoryTypeConfig {
  cardClass: string;
  iconLabel: string;
}

@Component({
  selector: 'user-activity-history',
  templateUrl: './user-activity-history.component.html',
  styleUrl: './user-activity-history.component.scss',
  standalone: true,
  imports: [
    CoreCommonModule,
    TranslateModule,
    KepCardComponent,
    SpinnerComponent,
    UserActivityHistoryProblemAttemptSummaryComponent,
    UserActivityHistoryChallengeSummaryComponent,
    UserActivityHistoryProjectAttemptSummaryComponent,
    UserActivityHistoryTestPassSummaryComponent,
    UserActivityHistoryContestParticipationComponent,
    UserActivityHistoryArenaParticipationComponent,
    UserActivityHistoryDailyActivityComponent,
    UserActivityHistoryHardProblemSolvedComponent,
    UserActivityHistoryAchievementUnlockedComponent,
    UserActivityHistoryDailyTaskCompletedComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryComponent implements OnChanges {
  @Input() username?: string | null;

  protected activities: UserActivityHistoryItem[] = [];
  protected loading = false;
  protected hasMore = false;
  protected initialLoad = true;

  private readonly usersApi = inject(UsersApiService);
  private readonly pageSize = 10;
  private nextPage = 1;
  private totalPages = 0;

  private readonly typeConfig: Record<UserActivityHistoryType, UserActivityHistoryTypeConfig> = {
    problem_attempt_summary: { cardClass: 'primary', iconLabel: 'PS' },
    challenge_summary: { cardClass: 'secondary', iconLabel: 'CH' },
    project_attempt_summary: { cardClass: 'info', iconLabel: 'PR' },
    test_pass_summary: { cardClass: 'success', iconLabel: 'TS' },
    contest_participation: { cardClass: 'warning', iconLabel: 'CT' },
    arena_participation: { cardClass: 'danger', iconLabel: 'AR' },
    daily_activity: { cardClass: 'primary', iconLabel: 'DA' },
    hard_problem_solved: { cardClass: 'success', iconLabel: 'HP' },
    achievement_unlocked: { cardClass: 'warning', iconLabel: 'AC' },
    daily_task_completed: { cardClass: 'info', iconLabel: 'DT' },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      this.reset();
      if (this.username) {
        this.loadActivities();
      }
    }
  }

  protected loadMore(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loadActivities();
  }

  protected trackById(_: number, activity: UserActivityHistoryItem): number {
    return activity.id;
  }

  protected getCardClass(activity: UserActivityHistoryItem): string {
    return `mt-0 ${this.typeConfig[activity.activityType]?.cardClass ?? 'primary'}`;
  }

  protected getIconLabel(activity: UserActivityHistoryItem): string {
    return this.typeConfig[activity.activityType]?.iconLabel ?? this.buildAbbreviation(activity.activityTypeDisplay);
  }

  protected getActivityType(activity: UserActivityHistoryItem): UserActivityHistoryType {
    return activity.activityType;
  }

  private loadActivities(): void {
    if (!this.username) {
      return;
    }

    const pageToLoad = this.nextPage;

    this.loading = true;

    this.usersApi
      .getUserActivityHistory(this.username, { page: pageToLoad, pageSize: this.pageSize })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response: PageResult<UserActivityHistoryItem>) => {
          const data = response?.data ?? [];
          this.activities = [...this.activities, ...data];

          if (response?.pagesCount) {
            this.totalPages = response.pagesCount;
          } else if (response?.total !== undefined && response?.pageSize) {
            this.totalPages = Math.max(1, Math.ceil(response.total / response.pageSize));
          }

          const currentPage = response?.page ?? pageToLoad;
          this.nextPage = currentPage + 1;

          if (this.totalPages > 0) {
            this.hasMore = this.nextPage <= this.totalPages;
          } else {
            this.hasMore = data.length === this.pageSize;
          }
        },
        error: () => {
          this.loading = false;
          this.hasMore = false;
          this.initialLoad = false;
        },
        complete: () => {
          this.loading = false;
          this.initialLoad = false;
        },
      });
  }

  private reset(): void {
    this.activities = [];
    this.loading = false;
    this.hasMore = false;
    this.initialLoad = true;
    this.nextPage = 1;
    this.totalPages = 0;
  }

  private buildAbbreviation(display: string): string {
    if (!display) {
      return '••';
    }

    const words = display.split(' ').filter(Boolean);
    const abbreviation = words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');

    return abbreviation || display.slice(0, 2).toUpperCase();
  }
}
