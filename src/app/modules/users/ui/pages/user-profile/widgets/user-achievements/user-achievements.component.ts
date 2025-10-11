import { Component, inject } from '@angular/core';
import { Achievement } from '@users/domain';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { AchievementComponent } from './achievement/achievement.component';
import { UsersApiService } from '@app/modules/users';
import {
  UserCompetitionPrizesComponent,
} from '../user-competition-prizes/user-competition-prizes.component';

enum Tab {
  CompletedAchievements = 1,
  NotCompletedAchievements,
  AllAchievements
}

@Component({
  selector: 'user-achievements',
  templateUrl: './user-achievements.component.html',
  styleUrls: ['./user-achievements.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    AchievementComponent,
    SpinnerComponent,
    EmptyResultComponent,
    KepCardComponent,
    UserCompetitionPrizesComponent
  ]
})
export class UserAchievementsComponent extends BaseLoadComponent<Achievement[]> {
  public achievements: Array<Achievement> = [];
  public allAchievements: Array<Achievement> = [];
  public completedAchievements: Array<Achievement> = [];
  public notCompletedAchievements: Array<Achievement> = [];

  public tab = Tab.CompletedAchievements;

  override loadOnInit = false;

  protected readonly Tab = Tab;

  protected usersApiService = inject(UsersApiService);

  protected currentUsername: string | null = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const parentParams$ = this.route.parent?.params ?? of({});

    combineLatest([this.route.params, parentParams$])
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(([params, parentParams]) => params?.['username'] ?? parentParams?.['username']),
        filter((username): username is string => !!username),
        distinctUntilChanged(),
      )
      .subscribe(username => {
        if (username === this.currentUsername && this.achievements.length) {
          return;
        }

        this.currentUsername = username;
        this.resetAchievements();
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<Achievement[]> {
    const username = this.currentUsername ?? this.route.snapshot.parent?.params?.['username'];

    return this.usersApiService.getUserAchievements(username!);
  }

  override afterLoadData(achievements: Achievement[]) {
    this.allAchievements = achievements ?? [];
    this.completedAchievements = this.allAchievements.filter(
      (achievement: Achievement) => achievement.userResult.done
    );
    this.notCompletedAchievements = this.allAchievements.filter(
      (achievement: Achievement) => !achievement.userResult.done
    );
    this.update(this.tab);
  }

  update(type: number) {
    this.tab = type;
    if (type === Tab.CompletedAchievements) {
      this.achievements = this.completedAchievements;
    } else if (type === Tab.NotCompletedAchievements) {
      this.achievements = this.notCompletedAchievements;
    } else if (type === Tab.AllAchievements) {
      this.achievements = this.allAchievements;
    }
  }

  private resetAchievements(): void {
    this.achievements = [];
    this.allAchievements = [];
    this.completedAchievements = [];
    this.notCompletedAchievements = [];
  }
}
