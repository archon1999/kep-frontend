import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from 'core/directives/directives';
import { CorePipesModule } from 'core/pipes/pipes.module';
import { NgbModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { KepcoinViewModule } from 'app/shared/components/kepcoin-view/kepcoin-view.module';
import { PaginationModule } from 'app/shared/components/pagination/pagination.module';
import { StreakModule } from 'app/shared/components/streak/streak.module';
import { TableOrderingModule } from 'app/shared/components/table-ordering/table-ordering.module';
import { UsersChartModule } from 'app/shared/components/users-chart/users-chart.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { BlogPostCardModule } from '../blog/components/blog-post-card/blog-post-card.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { UserCardComponent } from './components/user-card/user-card.component';
import { AchievementComponent } from './pages/user-profile/user-achievements/achievement/achievement.component';
import { UserAchievementsComponent } from './pages/user-profile/user-achievements/user-achievements.component';
import { UserBlogComponent } from './pages/user-profile/user-blog/user-blog.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserRatingsComponent } from './pages/user-profile/user-ratings/user-ratings.component';
import { UsersComponent } from './pages/users/users.component';
import {
  UserBlogResolver,
  UserChallengesRatingResolver,
  UserContestsRatingResolver,
  UserEducationsResolver,
  UserInfoResolver,
  UserProblemsRatingResolver,
  UserResolver,
  UserSkillsResolver,
  UserSocialResolver,
  UserTechnologiesResolver,
  UserWorkExperiencesResolver
} from './users.resolver';
import { NgSelectModule } from 'app/shared/third-part-modules/ng-select/ng-select.module';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { NgxCountriesModule } from '@shared/third-part-modules/ngx-countries/ngx-countries.module';

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
    data: { animation: 'users ' },
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
    BlogPostCardModule,
    NgbTooltipModule,
    ContestantViewModule,
    FormsModule,
    NgApexchartsModule,
    ContestantViewModule,
    UsersChartModule,
    ChallengesUserViewModule,
    KepcoinViewModule,
    StreakModule,
    TableOrderingModule,
    PaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    ProblemsPipesModule,
    NgxCountriesModule.forRoot({
      defaultLocale: 'en'
    }),
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
export class UsersModule {
}
