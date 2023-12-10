import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SoundsService } from '@shared/services/sounds/sounds.service';
import { CommonModule } from '@angular/common';
import { PostsSectionComponent } from './posts-section/posts-section.component';
import { BirthdaysSectionComponent } from './birthdays-section/birthdays-section.component';
import { CalendarSectionComponent } from './calendar-section/calendar-section.component';
import { TopRatingSectionComponent } from './top-rating-section/top-rating-section.component';
import { SystemSectionComponent } from './system-section/system-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { NewsSectionComponent } from './news-section/news-section.component';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { ActivitySectionComponent } from './activity-section/activity-section.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UsersChartCardComponent } from '@shared/components/users-chart/users-chart-card/users-chart-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
    SpinnerComponent,
    UsersChartCardComponent,
  ]
})
export class HomeComponent implements OnInit {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  public homeSoundSrc: string;

  constructor(public soundService: SoundsService) {}

  ngOnInit(): void {
    this.homeSoundSrc = this.soundService.getHomeSoundSrc();
    setTimeout(() => this.audio.nativeElement.play());
  }
}
