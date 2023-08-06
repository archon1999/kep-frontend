import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { BlogPostCardModule } from '../blog/components/blog-post-card/blog-post-card.module';
import { ContestCardModule } from '../contests/components/contest-card/contest-card.module';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { HomeComponent } from './home.component';
import { NewsSectionComponent } from './news-section/news-section.component';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { ContestantViewModule } from '../../shared/components/contestant-view/contestant-view.module';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { ActivitySectionComponent } from './activity-section/activity-section.component';
import { BirthdaysSectionComponent } from './birthdays-section/birthdays-section.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'app/auth/helpers';
import { SlideMainComponent } from './header-section/slides/slide-main/slide-main.component';
import { SlideContestsComponent } from './header-section/slides/slide-contests/slide-contests.component';
import { UsersChartModule } from "../../shared/components/users-chart/users-chart.module";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    NewsSectionComponent,
    ProfileSectionComponent,
    HeaderSectionComponent,
    StatisticsSectionComponent,
    ActivitySectionComponent,
    BirthdaysSectionComponent,
    SlideMainComponent,
    SlideContestsComponent,
  ],
  imports: [
    CommonModule,
    CorePipesModule,
    ContentHeaderModule,
    RouterModule.forChild(routes),
    CoreDirectivesModule,
    TranslateModule,
    CoreDirectivesModule,
    UserPopoverModule,
    NgxUsefulSwiperModule,
    BlogPostCardModule,
    NgApexchartsModule,
    CountUpModule,
    ContestantViewModule,
    NgbTooltipModule,
    ContestCardModule,
    UsersChartModule,
  ],
  exports: [
    HomeComponent
  ],

})
export class HomeModule { }
