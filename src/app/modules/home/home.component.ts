import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SoundsService } from '@shared/services/sounds/sounds.service';

import { PostsSectionComponent } from './posts-section/posts-section.component';
import { BirthdaysSectionComponent } from './birthdays-section/birthdays-section.component';
import { TopRatingSectionComponent } from './top-rating-section/top-rating-section.component';
import { SystemSectionComponent } from './system-section/system-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { NewsSectionComponent } from './news-section/news-section.component';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { ActivitySectionComponent } from './activity-section/activity-section.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UsersChartCardComponent } from '@users/components/users-chart-card/users-chart-card.component';
import { LastProblemsSectionComponent } from '@app/modules/home/last-problems-section/last-problems-section.component';
import { ContestsSectionComponent } from '@app/modules/home/contests-section/contests-section.component';
import { RanksSectionComponent } from '@app/modules/home/ranks-section/ranks-section.component';
import { BasePageComponent } from "@app/common";
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { TranslatePipe } from "@ngx-translate/core";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    PostsSectionComponent,
    BirthdaysSectionComponent,
    TopRatingSectionComponent,
    SystemSectionComponent,
    StatisticsSectionComponent,
    NewsSectionComponent,
    ProfileSectionComponent,
    HeaderSectionComponent,
    ActivitySectionComponent,
    SpinnerComponent,
    UsersChartCardComponent,
    LastProblemsSectionComponent,
    ContestsSectionComponent,
    RanksSectionComponent,
    ContentHeaderModule,
    TranslatePipe,
    KepCardComponent
  ]
})
export class HomeComponent extends BasePageComponent implements OnInit {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  public homeSoundSrc: string;

  constructor(public soundService: SoundsService) {
    super();
  }

  ngOnInit(): void {
    this.homeSoundSrc = this.soundService.getHomeSoundSrc();
    setTimeout(() => this.audio.nativeElement.play());
    super.ngOnInit();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.HOME',
      breadcrumb: {
        links: [
          {
            name: 'KEP.uz',
            isLink: false,
          },
          {
            name: 'MENU.HOME',
            isLink: false,
          },
        ]
      }
    };
  }
}
