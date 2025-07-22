import { Component, inject } from '@angular/core';
import { Achievement } from '@users/domain';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { AchievementComponent } from "@users/ui/pages/user-profile/user-achievements/achievement/achievement.component";
import { UsersApiService } from "@app/modules/users";
import {
  UserCompetitionPrizesComponent
} from "@users/ui/pages/user-profile/user-competition-prizes/user-competition-prizes.component";

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

  protected readonly Tab = Tab;

  protected usersApiService = inject(UsersApiService);

  getData(): Observable<Achievement[]> {
    return this.usersApiService.getUserAchievements(this.route.snapshot.parent.params.username);
  }

  afterLoadData(achievements: Achievement[]) {
    this.allAchievements = achievements;
    this.completedAchievements = achievements.filter(
      (achievement: Achievement) => {
        return achievement.userResult.done;
      }
    );
    this.notCompletedAchievements = achievements.filter(
      (achievement: Achievement) => {
        return !achievement.userResult.done;
      }
    );
    this.achievements = this.completedAchievements;
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
}
