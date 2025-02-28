import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Achievement } from '@users/users.models';
import { UsersApiService } from '@users/users-api.service';
import { CoreCommonModule } from '@core/common.module';
import { AchievementComponent } from '@users/pages/user-profile/user-achievements/achievement/achievement.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

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
    KepCardComponent
  ]
})
export class UserAchievementsComponent implements OnInit {

  public achievements: Array<Achievement> = [];
  public allAchievements: Array<Achievement> = [];
  public completedAchievements: Array<Achievement> = [];
  public notCompletedAchievements: Array<Achievement> = [];

  public tab = Tab.CompletedAchievements;

  public isLoading = true;
  protected readonly Tab = Tab;

  constructor(
    public service: UsersApiService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({user}) => {
      this.service.getUserAchievements(user.username).subscribe(
        (achievements: Array<Achievement>) => {
          this.isLoading = false;
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
      );
    });
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
