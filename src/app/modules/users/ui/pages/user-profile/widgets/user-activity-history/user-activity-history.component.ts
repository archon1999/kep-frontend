import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersApiService } from '@app/modules/users';
import { UserActivityHistoryItem, UserActivityHistoryType, } from '@users/domain';
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
import { ActivatedRoute } from '@angular/router';

interface UserActivityHistoryTypeConfig {
  cardClass: string;
  icon: string;
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
export class UserActivityHistoryComponent implements OnInit {
  @Input({required: true}) username: string;

  protected activities: UserActivityHistoryItem[] = [];
  protected loading = false;
  protected hasMore = false;
  protected initialLoad = true;
  protected route = inject(ActivatedRoute);

  private readonly usersApi = inject(UsersApiService);
  private readonly pageSize = 10;
  private nextPage = 1;
  private totalPages = 0;

  private readonly typeConfig: Record<UserActivityHistoryType, UserActivityHistoryTypeConfig> = {
    problem_attempt_summary: {cardClass: 'primary', icon: 'problem'},
    challenge_summary: {cardClass: 'primary', icon: 'challenge'},
    project_attempt_summary: {cardClass: 'primary', icon: 'project'},
    test_pass_summary: {cardClass: 'primary', icon: 'test'},
    contest_participation: {cardClass: 'primary', icon: 'contest'},
    arena_participation: {cardClass: 'primary', icon: 'arena'},
    daily_activity: {cardClass: 'primary', icon: 'todo'},
    hard_problem_solved: {cardClass: 'primary', icon: 'problem'},
    achievement_unlocked: {cardClass: 'primary', icon: 'todo'},
    daily_task_completed: {cardClass: 'primary', icon: 'todo'},
  };

  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.reset();
    this.loadActivities();
  }

  protected loadMore(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loadActivities();
  }

  protected getCardClass(activity: UserActivityHistoryItem): string {
    return `mt-0 ${this.typeConfig[activity.activityType]?.cardClass ?? 'primary'}`;
  }

  protected getIconLabel(activity: UserActivityHistoryItem): string {
    return this.typeConfig[activity.activityType]?.icon ?? this.buildAbbreviation(activity.activityTypeDisplay);
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
      .getUserActivityHistory(this.username, {page: pageToLoad, pageSize: this.pageSize})
      .subscribe((response: PageResult<UserActivityHistoryItem>) => {
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
        this.cdr.detectChanges();
        this.loading = false;
        this.initialLoad = false;
        this.cdr.detectChanges();
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
