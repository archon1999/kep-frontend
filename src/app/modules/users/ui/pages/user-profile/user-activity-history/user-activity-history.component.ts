import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import {
  UserActivityHistoryItem,
  UserActivityType,
} from '@users/domain';
import { UsersApiService } from '@app/modules/users';
import { PageResult } from '@core/common/classes/page-result';
import { UserActivityProblemAttemptSummaryComponent } from './activity-items/activity-problem-attempt-summary.component';
import { UserActivityChallengeSummaryComponent } from './activity-items/activity-challenge-summary.component';
import { UserActivityProjectAttemptSummaryComponent } from './activity-items/activity-project-attempt-summary.component';
import { UserActivityTestPassSummaryComponent } from './activity-items/activity-test-pass-summary.component';
import { UserActivityContestParticipationComponent } from './activity-items/activity-contest-participation.component';
import { UserActivityArenaParticipationComponent } from './activity-items/activity-arena-participation.component';
import { UserActivityDailyActivityComponent } from './activity-items/activity-daily-activity.component';
import { UserActivityHardProblemSolvedComponent } from './activity-items/activity-hard-problem-solved.component';
import { UserActivityAchievementUnlockedComponent } from './activity-items/activity-achievement-unlocked.component';
import { UserActivityDailyTaskCompletedComponent } from './activity-items/activity-daily-task-completed.component';

type UserActivityHistoryResponse =
  | PageResult<UserActivityHistoryItem>
  | UserActivityHistoryItem[];

@Component({
  selector: 'user-activity-history',
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbar,
    TranslatePipe,
    KepCardComponent,
    UserActivityProblemAttemptSummaryComponent,
    UserActivityChallengeSummaryComponent,
    UserActivityProjectAttemptSummaryComponent,
    UserActivityTestPassSummaryComponent,
    UserActivityContestParticipationComponent,
    UserActivityArenaParticipationComponent,
    UserActivityDailyActivityComponent,
    UserActivityHardProblemSolvedComponent,
    UserActivityAchievementUnlockedComponent,
    UserActivityDailyTaskCompletedComponent,
  ],
  templateUrl: './user-activity-history.component.html',
  styleUrl: './user-activity-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryComponent implements OnChanges {
  @Input({required: true}) username!: string;

  protected readonly activityComponentMap: Record<
    UserActivityType,
    Type<unknown>
  > = {
    problem_attempt_summary: UserActivityProblemAttemptSummaryComponent,
    challenge_summary: UserActivityChallengeSummaryComponent,
    project_attempt_summary: UserActivityProjectAttemptSummaryComponent,
    test_pass_summary: UserActivityTestPassSummaryComponent,
    contest_participation: UserActivityContestParticipationComponent,
    arena_participation: UserActivityArenaParticipationComponent,
    daily_activity: UserActivityDailyActivityComponent,
    hard_problem_solved: UserActivityHardProblemSolvedComponent,
    achievement_unlocked: UserActivityAchievementUnlockedComponent,
    daily_task_completed: UserActivityDailyTaskCompletedComponent,
  };

  protected readonly activityIconMap: Record<UserActivityType, string> = {
    problem_attempt_summary: 'align-justify',
    challenge_summary: 'zap',
    project_attempt_summary: 'layers',
    test_pass_summary: 'edit-3',
    contest_participation: 'flag',
    arena_participation: 'shield',
    daily_activity: 'activity',
    hard_problem_solved: 'target',
    achievement_unlocked: 'award',
    daily_task_completed: 'check-circle',
  };

  protected readonly cardClassMap: Record<UserActivityType, string> = {
    problem_attempt_summary: 'primary',
    challenge_summary: 'warning',
    project_attempt_summary: 'secondary',
    test_pass_summary: 'secondary',
    contest_participation: 'primary',
    arena_participation: 'warning',
    daily_activity: 'primary',
    hard_problem_solved: 'primary',
    achievement_unlocked: 'warning',
    daily_task_completed: 'secondary',
  };

  protected activities: UserActivityHistoryItem[] = [];
  protected isLoading = false;
  protected isLoadingMore = false;
  protected hasMore = false;
  protected loadError = false;
  protected initialLoaded = false;

  private nextPage = 1;
  private readonly pageSize = 10;

  private readonly usersApiService = inject(UsersApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && this.username) {
      this.resetState();
      this.loadActivities(1);
    }
  }

  protected onLoadMore(): void {
    if (this.isLoading || this.isLoadingMore || !this.hasMore) {
      return;
    }

    this.loadActivities(this.nextPage);
  }

  protected getCardClass(type: UserActivityType): string {
    return this.cardClassMap[type] ?? 'primary';
  }

  protected getIcon(type: UserActivityType): string {
    return this.activityIconMap[type] ?? 'activity';
  }

  private resetState(): void {
    this.activities = [];
    this.isLoading = false;
    this.isLoadingMore = false;
    this.hasMore = false;
    this.loadError = false;
    this.initialLoaded = false;
    this.nextPage = 1;
  }

  private loadActivities(page: number): void {
    if (!this.username) {
      return;
    }

    this.loadError = false;
    this.isLoading = page === 1;
    this.isLoadingMore = page > 1;

    this.usersApiService
      .getUserActivityHistory(this.username, {
        page,
        pageSize: this.pageSize,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
          this.isLoadingMore = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: UserActivityHistoryResponse) => {
          const data = Array.isArray(response)
            ? response
            : response.data;

          this.activities = page === 1
            ? data
            : [...this.activities, ...data];

          if (Array.isArray(response)) {
            this.hasMore = data.length === this.pageSize;
            this.nextPage = page + 1;
          } else {
            this.hasMore = response.page < response.pagesCount;
            this.nextPage = response.page + 1;
          }

          this.initialLoaded = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loadError = true;
          this.hasMore = false;
          this.initialLoaded = true;
          this.cdr.markForCheck();
        },
      });
  }
}
