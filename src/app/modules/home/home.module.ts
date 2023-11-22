import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PostsSectionComponent } from './posts-section/posts-section.component';
import { TopRatingSectionComponent } from './top-rating-section/top-rating-section.component';
import { SystemSectionComponent } from './system-section/system-section.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '@auth/helpers';
import { BirthdaysSectionComponent } from './birthdays-section/birthdays-section.component';
import { CalendarSectionComponent } from './calendar-section/calendar-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { NewsSectionComponent } from './news-section/news-section.component';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { ActivitySectionComponent } from './activity-section/activity-section.component';
import { UsersChartModule } from '@shared/components/users-chart/users-chart.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PostsSectionComponent,
    BirthdaysSectionComponent,
    CalendarSectionComponent,
    TopRatingSectionComponent,
    SystemSectionComponent,
    StatisticsSectionComponent,
    NewsSectionComponent,
    ProfileSectionComponent,
    HeaderSectionComponent,
    ActivitySectionComponent,
    UsersChartModule,
    SpinnerComponent,
  ],
  exports: [
    HomeComponent
  ],
})
export class HomeModule {}
