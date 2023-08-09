import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlogPostCardModule } from '../blog/components/blog-post-card/blog-post-card.module';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { UsersComponent } from './users.component';
import { UserBlogResolver, UserChallengesRatingResolver, UserContestsRatingResolver, UserEducationsResolver, UserInfoResolver, UserProblemsRatingResolver, UserResolver, UserSkillsResolver, UserSocialResolver, UserTechnologiesResolver, UserWorkExperiencesResolver } from './users.resolver';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserBlogComponent } from './user-profile/user-blog/user-blog.component';
import { UserRatingsComponent } from './user-profile/user-ratings/user-ratings.component';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserCardComponent } from './user-card/user-card.component';
import { UserAchievementsComponent } from './user-profile/user-achievements/user-achievements.component';
import { AchievementComponent } from './user-profile/user-achievements/achievement/achievement.component';
import { UsersChartModule } from 'app/shared/components/users-chart/users-chart.module';

const routes: Routes = [
  { 
    path: 'user/:username',
    component: UserProfileComponent,
    data: {
      animation: 'user',
      title: 'Users.User',
    },
    resolve: {
      user: UserResolver,
      userInfo: UserInfoResolver,
      userSocial: UserSocialResolver,
      userTechnologies: UserTechnologiesResolver,
      userEducations: UserEducationsResolver,
      userWorkExperiences: UserWorkExperiencesResolver,
      userSkills: UserSkillsResolver,
      userBlog: UserBlogResolver,
      userContestsRating: UserContestsRatingResolver,
      userProblemsRating: UserProblemsRatingResolver,
      userChallengesRating: UserChallengesRatingResolver,
    }
  },
  {
    path: '',
    component: UsersComponent,
    data: { animation: 'users '},
    title: 'Users.Users',   
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    UserProfileComponent,
    UserBlogComponent,
    UserRatingsComponent,
    UserCardComponent,
    UserAchievementsComponent,
    AchievementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreDirectivesModule,
    TranslateModule,
    ContentHeaderModule,
    NgbProgressbarModule,
    CorePipesModule,
    NgbModule,
    UserPopoverModule,
    NgbTooltipModule,
    NgbPaginationModule,
    BlogPostCardModule,
    NgbTooltipModule,
    ContestantViewModule,
    FormsModule,
    NgApexchartsModule,
    ContestantViewModule,
    UsersChartModule,
  ],
  providers: [
    UserResolver,
    UserInfoResolver,
    UserSkillsResolver,
    UserTechnologiesResolver,
    UserEducationsResolver,
    UserWorkExperiencesResolver,
    UserBlogResolver,
    UserBlogResolver,
    UserEducationsResolver,
    UserInfoResolver,
    UserResolver,
    UserSkillsResolver,
    UserTechnologiesResolver,
    UserWorkExperiencesResolver,
    UserContestsRatingResolver,
    UserSocialResolver,
    UserProblemsRatingResolver,
    UserChallengesRatingResolver,
  ]
})
export class UsersModule { }
