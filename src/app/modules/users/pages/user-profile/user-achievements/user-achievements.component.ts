import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Achievement } from '../../../users.models';
import { UsersService } from '../../../users.service';

@Component({
  selector: 'user-achievements',
  templateUrl: './user-achievements.component.html',
  styleUrls: ['./user-achievements.component.scss']
})
export class UserAchievementsComponent implements OnInit {

  public achievements: Array<Achievement> = [];
  public allAchievements: Array<Achievement> = [];
  public completedAchievements: Array<Achievement> = [];
  public notCompletedAchievements: Array<Achievement> = [];

  public type = 1;

  constructor(
    public service: UsersService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.service.getUserAchievements(user.username).subscribe(
        (achievements: Array<Achievement>) => {
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
    this.type = type;
    if (type === 1) {
      this.achievements = this.completedAchievements;
    } else if (type === 2) {
      this.achievements = this.notCompletedAchievements;
    } else {
      this.achievements = this.allAchievements;
    }
  }

}
